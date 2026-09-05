import crypto from "node:crypto";

import { headers } from "next/headers";
import { NextResponse } from "next/server";

import {
  hashPassword,
  isPasswordValid,
  PASSWORD_POLICY_MESSAGE,
} from "../../../../lib/auth/password";
import {
  consumeRateLimit,
  getRequestIp,
} from "../../../../lib/auth/rate-limit";
import { prisma } from "../../../../lib/prisma";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      token?: string;
      password?: string;
    };

    const token = body.token?.trim() ?? "";
    const password = body.password ?? "";

    if (!token) {
      return NextResponse.json(
        { error: "Lien de réinitialisation invalide." },
        { status: 400 },
      );
    }

    if (!isPasswordValid(password)) {
      return NextResponse.json(
        { error: PASSWORD_POLICY_MESSAGE },
        { status: 400 },
      );
    }

    const tokenHash = hashToken(token);

    const requestHeaders = await headers();
    const ipAddress = getRequestIp(requestHeaders);

    const resetRateLimit = await consumeRateLimit({
      action: "AUTH_RESET_PASSWORD",
      identifier: ipAddress,
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });

    if (!resetRateLimit.allowed) {
      return NextResponse.json(
        {
          error:
            "Trop de tentatives de r\u00e9initialisation. R\u00e9essayez dans quelques minutes.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              resetRateLimit.retryAfterSeconds
            ),
          },
        },
      );
    }

    const resetToken =
      await prisma.passwordResetToken.findUnique({
        where: { tokenHash },
        select: {
          id: true,
          userId: true,
          expiresAt: true,
          usedAt: true,
          user: {
            select: {
              isActive: true,
            },
          },
        },
      });

    if (
      !resetToken ||
      resetToken.usedAt ||
      resetToken.expiresAt <= new Date() ||
      !resetToken.user.isActive
    ) {
      return NextResponse.json(
        {
          error:
            "Ce lien est invalide ou a expiré. Demandez un nouveau lien.",
        },
        { status: 400 },
      );
    }

    const passwordHash = await hashPassword(password);
    const now = new Date();

    const resetApplied = await prisma.$transaction(
      async (transaction) => {
        const claimedToken =
          await transaction.passwordResetToken.updateMany({
            where: {
              id: resetToken.id,
              usedAt: null,
              expiresAt: { gt: now },
            },
            data: { usedAt: now },
          });

        if (claimedToken.count !== 1) {
          return false;
        }

        await transaction.user.update({
          where: { id: resetToken.userId },
          data: { passwordHash },
        });

        await transaction.passwordResetToken.updateMany({
          where: {
            userId: resetToken.userId,
            id: { not: resetToken.id },
            usedAt: null,
          },
          data: { usedAt: now },
        });

        await transaction.session.updateMany({
          where: {
            userId: resetToken.userId,
            revokedAt: null,
          },
          data: { revokedAt: now },
        });

        return true;
      },
    );

    if (!resetApplied) {
      return NextResponse.json(
        {
          error:
            "Ce lien est invalide ou a expir\u00e9. Demandez un nouveau lien.",
        },
        { status: 400 },
      );
    }
    return NextResponse.json({
      message:
        "Votre mot de passe a été modifié. Vous pouvez maintenant vous reconnecter.",
    });
  } catch (error) {
    console.error("Password reset failed.", error);

    return NextResponse.json(
      { error: "Impossible de modifier le mot de passe." },
      { status: 500 },
    );
  }
}
