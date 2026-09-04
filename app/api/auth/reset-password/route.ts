import crypto from "node:crypto";

import { NextResponse } from "next/server";

import {
  hashPassword,
  isPasswordValid,
  PASSWORD_POLICY_MESSAGE,
} from "../../../../lib/auth/password";
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

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: now },
      }),
      prisma.passwordResetToken.updateMany({
        where: {
          userId: resetToken.userId,
          id: { not: resetToken.id },
          usedAt: null,
        },
        data: { usedAt: now },
      }),
      prisma.session.updateMany({
        where: {
          userId: resetToken.userId,
          revokedAt: null,
        },
        data: { revokedAt: now },
      }),
    ]);

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
