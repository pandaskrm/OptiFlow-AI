import crypto from "node:crypto";

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Resend } from "resend";

import {
  consumeRateLimit,
  getRequestIp,
} from "../../../../lib/auth/rate-limit";
import { prisma } from "../../../../lib/prisma";

const GENERIC_MESSAGE =
  "Si un compte correspond à cette adresse, un e-mail de réinitialisation vient d’être envoyé.";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function getAppUrl(request: Request) {
  const configuredUrl = process.env.APP_URL?.trim();

  if (
    configuredUrl &&
    !(process.env.NODE_ENV === "production" &&
      configuredUrl.includes("localhost"))
  ) {
    return configuredUrl.replace(/\/$/, "");
  }

  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();

  if (process.env.NODE_ENV === "production" && vercelUrl) {
    return `https://${vercelUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;
  }

  const deploymentUrl = process.env.VERCEL_URL?.trim();

  if (process.env.NODE_ENV === "production" && deploymentUrl) {
    return `https://${deploymentUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;
  }

  if (process.env.NODE_ENV !== "production") {
    return new URL(request.url).origin;
  }

  return "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      portal?: "FLOW" | "EMPLOYEE";
    };

    const email = normalizeEmail(body.email ?? "");

    if (!email) {
      return NextResponse.json(
        { error: "L’adresse e-mail est obligatoire." },
        { status: 400 },
      );
    }

    const requestHeaders = await headers();
    const ipAddress = getRequestIp(requestHeaders);

    const forgotRateLimit = await consumeRateLimit({
      action: "AUTH_FORGOT_PASSWORD",
      identifier: `${ipAddress}|${email}`,
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });

    if (!forgotRateLimit.allowed) {
      return NextResponse.json(
        { message: GENERIC_MESSAGE },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              forgotRateLimit.retryAfterSeconds,
            ),
          },
        },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ message: GENERIC_MESSAGE });
    }

    const apiKey = process.env.RESEND_API_KEY?.trim();
    const emailFrom = process.env.EMAIL_FROM?.trim();
    const appUrl = getAppUrl(request);

    if (!apiKey || !emailFrom || !appUrl) {
      console.error(
        "Password reset email configuration is incomplete.",
      );

      return NextResponse.json(
        {
          error:
            "Le service de réinitialisation est temporairement indisponible.",
        },
        { status: 503 },
      );
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await prisma.$transaction([
      prisma.passwordResetToken.deleteMany({
        where: {
          userId: user.id,
          usedAt: null,
        },
      }),
      prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt,
        },
      }),
    ]);

    const portal =
      body.portal === "EMPLOYEE" ? "EMPLOYEE" : "FLOW";

    const resetUrl =
      `${appUrl}/reset-password?token=${encodeURIComponent(rawToken)}` +
      `&portal=${portal}`;

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: emailFrom,
      to: user.email,
      subject: "Réinitialisation de votre mot de passe Organ•IA",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#0f172a">
          <h2>Réinitialisation du mot de passe</h2>
          <p>Bonjour ${user.firstName},</p>
          <p>Une demande de réinitialisation a été effectuée pour votre compte Organ•IA.</p>
          <p>
            <a href="${resetUrl}"
               style="display:inline-block;background:#0891b2;color:white;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:bold">
              Choisir un nouveau mot de passe
            </a>
          </p>
          <p>Ce lien est valable pendant 30 minutes et ne peut être utilisé qu’une seule fois.</p>
          <p>Si vous n’êtes pas à l’origine de cette demande, vous pouvez ignorer cet e-mail.</p>
        </div>
      `,
    });

    if (error) {
      await prisma.passwordResetToken.deleteMany({
        where: { tokenHash },
      });

      console.error(
        "Password reset email could not be sent.",
        error,
      );

      return NextResponse.json(
        {
          error:
            "Le service de réinitialisation est temporairement indisponible.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json({ message: GENERIC_MESSAGE });
  } catch (error) {
    console.error("Password reset request failed.", error);

    return NextResponse.json(
      {
        error:
          "Le service de réinitialisation est temporairement indisponible.",
      },
      { status: 500 },
    );
  }
}
