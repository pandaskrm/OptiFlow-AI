import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../../../lib/auth/session";
import { prisma } from "../../../../../lib/prisma";

const HR_ROLES = new Set([
  "ADMIN",
  "HR",
]);

export async function POST(request: Request) {
  const session = await getCurrentSession();

  const body = await request.json().catch(() => null);

  const presenceDayId =
    typeof body?.presenceDayId === "string"
      ? body.presenceDayId.trim()
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

  if (!HR_ROLES.has(session.membership.role)) {
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

  if (!presenceDay.managerValidatedAt) {
    return NextResponse.json(
      { error: "La validation manager est obligatoire avant la validation RH." },
      { status: 409 },
    );
  }

  if (presenceDay.hrValidatedAt) {
    return NextResponse.json(
      { error: "Cette journee a deja ete validee par les RH." },
      { status: 409 },
    );
  }

  const finalMinutes =
    presenceDay.approvedMinutes ?? presenceDay.calculatedMinutes;

  const validatedDay = await prisma.presenceDay.update({
    where: {
      id: presenceDay.id,
    },
    data: {
      approvedMinutes: finalMinutes,
      hrValidatedAt: new Date(),
      hrValidatedBy: session.user.id,
      status: "HR_VALIDATED",
    },
  });
  return NextResponse.json({
    success: true,
    presenceDay: validatedDay,
  });
}














