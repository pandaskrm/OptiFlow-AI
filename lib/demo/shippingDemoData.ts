import type { DemoScenario } from "../scenarios/scenarioStore";

export type ShippingDemoData = {
  status: string;
  total: number;
  shipped: number;
  loading: number;
  urgent: number;
  parcels: number;
  pallets: number;
  averageProgress: number;
  serviceRate: number;
};

const shippingDemoData: Record<
  DemoScenario,
  ShippingDemoData
> = {
  normal: {
    status: "Flux maîtrisé",
    total: 32,
    shipped: 18,
    loading: 6,
    urgent: 3,
    parcels: 338,
    pallets: 26,
    averageProgress: 67,
    serviceRate: 97,
  },

  peak: {
    status: "Activité élevée",
    total: 68,
    shipped: 31,
    loading: 18,
    urgent: 11,
    parcels: 742,
    pallets: 61,
    averageProgress: 59,
    serviceRate: 91,
  },

  black_friday: {
    status: "Capacité maximale",
    total: 121,
    shipped: 42,
    loading: 37,
    urgent: 28,
    parcels: 1680,
    pallets: 132,
    averageProgress: 48,
    serviceRate: 84,
  },

  transport_issue: {
    status: "Transport perturbé",
    total: 14,
    shipped: 4,
    loading: 3,
    urgent: 9,
    parcels: 214,
    pallets: 18,
    averageProgress: 34,
    serviceRate: 76,
  },

  quality_alert: {
    status: "Contrôles renforcés",
    total: 25,
    shipped: 11,
    loading: 7,
    urgent: 6,
    parcels: 295,
    pallets: 24,
    averageProgress: 57,
    serviceRate: 88,
  },
};

export function getShippingDemoData(
  scenario: DemoScenario
): ShippingDemoData {
  return shippingDemoData[scenario];
}