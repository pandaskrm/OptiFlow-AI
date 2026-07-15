import { prisma } from "../prisma";
import {
  ACTIVE_RECEPTION_STATUSES,
  RECEPTION_STATUS,
} from "../../constants/receptionStatus";

export type WarehouseReceptionSummary = {
  total: number;
  planned: number;
  atDock: number;
  unloading: number;
  inspection: number;
  active: number;
  completed: number;
  occupiedDocks: number;
  totalPallets: number;
  receivedPallets: number;
  scheduledToday: number;
  scheduledTomorrow: number;
  late: number;
  completionRate: number;
};

export type WarehouseOrderSummary = {
  total: number;
  waiting: number;
  inPreparation: number;
  completed: number;
  priority: number;
  totalLines: number;
  preparedLines: number;
  progress: number;
  serviceRate: number;
};

export type WarehouseShipmentSummary = {
  total: number;
  waiting: number;
  ready: number;
  shipped: number;
  totalPallets: number;
  totalPackages: number;
  progress: number;
  serviceRate: number;
};

export type WarehouseInventorySummary = {
  references: number;
  totalQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lowStockReferences: number;
  unavailableReferences: number;
};

export type WarehouseWorkforceSummary = {
  total: number;
  present: number;
  absent: number;
  paused: number;
  reinforcement: number;
  workedMinutes: number;
  processedUnits: number;
  productivity: number;
};

export type WarehousePerformanceSummary = {
  reception: number;
  preparation: number;
  shipping: number;
  service: number;
  productivity: number;
};

export type WarehouseSummary = {
  receptions: WarehouseReceptionSummary;
  orders: WarehouseOrderSummary;
  shipments: WarehouseShipmentSummary;
  inventory: WarehouseInventorySummary;
  workforce: WarehouseWorkforceSummary;
  performance: WarehousePerformanceSummary;
  healthScore: number;
  alerts: string[];
  priorities: string[];
  dataConnected: boolean;
  updatedAt: string;
};

const LEGACY_RECEPTION_STATUS = {
  PLANNED: "Planifiée",
  AT_DOCK: "À quai",
  UNLOADING: "Déchargement",
  INSPECTION: "Contrôle qualité",
  COMPLETED: "Terminée",
} as const;

const ORDER_STATUS = {
  WAITING: ["À préparer", "A preparer", "En attente"],
  PREPARING: ["En préparation", "En preparation"],
  COMPLETED: ["Terminée", "Terminee", "Préparée", "Preparee"],
} as const;

const SHIPMENT_STATUS = {
  WAITING: ["À expédier", "A expedier", "En attente"],
  READY: ["Prête", "Prete", "Prêt", "Pret"],
  SHIPPED: ["Expédiée", "Expediee", "Terminée", "Terminee"],
} as const;

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function matchesOneOf(value: string, expected: readonly string[]) {
  const normalizedValue = normalize(value);

  return expected.some(
    (item) => normalize(item) === normalizedValue
  );
}

function matchesReceptionStatus(
  currentStatus: string,
  expectedStatus: string,
  legacyStatus: string
) {
  return (
    currentStatus === expectedStatus ||
    currentStatus === legacyStatus
  );
}

function isReceptionPlanned(status: string) {
  return matchesReceptionStatus(
    status,
    RECEPTION_STATUS.PLANNED,
    LEGACY_RECEPTION_STATUS.PLANNED
  );
}

function isReceptionAtDock(status: string) {
  return matchesReceptionStatus(
    status,
    RECEPTION_STATUS.AT_DOCK,
    LEGACY_RECEPTION_STATUS.AT_DOCK
  );
}

function isReceptionUnloading(status: string) {
  return matchesReceptionStatus(
    status,
    RECEPTION_STATUS.UNLOADING,
    LEGACY_RECEPTION_STATUS.UNLOADING
  );
}

function isReceptionInspection(status: string) {
  return matchesReceptionStatus(
    status,
    RECEPTION_STATUS.INSPECTION,
    LEGACY_RECEPTION_STATUS.INSPECTION
  );
}

function isReceptionCompleted(status: string) {
  return matchesReceptionStatus(
    status,
    RECEPTION_STATUS.COMPLETED,
    LEGACY_RECEPTION_STATUS.COMPLETED
  );
}

function isReceptionActive(status: string) {
  return (
    ACTIVE_RECEPTION_STATUSES.includes(status as never) ||
    isReceptionAtDock(status) ||
    isReceptionUnloading(status) ||
    isReceptionInspection(status)
  );
}

function percentage(value: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(100, Math.round((value / total) * 100))
  );
}

function average(values: number[]) {
  const availableValues = values.filter(
    (value) => Number.isFinite(value) && value >= 0
  );

  if (availableValues.length === 0) {
    return 0;
  }

  return Math.round(
    availableValues.reduce(
      (total, value) => total + value,
      0
    ) / availableValues.length
  );
}

function startOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function endOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

function parseReceptionDate(value: string) {
  const parsedDate = new Date(value);

  return Number.isNaN(parsedDate.getTime())
    ? null
    : parsedDate;
}

function calculateHealthScore({
  dataConnected,
  receptionPerformance,
  preparationPerformance,
  shippingPerformance,
  serviceRate,
  productivity,
  lateReceptions,
  occupiedDocks,
  lowStockReferences,
  absentEmployees,
}: {
  dataConnected: boolean;
  receptionPerformance: number;
  preparationPerformance: number;
  shippingPerformance: number;
  serviceRate: number;
  productivity: number;
  lateReceptions: number;
  occupiedDocks: number;
  lowStockReferences: number;
  absentEmployees: number;
}) {
  if (!dataConnected) {
    return 0;
  }

  const availablePerformance = [
    receptionPerformance,
    preparationPerformance,
    shippingPerformance,
    serviceRate,
    productivity,
  ].filter((value) => value > 0);

  let score =
    availablePerformance.length > 0
      ? average(availablePerformance)
      : 100;

  score -= Math.min(lateReceptions * 5, 25);

  if (occupiedDocks >= 6) {
    score -= 20;
  } else if (occupiedDocks >= 5) {
    score -= 12;
  } else if (occupiedDocks >= 4) {
    score -= 6;
  }

  score -= Math.min(lowStockReferences * 2, 20);
  score -= Math.min(absentEmployees * 2, 15);

  return Math.max(0, Math.min(100, Math.round(score)));
}

function buildAlerts({
  lateReceptions,
  occupiedDocks,
  priorityOrders,
  lowStockReferences,
  unavailableReferences,
  absentEmployees,
  waitingShipments,
}: {
  lateReceptions: number;
  occupiedDocks: number;
  priorityOrders: number;
  lowStockReferences: number;
  unavailableReferences: number;
  absentEmployees: number;
  waitingShipments: number;
}) {
  const alerts: string[] = [];

  if (lateReceptions > 0) {
    alerts.push(
      `${lateReceptions} réception${
        lateReceptions > 1 ? "s sont" : " est"
      } en retard.`
    );
  }

  if (occupiedDocks >= 5) {
    alerts.push(
      `${occupiedDocks}/6 quais sont occupés : risque de saturation.`
    );
  }

  if (priorityOrders > 0) {
    alerts.push(
      `${priorityOrders} commande${
        priorityOrders > 1 ? "s prioritaires" : " prioritaire"
      } à traiter.`
    );
  }

  if (unavailableReferences > 0) {
    alerts.push(
      `${unavailableReferences} référence${
        unavailableReferences > 1 ? "s sont" : " est"
      } indisponible en stock.`
    );
  }

  if (lowStockReferences > 0) {
    alerts.push(
      `${lowStockReferences} référence${
        lowStockReferences > 1 ? "s sont" : " est"
      } sous le seuil minimum.`
    );
  }

  if (absentEmployees > 0) {
    alerts.push(
      `${absentEmployees} collaborateur${
        absentEmployees > 1 ? "s sont" : " est"
      } absent aujourd’hui.`
    );
  }

  if (waitingShipments > 0) {
    alerts.push(
      `${waitingShipments} expédition${
        waitingShipments > 1 ? "s sont" : " est"
      } encore en attente.`
    );
  }

  return alerts;
}

function buildPriorities({
  plannedReceptions,
  lateReceptions,
  occupiedDocks,
  priorityOrders,
  waitingShipments,
  lowStockReferences,
  absentEmployees,
}: {
  plannedReceptions: number;
  lateReceptions: number;
  occupiedDocks: number;
  priorityOrders: number;
  waitingShipments: number;
  lowStockReferences: number;
  absentEmployees: number;
}) {
  const priorities: string[] = [];

  if (lateReceptions > 0) {
    priorities.push(
      "Traiter les réceptions en retard et vérifier les créneaux transporteurs."
    );
  }

  if (occupiedDocks >= 5) {
    priorities.push(
      "Libérer rapidement un quai pour éviter une file d’attente."
    );
  }

  if (priorityOrders > 0) {
    priorities.push(
      "Affecter les ressources disponibles aux commandes prioritaires."
    );
  }

  if (waitingShipments > 0) {
    priorities.push(
      "Contrôler les expéditions en attente avant leur heure de départ."
    );
  }

  if (lowStockReferences > 0) {
    priorities.push(
      "Analyser les références sous seuil et lancer un réapprovisionnement."
    );
  }

  if (absentEmployees > 0) {
    priorities.push(
      "Rééquilibrer les équipes selon les absences du jour."
    );
  }

  if (plannedReceptions > 0) {
    priorities.push(
      "Préparer les quais pour les prochaines réceptions planifiées."
    );
  }

  return priorities;
}

