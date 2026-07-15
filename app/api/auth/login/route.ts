import crypto from "node:crypto";

import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

import { verifyPassword } from "../../../../lib/auth/password";
import { prisma } from "../../../../lib/prisma";

type LoginBody = {
  email?: string;
  password?: string;
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

    const sessionToken = crypto.randomBytes(48).toString("hex");
    const tokenHash = hashToken(sessionToken);
    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    const requestHeaders = await headers();

    const forwardedFor =
      requestHeaders.get("x-forwarded-for") ?? "";

    const ipAddress =
      forwardedFor.split(",")[0]?.trim() ||
      requestHeaders.get("x-real-ip") ||
      null;

    const userAgent =
      requestHeaders.get("user-agent") ?? null;

    await prisma.$transaction([
      prisma.session.create({
        data: {
          userId: user.id,
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