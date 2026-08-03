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
      "La connexion ERP demandÃ©e est introuvable."
    );
  }

  if (!connection.isEnabled) {
    throw new ErpSyncError(
      "La connexion ERP est dÃ©sactivÃ©e."
    );
  }

  if (connection.status === "CONNECTING") {
    throw new ErpSyncError(
      "Une synchronisation ERP est dÃ©jÃ  en cours."
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
     * Ce bloc sera remplacÃ© progressivement par :
     * - la rÃ©cupÃ©ration des donnÃ©es du connecteur ERP ;
     * - la validation des donnÃ©es ;
     * - l'enregistrement dans Prisma ;
     * - le calcul du rÃ©sumÃ© rÃ©el.
     */
    await new Promise((resolve) => setTimeout(resolve, 800));

    const connector = getErpConnector(connection);


    const erpReceptions = await connector.getReceptions();
    let importedReceptions = 0;

    for (const reception of erpReceptions) {
      if (
        !reception.number ||
        !reception.supplier ||
        !reception.carrier ||
        !reception.dock ||
        !Number.isFinite(reception.pallets) ||
        reception.pallets <= 0 ||
        !reception.scheduledAt
      ) {
        continue;
      }

      await prisma.reception.upsert({
        where: {
          number: reception.number,
        },
        update: {
          supplier: reception.supplier,
          carrier: reception.carrier,
          dock: reception.dock,
          pallets: reception.pallets,
          status: reception.status || "Planifiée",
          scheduledAt: reception.scheduledAt,
          companyId,
        },
        create: {
          number: reception.number,
          supplier: reception.supplier,
          carrier: reception.carrier,
          dock: reception.dock,
          pallets: reception.pallets,
          status: reception.status || "Planifiée",
          scheduledAt: reception.scheduledAt,
          companyId,
        },
      });

      importedReceptions += 1;
    }

    const erpOrders = await connector.getOrders();
    let importedOrders = 0;

    for (const order of erpOrders) {
      if (!order.number || !order.customer) {
        continue;
      }

      const totalLines =
        Number.isFinite(order.totalLines) && Number(order.totalLines) >= 0
          ? Number(order.totalLines)
          : 0;

      const preparedLines =
        Number.isFinite(order.preparedLines) &&
        Number(order.preparedLines) >= 0
          ? Math.min(Number(order.preparedLines), totalLines)
          : 0;

      const scheduledAt =
        order.scheduledAt &&
        !Number.isNaN(Date.parse(order.scheduledAt))
          ? new Date(order.scheduledAt)
          : null;

      await prisma.order.upsert({
        where: {
          number: order.number,
        },
        update: {
          customer: order.customer,
          carrier: order.carrier || null,
          priority: order.priority || "Normale",
          status: order.status || "À préparer",
          totalLines,
          preparedLines,
          scheduledAt,
          companyId,
        },
        create: {
          number: order.number,
          customer: order.customer,
          carrier: order.carrier || null,
          priority: order.priority || "Normale",
          status: order.status || "À préparer",
          totalLines,
          preparedLines,
          scheduledAt,
          companyId,
        },
      });

      importedOrders += 1;
    }

    const connectorSummary = await connector.getSummary();

    const summary = {
      ...connectorSummary,
      orders: importedOrders,
      receptions: importedReceptions,
    };

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
          ? "Synchronisation ERP automatique terminÃ©e avec succÃ¨s."
          : "Synchronisation ERP terminÃ©e avec succÃ¨s.",
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