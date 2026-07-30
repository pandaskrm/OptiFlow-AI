import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../../lib/auth/session";
import {
  ErpSyncError,
  synchronizeErpConnection,
} from "../../../../lib/erp/erpSyncService";
import { prisma } from "../../../../lib/prisma";

export async function POST() {
  const currentSession = await getCurrentSession();

  if (!currentSession) {
    return NextResponse.json(
      { error: "Non authentifié." },
      { status: 401 }
    );
  }

  if (
    currentSession.membership.role !== "ADMIN" &&
    currentSession.membership.role !== "OWNER"
  ) {
    return NextResponse.json(
      { error: "Droits administrateur requis." },
      { status: 403 }
    );
  }

  const connection = await prisma.erpConnection.findFirst({
    where: {
      companyId: currentSession.company.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  if (!connection) {
    return NextResponse.json(
      {
        error:
          "Aucune configuration ERP n'est enregistrée pour cette entreprise.",
      },
      { status: 404 }
    );
  }

  try {
    const result = await synchronizeErpConnection({
      connectionId: connection.id,
      companyId: currentSession.company.id,
      actorId: currentSession.user.id,
      triggeredBy: "MANUAL",
    });

    return NextResponse.json(result);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Une erreur inconnue est survenue pendant la synchronisation.";

    const status =
      error instanceof ErpSyncError &&
      errorMessage.includes("désactivée")
        ? 400
        : error instanceof ErpSyncError &&
            errorMessage.includes("déjà en cours")
          ? 409
          : error instanceof ErpSyncError &&
              errorMessage.includes("introuvable")
            ? 404
            : 500;

    return NextResponse.json(
      {
        error:
          status === 500
            ? "La synchronisation ERP a échoué."
            : errorMessage,
        details: errorMessage,
      },
      { status }
    );
  }
}