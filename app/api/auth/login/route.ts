import crypto from "node:crypto";

import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

import { verifyPassword } from "../../../../lib/auth/password";
import {
  clearRateLimit,
  consumeRateLimit,
  getRequestIp,
} from "../../../../lib/auth/rate-limit";
import { prisma } from "../../../../lib/prisma";

type LoginBody = {
  email?: string;
  password?: string;
  portal?: "FLOW" | "EMPLOYEE";
};

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function hashToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginBody;

    const email = normalizeEmail(body.email ?? "");
    const password = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json(
        {
          error:
            "L’adresse e-mail et le mot de passe sont obligatoires.",
        },
        { status: 400 }
      );
    }

    const requestHeaders = await headers();
    const ipAddress = getRequestIp(requestHeaders);
    const loginRateLimitIdentifier = `${ipAddress}|${email}`;

    const loginRateLimit = await consumeRateLimit({
      action: "AUTH_LOGIN",
      identifier: loginRateLimitIdentifier,
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });

    if (!loginRateLimit.allowed) {
      return NextResponse.json(
        {
          error:
            "Trop de tentatives de connexion. Réessayez dans quelques minutes.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              loginRateLimit.retryAfterSeconds,
            ),
          },
        },
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        memberships: {
          where: {
            isActive: true,
          },
          include: {
            company: true,
            workforce: {
              select: {
                id: true,
                isActive: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        {
          error: "Identifiants incorrects.",
        },
        { status: 401 }
      );
    }

    const passwordIsValid = await verifyPassword(
      password,
      user.passwordHash
    );

    if (!passwordIsValid) {
      return NextResponse.json(
        {
          error: "Identifiants incorrects.",
        },
        { status: 401 }
      );
    }

    const membership = user.memberships[0];

    if (!membership) {
      return NextResponse.json(
        {
          error:
            "Aucun accès actif à une entreprise n’est associé à ce compte.",
        },
        { status: 403 }
      );
    }

    const portal = body.portal ?? "FLOW";
    const isEmployee = Boolean(
      membership.workforce?.isActive,
    );

    if (portal === "EMPLOYEE" && !isEmployee) {
      return NextResponse.json(
        {
          error:
            "Ce compte n'est pas un compte salarié Organ·IA.",
        },
        { status: 403 }
      );
    }

    if (portal === "FLOW" && isEmployee) {
      return NextResponse.json(
        {
          error:
            "Utilisez le portail Organ·IA Salarié pour vous connecter.",
          employeePortal: true,
        },
        { status: 403 }
      );
    }

    await clearRateLimit(
      "AUTH_LOGIN",
      loginRateLimitIdentifier,
    );
    const sessionToken = crypto.randomBytes(48).toString("hex");
    const tokenHash = hashToken(sessionToken);
    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    const userAgent =
      requestHeaders.get("user-agent") ?? null;

    await prisma.$transaction([
      prisma.session.create({
        data: {
          userId: user.id,
          membershipId: membership.id,
          tokenHash,
          expiresAt,
          ipAddress,
          userAgent,
        },
      }),

      prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          lastLoginAt: new Date(),
        },
      }),

      prisma.auditLog.create({
        data: {
          companyId: membership.companyId,
          actorId: user.id,
          action: "USER_LOGGED_IN",
          entityType: "User",
          entityId: user.id,
          ipAddress,
        },
      }),
    ]);


    const cookieStore = await cookies();

    cookieStore.set("optiflow_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    return NextResponse.json({
      message: "Connexion réussie.",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      company: {
        id: membership.company.id,
        name: membership.company.name,
      },
      role: membership.role,
      employee: Boolean(
        membership.workforce?.isActive,
      ),
    });
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        error: "Impossible de vous connecter.",
      },
      { status: 500 }
    );
  }
}