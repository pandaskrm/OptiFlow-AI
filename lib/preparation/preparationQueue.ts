export type PreparationQueueZone =
  | "CONFIRME"
  | "EXPERT"
  | "GROSSISTE";

export type PreparationRoutingGroup =
  | PreparationQueueZone
  | "STANDARD";

export type PreparationQueueOrder = {
  id: string | number;
  number: string;
  orderDate: Date | string | null;
  group: PreparationRoutingGroup;
  isPriority: boolean;
};

export type PreparationQueueResult = {
  queues: Record<PreparationQueueZone, PreparationQueueOrder[]>;
  manual: PreparationQueueOrder[];
};

const DAY_MS = 24 * 60 * 60 * 1000;

function timestamp(value: Date | string): number {
  const date = value instanceof Date ? value : new Date(value);
  return date.getTime();
}

function calendarDay(value: Date | string): number {
  const date = value instanceof Date ? value : new Date(value);

  return Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );
}

function stableCompare(
  left: PreparationQueueOrder,
  right: PreparationQueueOrder,
): number {
  const byNumber = left.number.localeCompare(right.number);

  if (byNumber !== 0) {
    return byNumber;
  }

  return String(left.id).localeCompare(String(right.id));
}

function chronologicalCompare(
  left: PreparationQueueOrder,
  right: PreparationQueueOrder,
): number {
  const leftTime = timestamp(left.orderDate!);
  const rightTime = timestamp(right.orderDate!);

  if (leftTime !== rightTime) {
    return leftTime - rightTime;
  }

  return stableCompare(left, right);
}

function confirmedCompare(
  left: PreparationQueueOrder,
  right: PreparationQueueOrder,
): number {
  const leftDay = calendarDay(left.orderDate!);
  const rightDay = calendarDay(right.orderDate!);

  // Règle absolue :
  // une priorité d'un jour plus récent ne dépasse jamais
  // une commande normale d'un jour plus ancien.
  if (leftDay !== rightDay) {
    return leftDay - rightDay;
  }

  // La priorité intervient uniquement à date calendaire identique.
  if (left.isPriority !== right.isPriority) {
    return left.isPriority ? -1 : 1;
  }

  return chronologicalCompare(left, right);
}

function hasValidOrderDate(
  order: PreparationQueueOrder,
): order is PreparationQueueOrder & {
  orderDate: Date | string;
} {
  if (!order.orderDate) {
    return false;
  }

  return Number.isFinite(timestamp(order.orderDate));
}

export function buildPreparationQueues(
  orders: PreparationQueueOrder[],
): PreparationQueueResult {
  const queues: PreparationQueueResult["queues"] = {
    CONFIRME: [],
    EXPERT: [],
    GROSSISTE: [],
  };

  const manual: PreparationQueueOrder[] = [];

  for (const order of orders) {
    // Jamais de fallback vers createdAt/scheduledAt.
    // Sans vraie date OpenSi, attribution manuelle obligatoire.
    if (!hasValidOrderDate(order)) {
      manual.push(order);
      continue;
    }

    if (order.group === "STANDARD") {
      manual.push(order);
      continue;
    }

    queues[order.group].push(order);
  }

  queues.CONFIRME.sort(confirmedCompare);
  queues.EXPERT.sort(chronologicalCompare);
  queues.GROSSISTE.sort(chronologicalCompare);

  return {
    queues,
    manual,
  };
}

export function getNextPreparationOrder(
  orders: PreparationQueueOrder[],
  zone: PreparationQueueZone,
): PreparationQueueOrder | null {
  const result = buildPreparationQueues(orders);

  return result.queues[zone][0] ?? null;
}

// Export utile pour les futurs tests unitaires.
export const preparationQueueInternals = {
  calendarDay,
  chronologicalCompare,
  confirmedCompare,
  DAY_MS,
};