export async function getWarehouseSummary(): Promise<WarehouseSummary> {
  const [
    receptions,
    orders,
    shipments,
    inventory,
    workforce,
  ] = await Promise.all([
    prisma.reception.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.shipment.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.inventory.findMany({
      orderBy: {
        designation: "asc",
      },
    }),

    prisma.workforce.findMany({
      orderBy: {
        workDate: "desc",
      },
    }),
  ]);

  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tomorrowStart = startOfDay(tomorrow);
  const tomorrowEnd = endOfDay(tomorrow);

  const receptionPlanned = receptions.filter((item) =>
    isReceptionPlanned(item.status)
  ).length;

  const receptionAtDock = receptions.filter((item) =>
    isReceptionAtDock(item.status)
  ).length;

  const receptionUnloading = receptions.filter((item) =>
    isReceptionUnloading(item.status)
  ).length;

  const receptionInspection = receptions.filter((item) =>
    isReceptionInspection(item.status)
  ).length;

  const receptionActive = receptions.filter((item) =>
    isReceptionActive(item.status)
  ).length;

  const receptionCompleted = receptions.filter((item) =>
    isReceptionCompleted(item.status)
  ).length;

  const occupiedDocks = new Set(
    receptions
      .filter((item) => isReceptionActive(item.status))
      .map((item) => item.dock)
      .filter(Boolean)
  ).size;

  const totalPallets = receptions.reduce(
    (total, item) => total + item.pallets,
    0
  );

  const receivedPallets = receptions
    .filter((item) => isReceptionCompleted(item.status))
    .reduce(
      (total, item) => total + item.pallets,
      0
    );

  const scheduledToday = receptions.filter((item) => {
    const date = parseReceptionDate(item.scheduledAt);

    return (
      date !== null &&
      date >= todayStart &&
      date <= todayEnd
    );
  }).length;

  const scheduledTomorrow = receptions.filter((item) => {
    const date = parseReceptionDate(item.scheduledAt);

    return (
      date !== null &&
      date >= tomorrowStart &&
      date <= tomorrowEnd
    );
  }).length;

  const lateReceptions = receptions.filter((item) => {
    const date = parseReceptionDate(item.scheduledAt);

    return (
      date !== null &&
      date < now &&
      !isReceptionCompleted(item.status)
    );
  }).length;

  const receptionCompletionRate = percentage(
    receptionCompleted,
    receptions.length
  );

  const waitingOrders = orders.filter((item) =>
    matchesOneOf(item.status, ORDER_STATUS.WAITING)
  ).length;

  const preparingOrders = orders.filter((item) =>
    matchesOneOf(
      item.status,
      ORDER_STATUS.PREPARING
    )
  ).length;

  const completedOrders = orders.filter((item) =>
    matchesOneOf(
      item.status,
      ORDER_STATUS.COMPLETED
    )
  ).length;

  const priorityOrders = orders.filter((item) =>
    ["haute", "urgente", "critique"].includes(
      normalize(item.priority)
    )
  ).length;

  const totalOrderLines = orders.reduce(
    (total, item) => total + item.totalLines,
    0
  );

  const preparedOrderLines = orders.reduce(
    (total, item) => total + item.preparedLines,
    0
  );

  const preparationProgress = percentage(
    preparedOrderLines,
    totalOrderLines
  );

  const ordersWithDeadline = orders.filter(
    (item) => item.scheduledAt !== null
  );

  const ordersCompletedOnTime =
    ordersWithDeadline.filter((item) => {
      if (!item.completedAt || !item.scheduledAt) {
        return false;
      }

      return item.completedAt <= item.scheduledAt;
    }).length;

  const orderServiceRate = percentage(
    ordersCompletedOnTime,
    ordersWithDeadline.length
  );

  const waitingShipments = shipments.filter((item) =>
    matchesOneOf(
      item.status,
      SHIPMENT_STATUS.WAITING
    )
  ).length;

  const readyShipments = shipments.filter((item) =>
    matchesOneOf(item.status, SHIPMENT_STATUS.READY)
  ).length;

  const shippedShipments = shipments.filter((item) =>
    matchesOneOf(
      item.status,
      SHIPMENT_STATUS.SHIPPED
    )
  ).length;

  const shipmentPallets = shipments.reduce(
    (total, item) => total + item.pallets,
    0
  );

  const shipmentPackages = shipments.reduce(
    (total, item) => total + item.packages,
    0
  );

  const shippingProgress = percentage(
    shippedShipments,
    shipments.length
  );

  const shipmentsWithDeadline = shipments.filter(
    (item) => item.scheduledAt !== null
  );

  const shipmentsCompletedOnTime =
    shipmentsWithDeadline.filter((item) => {
      if (!item.shippedAt || !item.scheduledAt) {
        return false;
      }

      return item.shippedAt <= item.scheduledAt;
    }).length;

  const shipmentServiceRate = percentage(
    shipmentsCompletedOnTime,
    shipmentsWithDeadline.length
  );

  const totalInventoryQuantity = inventory.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const reservedInventoryQuantity = inventory.reduce(
    (total, item) => total + item.reserved,
    0
  );

  const availableInventoryQuantity = inventory.reduce(
    (total, item) =>
      total + Math.max(0, item.quantity - item.reserved),
    0
  );

  const lowStockReferences = inventory.filter(
    (item) =>
      item.quantity - item.reserved <= item.minimum
  ).length;

  const unavailableReferences = inventory.filter(
    (item) => item.quantity - item.reserved <= 0
  ).length;

  const presentEmployees = workforce.filter(
    (item) => normalize(item.status) === "present"
  ).length;

  const absentEmployees = workforce.filter(
    (item) => normalize(item.status) === "absent"
  ).length;

  const pausedEmployees = workforce.filter(
    (item) => normalize(item.status) === "en pause"
  ).length;

  const reinforcementEmployees = workforce.filter(
    (item) => normalize(item.status) === "renfort"
  ).length;

  const workedMinutes = workforce.reduce(
    (total, item) => total + item.workedMinutes,
    0
  );

  const processedUnits = workforce.reduce(
    (total, item) => total + item.processedUnits,
    0
  );

  const productivity =
    workedMinutes > 0
      ? Math.round(
          (processedUnits / workedMinutes) * 60
        )
      : 0;

  const serviceValues = [
    orderServiceRate,
    shipmentServiceRate,
  ].filter((value) => value > 0);

  const globalServiceRate =
    serviceValues.length > 0
      ? average(serviceValues)
      : 0;

  const dataConnected =
    receptions.length > 0 ||
    orders.length > 0 ||
    shipments.length > 0 ||
    inventory.length > 0 ||
    workforce.length > 0;

  const healthScore = calculateHealthScore({
    dataConnected,
    receptionPerformance: receptionCompletionRate,
    preparationPerformance: preparationProgress,
    shippingPerformance: shippingProgress,
    serviceRate: globalServiceRate,
    productivity,
    lateReceptions,
    occupiedDocks,
    lowStockReferences,
    absentEmployees,
  });

  const alerts = buildAlerts({
    lateReceptions,
    occupiedDocks,
    priorityOrders,
    lowStockReferences,
    unavailableReferences,
    absentEmployees,
    waitingShipments,
  });

  const priorities = buildPriorities({
    plannedReceptions: receptionPlanned,
    lateReceptions,
    occupiedDocks,
    priorityOrders,
    waitingShipments,
    lowStockReferences,
    absentEmployees,
  });

  return {
    receptions: {
      total: receptions.length,
      planned: receptionPlanned,
      atDock: receptionAtDock,
      unloading: receptionUnloading,
      inspection: receptionInspection,
      active: receptionActive,
      completed: receptionCompleted,
      occupiedDocks,
      totalPallets,
      receivedPallets,
      scheduledToday,
      scheduledTomorrow,
      late: lateReceptions,
      completionRate: receptionCompletionRate,
    },

    orders: {
      total: orders.length,
      waiting: waitingOrders,
      inPreparation: preparingOrders,
      completed: completedOrders,
      priority: priorityOrders,
      totalLines: totalOrderLines,
      preparedLines: preparedOrderLines,
      progress: preparationProgress,
      serviceRate: orderServiceRate,
    },

    shipments: {
      total: shipments.length,
      waiting: waitingShipments,
      ready: readyShipments,
      shipped: shippedShipments,
      totalPallets: shipmentPallets,
      totalPackages: shipmentPackages,
      progress: shippingProgress,
      serviceRate: shipmentServiceRate,
    },

    inventory: {
      references: inventory.length,
      totalQuantity: totalInventoryQuantity,
      reservedQuantity: reservedInventoryQuantity,
      availableQuantity: availableInventoryQuantity,
      lowStockReferences,
      unavailableReferences,
    },

    workforce: {
      total: workforce.length,
      present: presentEmployees,
      absent: absentEmployees,
      paused: pausedEmployees,
      reinforcement: reinforcementEmployees,
      workedMinutes,
      processedUnits,
      productivity,
    },

    performance: {
      reception: receptionCompletionRate,
      preparation: preparationProgress,
      shipping: shippingProgress,
      service: globalServiceRate,
      productivity,
    },

    healthScore,
    alerts,
    priorities,
    dataConnected,
    updatedAt: new Date().toISOString(),
  };
}