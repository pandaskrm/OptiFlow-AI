import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../../../lib/auth/session";
import { prisma } from "../../../../../lib/prisma";

const MANAGER_ROLES = new Set([
  "ADMIN",
  "LOGISTICS_MANAGER",
  "TEAM_LEADER",
]);

export async function POST(request: Request) {
  const session = await getCurrentSession();

  const body = await request.json().catch(() => null);

  const presenceDayId =
    typeof body?.presenceDayId === "string"
      ? body.presenceDayId.trim()
      : "";

  const approvedMinutes =
    typeof body?.approvedMinutes === "number" &&
    Number.isInteger(body.approvedMinutes) &&
    body.approvedMinutes >= 0
      ? body.approvedMinutes
      : null;

  const reason =
    typeof body?.reason === "string"
      ? body.reason.trim()
      : "";

  if (!presenceDayId) {
    return NextResponse.json(
      { error: "presenceDayId requis." },
      { status: 400 },
    );
  }

  if (!session) {
    return NextResponse.json(
      { error: "Non authentifie." },
      { status: 401 },
    );
  }

  if (!MANAGER_ROLES.has(session.membership.role)) {
    return NextResponse.json(
      { error: "Vous n'avez pas l'autorisation de valider les pointages." },
      { status: 403 },
    );
  }

  const presenceDay = await prisma.presenceDay.findFirst({
    where: {
      id: presenceDayId,
      workforce: {
        companyId: session.company.id,
      },
    },
  });

  if (!presenceDay) {
    return NextResponse.json(
      { error: "Journee de presence introuvable." },
      { status: 404 },
    );
  }

  if (presenceDay.hrValidatedAt) {
    return NextResponse.json(
      { error: "Cette journee a deja ete validee par les RH." },
      { status: 409 },
    );
  }

  const finalMinutes =
    approvedMinutes ?? presenceDay.calculatedMinutes;

  if (
    finalMinutes !== presenceDay.calculatedMinutes &&
    !reason
  ) {
    return NextResponse.json(
      { error: "Un motif est obligatoire pour modifier le temps calcule." },
      { status: 400 },
    );
  }

  const validatedDay = await prisma.$transaction(async (tx) => {
    if (finalMinutes !== presenceDay.calculatedMinutes) {
      await tx.presenceCorrection.create({
        data: {
          presenceDayId: presenceDay.id,
          originalMinutes: presenceDay.calculatedMinutes,
          correctedMinutes: finalMinutes,
          reason,
          correctedBy: session.user.id,
        },
      });
    }

    return tx.presenceDay.update({
      where: {
        id: presenceDay.id,
      },
      data: {
        approvedMinutes: finalMinutes,
        managerValidatedAt: new Date(),
        managerValidatedBy: session.user.id,
        status: "MANAGER_VALIDATED",
      },
    });
  });
  return NextResponse.json({
    success: true,
    presenceDay: validatedDay,
  });
}










