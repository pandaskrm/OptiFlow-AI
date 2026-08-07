import { preparationOrders } from "./preparationData";

export type PreparationOperationalInput = {
  orders: {
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
  workforce: {
    present: number;
    paused: number;
    reinforcement: number;
    productivity: number;
  };
};

export type PreparationPrediction = {
  remainingLines: number;
  activeEmployees: number;
  projectedMinutes: number;
  projectedEnd: string;
  delayMinutes: number;
  currentHourlyCapacity: number;
  requiredHourlyCapacity: number;
  onTimeProbability: number;
  confidenceScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  reinforcementNeeded: number;
  title: string;
  message: string;
  recommendation: string;
};

export function getPreparationStats() {
  const total = preparationOrders.length;

  const completed = preparationOrders.filter(
    (order) => order.status === "Terminée"
  ).length;

  const inProgress = preparationOrders.filter(
    (order) => order.status === "En préparation"
  ).length;

  const urgent = preparationOrders.filter(
    (order) => order.priority === "Haute"
  ).length;

  const averageProgress =
    total > 0
      ? Math.round(
          preparationOrders.reduce(
            (sum, order) => sum + order.progress,
            0
          ) / total
        )
      : 0;

  return {
    total,
    completed,
    inProgress,
    urgent,
    averageProgress,
    serviceRate: 98,
    productivity: 112,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function getPreparationPrediction(
  input: PreparationOperationalInput,
  now = new Date()
): PreparationPrediction {
  const { orders, workforce } = input;

  const remainingLines = Math.max(
    0,
    orders.totalLines - orders.preparedLines
  );

  const activeEmployees = Math.max(
    0,
    workforce.present - workforce.paused
  );

  const currentHourlyCapacity =
    workforce.productivity > 0
      ? workforce.productivity
      : activeEmployees * 45;

  const projectedMinutes =
    remainingLines > 0 && currentHourlyCapacity > 0
      ? Math.ceil((remainingLines / currentHourlyCapacity) * 60)
      : 0;

  const projectedDate = new Date(
    now.getTime() + projectedMinutes * 60_000
  );

  const deadline = new Date(now);
  deadline.setHours(14, 0, 0, 0);

  const rawDelayMinutes = Math.ceil(
    (projectedDate.getTime() - deadline.getTime()) / 60_000
  );

  const delayMinutes = Math.max(0, rawDelayMinutes);

  const minutesUntilDeadline = Math.max(
    1,
    Math.floor(
      (deadline.getTime() - now.getTime()) / 60_000
    )
  );

  const requiredHourlyCapacity =
    remainingLines > 0
      ? Math.ceil((remainingLines / minutesUntilDeadline) * 60)
      : 0;

  const capacityRatio =
    requiredHourlyCapacity > 0
      ? currentHourlyCapacity / requiredHourlyCapacity
      : 1;

  const riskLevel: PreparationPrediction["riskLevel"] =
    delayMinutes > 15
      ? "HIGH"
      : delayMinutes > 0
        ? "MEDIUM"
        : "LOW";

  const estimatedEmployeeCapacity =
    activeEmployees > 0 && currentHourlyCapacity > 0
      ? currentHourlyCapacity / activeEmployees
      : 45;

  const reinforcementNeeded =
    riskLevel === "LOW"
      ? 0
      : Math.max(
          1,
          Math.ceil(
            Math.max(
              0,
              requiredHourlyCapacity - currentHourlyCapacity
            ) / Math.max(1, estimatedEmployeeCapacity)
          )
        );

  const onTimeProbability =
    remainingLines === 0
      ? 100
      : clamp(Math.round(capacityRatio * 100), 5, 99);

  const confidenceScore = clamp(
    70 +
      (orders.totalLines > 0 ? 8 : 0) +
      (orders.preparedLines >= 0 ? 5 : 0) +
      (workforce.present > 0 ? 7 : 0) +
      (workforce.productivity > 0 ? 10 : 0),
    70,
    97
  );

  const projectedEnd = formatTime(projectedDate);

  const base = {
    remainingLines,
    activeEmployees,
    projectedMinutes,
    projectedEnd,
    delayMinutes,
    currentHourlyCapacity,
    requiredHourlyCapacity,
    onTimeProbability,
    confidenceScore,
    riskLevel,
    reinforcementNeeded,
  };

  if (riskLevel === "HIGH") {
    return {
      ...base,
      title: "Risque élevé sur l'objectif de préparation",
      message: `${remainingLines} lignes restent à préparer. Fin estimée à ${projectedEnd}, soit ${delayMinutes} min après l'objectif.`,
      recommendation: `Renforcer immédiatement la préparation avec ${reinforcementNeeded} collaborateur${reinforcementNeeded > 1 ? "s" : ""} et prioriser les commandes devant partir aujourd'hui.`,
    };
  }

  if (riskLevel === "MEDIUM") {
    return {
      ...base,
      title: "Objectif de préparation sous surveillance",
      message: `${remainingLines} lignes restent à préparer. La fin est estimée à ${projectedEnd}, légèrement au-delà de l'objectif.`,
      recommendation: `Prévoir ${reinforcementNeeded} renfort${reinforcementNeeded > 1 ? "s" : ""} si le rythme baisse dans les prochaines minutes.`,
    };
  }

  return {
    ...base,
    reinforcementNeeded: 0,
    title: "Objectif de préparation maîtrisé",
    message: `${remainingLines} lignes restent à préparer. La fin est estimée à ${projectedEnd}.`,
    recommendation:
      "Maintenir la cadence actuelle et continuer à surveiller les commandes prioritaires.",
  };
}

export function getPreparationAiInsight(
  input?: PreparationOperationalInput
) {
  if (input) {
    return getPreparationPrediction(input);
  }

  const stats = getPreparationStats();

  return {
    title: "Analyse IA préparation",
    message: `${stats.urgent} commandes prioritaires sont à surveiller. ${stats.inProgress} commandes sont actuellement en préparation. Le taux de service est de ${stats.serviceRate} %.`,
    recommendation:
      "Prioriser les commandes haute priorité et surveiller les commandes à fort volume.",
  };
}
