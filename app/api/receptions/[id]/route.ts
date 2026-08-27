import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../../lib/auth/session";
import { prisma } from "../../../../lib/prisma";

const AT_DOCK_STATUS = "À quai";
const UNLOADING_STATUS = "Déchargement";
const INSPECTION_STATUS = "Contrôle qualité";
const COMPLETED_STATUS = "Terminée";

function parseReceptionId(value: string) {
  const id = Number(value);

  return Number.isInteger(id) && id > 0
    ? id
    : null;
}

function canDeleteCompletedReception(role: string) {
  return (
    role === "OWNER" ||
    role === "ADMIN" ||
    role === "LOGISTICS_MANAGER"
  );
}

export async function PATCH(
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

  let body: {
    status?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        error:
          "Corps de requête invalide.",
      },
      {
        status: 400,
      },
    );
  }

  const nextStatus =
    body.status?.trim();

  if (!nextStatus) {
    return NextResponse.json(
      {
        error:
          "Le nouveau statut est obligatoire.",
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
        status: true,
        arrivedAt: true,
        unloadingStartedAt: true,
        inspectionStartedAt: true,
        completedAt: true,
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

  const now = new Date();

  const eventType =
    nextStatus === AT_DOCK_STATUS
      ? "ARRIVED_AT_DOCK"
      : nextStatus === UNLOADING_STATUS
        ? "UNLOADING_STARTED"
        : nextStatus === INSPECTION_STATUS
          ? "INSPECTION_STARTED"
          : nextStatus === COMPLETED_STATUS
            ? "RECEPTION_COMPLETED"
            : "STATUS_CHANGED";

  const updated =
    await prisma.$transaction(
      async (tx) => {
        const receptionUpdate =
          await tx.reception.update({
            where: {
              id: reception.id,
            },
            data: {
              status: nextStatus,

              arrivedAt:
                nextStatus === AT_DOCK_STATUS
                  ? reception.arrivedAt ?? now
                  : reception.arrivedAt,

              unloadingStartedAt:
                nextStatus === UNLOADING_STATUS
                  ? reception.unloadingStartedAt ?? now
                  : reception.unloadingStartedAt,

              inspectionStartedAt:
                nextStatus === INSPECTION_STATUS
                  ? reception.inspectionStartedAt ?? now
                  : reception.inspectionStartedAt,

              completedAt:
                nextStatus === COMPLETED_STATUS
                  ? reception.completedAt ?? now
                  : reception.completedAt,
            },
          });

        await tx.receptionEvent.create({
          data: {
            companyId:
              auth.company.id,
            receptionId:
              reception.id,
            type:
              eventType,
            fromStatus:
              reception.status,
            toStatus:
              nextStatus,
            happenedAt:
              now,
          },
        });

        await tx.auditLog.create({
          data: {
            companyId:
              auth.company.id,
            actorId:
              auth.user.id,
            action:
              "RECEPTION_STATUS_UPDATED",
            entityType:
              "Reception",
            entityId:
              String(reception.id),
            details:
              JSON.stringify({
                receptionNumber:
                  reception.number,
                previousStatus:
                  reception.status,
                nextStatus,
                eventType,
                happenedAt:
                  now,
                arrivedAt:
                  receptionUpdate.arrivedAt,
                unloadingStartedAt:
                  receptionUpdate.unloadingStartedAt,
                inspectionStartedAt:
                  receptionUpdate.inspectionStartedAt,
                completedAt:
                  receptionUpdate.completedAt,
              }),
          },
        });

        return receptionUpdate;
      },
    );

  return NextResponse.json(
    updated,
  );
}

export async function DELETE(
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
        completedAt: true,
        createdAt: true,
        _count: {
          select: {
            receptionDocuments: true,
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

  const isCompleted =
    reception.status ===
    COMPLETED_STATUS;

  if (
    isCompleted &&
    !canDeleteCompletedReception(
      auth.membership.role,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Cette réception est terminée et protégée. Droits de gestion avancée requis pour la supprimer.",
      },
      {
        status: 403,
      },
    );
  }

  await prisma.$transaction(
    async (tx) => {
      await tx.auditLog.create({
        data: {
          companyId:
            auth.company.id,
          actorId:
            auth.user.id,
          action:
            isCompleted
              ? "COMPLETED_RECEPTION_DELETED"
              : "RECEPTION_DELETED",
          entityType:
            "Reception",
          entityId:
            String(reception.id),
          details:
            JSON.stringify({
              receptionNumber:
                reception.number,
              supplier:
                reception.supplier,
              carrier:
                reception.carrier,
              dock:
                reception.dock,
              pallets:
                reception.pallets,
              status:
                reception.status,
              scheduledAt:
                reception.scheduledAt,
              completedAt:
                reception.completedAt,
              documentCount:
                reception._count
                  .receptionDocuments,
              deletedByRole:
                auth.membership.role,
            }),
        },
      });

      await tx.reception.delete({
        where: {
          id: reception.id,
        },
      });
    },
  );

  return NextResponse.json({
    success: true,
    message:
      isCompleted
        ? "Réception terminée supprimée avec traçabilité."
        : "Réception supprimée.",
  });
}
