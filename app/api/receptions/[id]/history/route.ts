import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../../../lib/auth/session";
import { prisma } from "../../../../../lib/prisma";

function parseReceptionId(value: string) {
  const id = Number(value);

  return Number.isInteger(id) && id > 0
    ? id
    : null;
}

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  const auth = await getCurrentSession();

  if (!auth) {
    return NextResponse.json(
      {
        error: "Authentification requise.",
      },
      {
        status: 401,
      },
    );
  }

  const { id } = await context.params;

  const receptionId =
    parseReceptionId(id);

  if (!receptionId) {
    return NextResponse.json(
      {
        error:
          "Identifiant de réception invalide.",
      },
      {
        status: 400,
      },
    );
  }

  const reception =
    await prisma.reception.findFirst({
      where: {
        id: receptionId,
        companyId:
          auth.company.id,
      },
      select: {
        id: true,
        number: true,
        supplier: true,
        carrier: true,
        dock: true,
        pallets: true,
        status: true,

        scheduledAt: true,
        arrivedAt: true,
        unloadingStartedAt: true,
        inspectionStartedAt: true,
        completedAt: true,
        createdAt: true,
        updatedAt: true,

        receptionEvents: {
          orderBy: {
            happenedAt: "asc",
          },
          select: {
            id: true,
            type: true,
            fromStatus: true,
            toStatus: true,
            happenedAt: true,
            createdAt: true,
          },
        },

        receptionDocuments: {
          orderBy: {
            capturedAt: "asc",
          },
          select: {
            id: true,
            type: true,
            name: true,
            contentType: true,
            size: true,
            capturedAt: true,
            createdAt: true,
          },
        },
      },
    });

  if (!reception) {
    return NextResponse.json(
      {
        error:
          "Réception introuvable.",
      },
      {
        status: 404,
      },
    );
  }

  return NextResponse.json({
    success: true,
    reception,
  });
}
