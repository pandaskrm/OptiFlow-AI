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
    const syncStartedAt = new Date();

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
  const syncMode = connection.lastSyncedAt
    ? "DELTA"
    : "FULL";


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
          companyId_number: {
            companyId,
            number: reception.number,
          },
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

      const totalQuantity =
        Number.isFinite(order.totalQuantity) &&
        Number(order.totalQuantity) >= 0
          ? Number(order.totalQuantity)
          : null;

      const orderDate =
        order.orderDate &&
        !Number.isNaN(Date.parse(order.orderDate))
          ? new Date(order.orderDate)
          : null;

      const scheduledAt =
        order.scheduledAt &&
        !Number.isNaN(Date.parse(order.scheduledAt))
          ? new Date(order.scheduledAt)
          : null;

      await prisma.order.upsert({
        where: {
          companyId_number: {
            companyId,
            number: order.number,
          },
        },
        update: {
          customer: order.customer,
          customerCode: order.customerCode || null,
          country: order.country || null,
          paymentMethod: order.paymentMethod || null,
          carrier: order.carrier || null,
          priority: order.priority || "Normale",
          status: order.status || "À préparer",
          totalLines,
          totalQuantity,
          preparedLines,
          orderDate,
          scheduledAt,
          companyId,
        },
        create: {
          number: order.number,
          customer: order.customer,
          customerCode: order.customerCode || null,
          country: order.country || null,
          paymentMethod: order.paymentMethod || null,
          carrier: order.carrier || null,
          priority: order.priority || "Normale",
          status: order.status || "À préparer",
          totalLines,
          totalQuantity,
          preparedLines,
          orderDate,
          scheduledAt,
          companyId,
        },
      });

      importedOrders += 1;
    }

    const erpShipments = await connector.getShipments();
    let importedShipments = 0;

    for (const shipment of erpShipments) {
      if (
        !shipment.number ||
        !shipment.customer ||
        !shipment.carrier
      ) {
        continue;
      }

      const pallets =
        Number.isFinite(shipment.pallets) &&
        Number(shipment.pallets) >= 0
          ? Number(shipment.pallets)
          : 0;

      const packages =
        Number.isFinite(shipment.packages) &&
        Number(shipment.packages) >= 0
          ? Number(shipment.packages)
          : 0;

      const scheduledAt =
        shipment.scheduledAt &&
        !Number.isNaN(Date.parse(shipment.scheduledAt))
          ? new Date(shipment.scheduledAt)
          : null;

      const shippedAt =
        shipment.shippedAt &&
        !Number.isNaN(Date.parse(shipment.shippedAt))
          ? new Date(shipment.shippedAt)
          : null;

      await prisma.shipment.upsert({
        where: {
          companyId_number: {
            companyId,
            number: shipment.number,
          },
        },
        update: {
          orderNumber: shipment.orderNumber || null,
          customer: shipment.customer,
          carrier: shipment.carrier,
          dock: shipment.dock || null,
          status: shipment.status || "À expédier",
          pallets,
          packages,
          scheduledAt,
          shippedAt,
          companyId,
        },
        create: {
          number: shipment.number,
          orderNumber: shipment.orderNumber || null,
          customer: shipment.customer,
          carrier: shipment.carrier,
          dock: shipment.dock || null,
          status: shipment.status || "À expédier",
          pallets,
          packages,
          scheduledAt,
          shippedAt,
          companyId,
        },
      });

      importedShipments += 1;
    }

    const erpStock = await connector.getStock();
    let importedStockItems = 0;

    for (const item of erpStock) {
      if (!item.sku || !item.label) {
        continue;
      }

      const quantity =
        Number.isFinite(item.quantity) && Number(item.quantity) >= 0
          ? Number(item.quantity)
          : 0;

      const reserved =
        Number.isFinite(item.reserved) && Number(item.reserved) >= 0
          ? Math.min(Number(item.reserved), quantity)
          : 0;

      const minimum =
        Number.isFinite(item.minimum) && Number(item.minimum) >= 0
          ? Number(item.minimum)
          : 0;

      await prisma.inventory.upsert({
        where: {
          companyId_sku: {
            companyId,
            sku: item.sku,
          },
        },
        update: {
          designation: item.label,
          location: item.location || null,
          quantity,
          reserved,
          minimum,
          companyId,
        },
        create: {
          sku: item.sku,
          designation: item.label,
          location: item.location || null,
          quantity,
          reserved,
          minimum,
          companyId,
        },
      });

      importedStockItems += 1;
    }

    const erpEmployees = await connector.getEmployees();
    let importedEmployees = 0;

    for (const employee of erpEmployees) {
      if (!employee.id || !employee.fullName) {
        continue;
      }

      const workedMinutes =
        Number.isFinite(employee.workedMinutes) &&
        Number(employee.workedMinutes) >= 0
          ? Number(employee.workedMinutes)
          : 0;

      const processedUnits =
        Number.isFinite(employee.processedUnits) &&
        Number(employee.processedUnits) >= 0
          ? Number(employee.processedUnits)
          : 0;

      const workDate =
        employee.workDate &&
        !Number.isNaN(Date.parse(employee.workDate))
          ? new Date(employee.workDate)
          : new Date();

      await prisma.workforce.upsert({
        where: {
          companyId_employeeNumber: {
            companyId,
            employeeNumber: employee.id,
          },
        },
        update: {
          name: employee.fullName,
          team: employee.team || employee.role || null,
          zone: employee.zone || null,
          status: employee.status || "Présent",
          workedMinutes,
          processedUnits,
          workDate,
          companyId,
        },
        create: {
          employeeNumber: employee.id,
          name: employee.fullName,
          team: employee.team || employee.role || null,
          zone: employee.zone || null,
          status: employee.status || "Présent",
          workedMinutes,
          processedUnits,
          workDate,
          companyId,
        },
      });

      importedEmployees += 1;
    }

    const connectorSummary = await connector.getSummary();

    const summary = {
      ...connectorSummary,
      orders: importedOrders,
      receptions: importedReceptions,
      shipments: importedShipments,
      stockItems: importedStockItems,
      employees: importedEmployees,
    };

    const syncedAt = new Date();
    const syncCompletedAt = new Date();
    const durationMs =
      syncCompletedAt.getTime() -
      syncStartedAt.getTime();

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
          syncMode,
          status: "SUCCESS",
          startedAt: syncStartedAt.toISOString(),
          completedAt: syncCompletedAt.toISOString(),
          durationMs,
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
      syncMode,
      durationMs,
      startedAt: syncStartedAt,
      completedAt: syncCompletedAt,
      syncedAt,
    };
  } catch (error) {
    const syncFailedAt = new Date();
    const durationMs =
      syncFailedAt.getTime() -
      syncStartedAt.getTime();

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
          syncMode,
          status: "FAILED",
          startedAt: syncStartedAt.toISOString(),
          completedAt: syncFailedAt.toISOString(),
          durationMs,
          error: errorMessage,
        }),
      },
    });

    throw new ErpSyncError(errorMessage);
  }
}
