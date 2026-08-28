import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../../lib/auth/session";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
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

  try {
    const receptions =
      await prisma.reception.findMany({
        where: {
          companyId: auth.company.id,
          status: "Terminée",
        },

        orderBy: [
          {
            completedAt: "desc",
          },
          {
            createdAt: "desc",
          },
        ],

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
          qualityResult: true,
          qualityValidatedBy: true,
          qualityValidatedAt: true,
          qualityComment: true,

          createdAt: true,
          updatedAt: true,

          receptionInspectors: {
          orderBy: {
            assignedAt: "asc",
          },
          select: {
            id: true,
            userId: true,
            firstName: true,
            lastName: true,
            assignedAt: true,
          },
        },

        receptionDocuments: {
            orderBy: {
              capturedAt: "desc",
            },
            select: {
              id: true,
              type: true,
              name: true,
              contentType: true,
              size: true,
              capturedAt: true,
            },
          },

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
            },
          },
        },
      });

    return NextResponse.json({
      success: true,
      receptions,
    });
  } catch (error) {
    console.error(
      "Reception history error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Impossible de charger l'historique des réceptions.",
      },
      {
        status: 500,
      },
    );
  }
}
