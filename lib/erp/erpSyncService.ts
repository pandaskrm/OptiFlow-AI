import { prisma } from "../prisma";
import { getErpConnector } from "./erpConnectorFactory";

export type ErpSyncSummary = {
  orders: number;
  shipments: number;
  receptions: number;
  stockItems: number;
  employees: number;
};

export type ErpSyncTrigger = "MANUAL" | "CRON";

type SynchronizeErpOptions = {
  connectionId: string;
  companyId: string;
  actorId?: string | null;
  triggeredBy: ErpSyncTrigger;
};

export class ErpSyncError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ErpSyncError";
  }
}

function createSimulatedSyncSummary(): ErpSyncSummary {
  return {
    orders: 486,
    shipments: 32,
    receptions: 18,
    stockItems: 1248,
    employees: 55,
  };
}

export async function synchronizeErpConnection({
  connectionId,
  companyId,
  actorId = null,
  triggeredBy,
}: SynchronizeErpOptions) {
  const connection = await prisma.erpConnection.findFirst({
    where: {
      id: connectionId,
      companyId,
    },
  });

  if (!connection) {
    throw new ErpSyncError(
      "La connexion ERP demandée est introuvable."
    );
  }

  if (!connection.isEnabled) {
    throw new ErpSyncError(
      "La connexion ERP est désactivée."
    );
  }

  if (connection.status === "CONNECTING") {
    throw new ErpSyncError(
      "Une synchronisation ERP est déjà en cours."
    );
  }

  await prisma.erpConnection.update({
    where: {
      id: connection.id,
    },
    data: {
      status: "CONNECTING",
      lastTestedAt: new Date(),
      lastError: null,
    },
  });

  try {
    /*
     * Simulation temporaire.
     *
     * Ce bloc sera remplacé progressivement par :
     * - la récupération des données du connecteur ERP ;
     * - la validation des données ;
     * - l'enregistrement dans Prisma ;
     * - le calcul du résumé réel.
     */
    await new Promise((resolve) => setTimeout(resolve, 800));

    const connector = getErpConnector(connection);

const summary =
  await connector.getSummary();
    const syncedAt = new Date();

    const updatedConnection = await prisma.erpConnection.update({
      where: {
        id: connection.id,
      },
      data: {
        status: "CONNECTED",
        lastSyncedAt: syncedAt,
        lastTestedAt: syncedAt,
        lastError: null,
      },
    });

    await prisma.auditLog.create({
      data: {
        companyId,
        actorId,
        action:
          triggeredBy === "CRON"
            ? "ERP_AUTO_SYNC_COMPLETED"
            : "ERP_SYNC_COMPLETED",
        entityType: "ErpConnection",
        entityId: connection.id,
        details: JSON.stringify({
          provider: connection.provider,
          name: connection.name,
          triggeredBy,
          summary,
          syncedAt: syncedAt.toISOString(),
        }),
      },
    });

    return {
      success: true,
      message:
        triggeredBy === "CRON"
          ? "Synchronisation ERP automatique terminée avec succès."
          : "Synchronisation ERP terminée avec succès.",
      connection: {
        id: updatedConnection.id,
        provider: updatedConnection.provider,
        name: updatedConnection.name,
        status: updatedConnection.status,
        lastSyncedAt: updatedConnection.lastSyncedAt,
      },
      summary,
      syncedAt,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Une erreur inconnue est survenue pendant la synchronisation.";

    await prisma.erpConnection.update({
      where: {
        id: connection.id,
      },
      data: {
        status: "ERROR",
        lastError: errorMessage,
      },
    });

    await prisma.auditLog.create({
      data: {
        companyId,
        actorId,
        action:
          triggeredBy === "CRON"
            ? "ERP_AUTO_SYNC_FAILED"
            : "ERP_SYNC_FAILED",
        entityType: "ErpConnection",
        entityId: connection.id,
        details: JSON.stringify({
          provider: connection.provider,
          name: connection.name,
          triggeredBy,
          error: errorMessage,
        }),
      },
    });

    throw new ErpSyncError(errorMessage);
  }
}