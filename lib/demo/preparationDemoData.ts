import type { DemoScenario } from "../scenarios/scenarioStore";

export type PreparationDemoData = {
  status: string;
  total: number;
  completed: number;
  inProgress: number;
  urgent: number;
  averageProgress: number;
  serviceRate: number;
};

const preparationDemoData: Record<
  DemoScenario,
  PreparationDemoData
> = {
  normal: {
    status: "Flux maîtrisé",
    total: 486,
    completed: 312,
    inProgress: 94,
    urgent: 12,
    averageProgress: 78,
    serviceRate: 97,
  },

  peak: {
    status: "Activité élevée",
    total: 820,
    completed: 430,
    inProgress: 246,
    urgent: 38,
    averageProgress: 66,
    serviceRate: 91,
  },

  black_friday: {
    status: "Capacité maximale",
    total: 1380,
    completed: 518,
    inProgress: 624,
    urgent: 126,
    averageProgress: 54,
    serviceRate: 84,
  },

  transport_issue: {
    status: "Préparation stable",
    total: 510,
    completed: 354,
    inProgress: 88,
    urgent: 31,
    averageProgress: 82,
    serviceRate: 92,
  },

  quality_alert: {
    status: "Contrôles renforcés",
    total: 430,
    completed: 236,
    inProgress: 112,
    urgent: 27,
    averageProgress: 69,
    serviceRate: 88,
  },
};

export function getPreparationDemoData(
  scenario: DemoScenario
): PreparationDemoData {
  return preparationDemoData[scenario];
}