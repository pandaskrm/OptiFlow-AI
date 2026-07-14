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
};

export type WarehouseSummary = {
  receptions: WarehouseReceptionSummary;
  healthScore: number;
  alerts: string[];
  priorities: string[];
  updatedAt: string;
};

/**
 * Compatibilité temporaire avec les anciens statuts mal encodés.
 * Ces valeurs pourront être supprimées après nettoyage de la base.
 */
const LEGACY_STATUS = {
  PLANNED: "PlanifiÃ©e",
  AT_DOCK: "Ã€ quai",
  UNLOADING: "DÃ©chargement",
  INSPECTION: "ContrÃ´le qualitÃ©",
  COMPLETED: "TerminÃ©e",
} as const;

function matchesStatus(
  currentStatus: string,
  expectedStatus: string,
  legacyStatus: string
) {
  return (
    currentStatus === expectedStatus ||
    currentStatus === legacyStatus
  );
}

function isPlanned(status: string) {
  return matchesStatus(
    status,
    RECEPTION_STATUS.PLANNED,
    LEGACY_STATUS.PLANNED
  );
}

function isAtDock(status: string) {
  return matchesStatus(
    status,
    RECEPTION_STATUS.AT_DOCK,
    LEGACY_STATUS.AT_DOCK
  );
}

function isUnloading(status: string) {
  return matchesStatus(
    status,
    RECEPTION_STATUS.UNLOADING,
    LEGACY_STATUS.UNLOADING
  );
}

function isInspection(status: string) {
  return matchesStatus(
    status,
    RECEPTION_STATUS.INSPECTION,
    LEGACY_STATUS.INSPECTION
  );
}

function isCompleted(status: string) {
  return matchesStatus(
    status,
    RECEPTION_STATUS.COMPLETED,
    LEGACY_STATUS.COMPLETED
  );
}

function isActive(status: string) {
  return (
    ACTIVE_RECEPTION_STATUSES.includes(status as never) ||
    isAtDock(status) ||
    isUnloading(status) ||
    isInspection(status)
  );
}

function calculateHealthScore({
  planned,
  active,
  occupiedDocks,
}: {
  planned: number;
  active: number;
  occupiedDocks: number;
}) {
  if (planned === 0 && active === 0) {
    return 100;
  }

  let score = 100;

  score -= Math.min(planned * 3, 24);
  score -= Math.min(active * 2, 20);

  if (occupiedDocks >= 5) {
    score -= 20;
  } else if (occupiedDocks >= 3) {
    score -= 10;
  }

  return Math.max(0, Math.min(100, score));
}

function buildAlerts({
  planned,
  active,
  occupiedDocks,
}: {
  planned: number;
  active: number;
  occupiedDocks: number;
}) {
  const alerts: string[] = [];

  if (planned >= 5) {
    alerts.push(`${planned} réceptions sont encore planifiées.`);
  }

  if (occupiedDocks >= 5) {
    alerts.push("Les quais sont proches de la saturation.");
  }

  if (active >= 10) {
    alerts.push("Le volume de réceptions actives est élevé.");
  }

  return alerts;
}

function buildPriorities({
  planned,
  occupiedDocks,
}: {
  planned: number;
  occupiedDocks: number;
}) {
  const priorities: string[] = [];

  if (planned > 0) {
    priorities.push(
      "Affecter les prochaines réceptions aux quais disponibles."
    );
  }

  if (occupiedDocks >= 5) {
    priorities.push(
      "Libérer rapidement un quai pour éviter une file d’attente."
    );
  }

  return priorities;
}

export async function getWarehouseSummary(): Promise<WarehouseSummary> {
  const receptions = await prisma.reception.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const planned = receptions.filter((item) =>
    isPlanned(item.status)
  ).length;

  const atDock = receptions.filter((item) =>
    isAtDock(item.status)
  ).length;

  const unloading = receptions.filter((item) =>
    isUnloading(item.status)
  ).length;

  const inspection = receptions.filter((item) =>
    isInspection(item.status)
  ).length;

  const active = receptions.filter((item) =>
    isActive(item.status)
  ).length;

  const completed = receptions.filter((item) =>
    isCompleted(item.status)
  ).length;

  const occupiedDocks = new Set(
    receptions
      .filter((item) => isActive(item.status))
      .map((item) => item.dock)
      .filter(Boolean)
  ).size;

  const totalPallets = receptions.reduce(
    (total, item) => total + item.pallets,
    0
  );

  const receivedPallets = receptions
    .filter((item) => isCompleted(item.status))
    .reduce((total, item) => total + item.pallets, 0);

  const healthScore = calculateHealthScore({
    planned,
    active,
    occupiedDocks,
  });

  return {
    receptions: {
      total: receptions.length,
      planned,
      atDock,
      unloading,
      inspection,
      active,
      completed,
      occupiedDocks,
      totalPallets,
      receivedPallets,
    },

    healthScore,

    alerts: buildAlerts({
      planned,
      active,
      occupiedDocks,
    }),

    priorities: buildPriorities({
      planned,
      occupiedDocks,
    }),

    updatedAt: new Date().toISOString(),
  };
}