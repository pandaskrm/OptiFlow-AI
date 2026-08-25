import type { SimulationScenario } from "./simulationTypesV2";

export type SimulationReceptionStatus =
  | "planned"
  | "arriving"
  | "dock"
  | "unloading"
  | "quality"
  | "completed";

export interface SimulationReceptionDetailV2 {
  id: number;
  receptionNumber: string;
  supplier: string;
  carrier: string;
  dock: number;
  pallets: number;
  status: SimulationReceptionStatus;
  progress: number;
}

const scenarioReceptionDetails: Record<
  SimulationScenario,
  SimulationReceptionDetailV2[]
> = {
  normal: [
    { id: 1, receptionNumber: "RE240001", supplier: "Nike", carrier: "DHL", dock: 1, pallets: 24, status: "dock", progress: 20 },
    { id: 2, receptionNumber: "RE240002", supplier: "Apple", carrier: "Geodis", dock: 2, pallets: 18, status: "unloading", progress: 45 },
    { id: 3, receptionNumber: "RE240003", supplier: "Adidas", carrier: "Chronopost", dock: 3, pallets: 12, status: "quality", progress: 75 },
  ],

  peak: [
    { id: 1, receptionNumber: "PK240001", supplier: "Nike", carrier: "DHL", dock: 1, pallets: 28, status: "dock", progress: 20 },
    { id: 2, receptionNumber: "PK240002", supplier: "Apple", carrier: "Geodis", dock: 2, pallets: 22, status: "unloading", progress: 45 },
    { id: 3, receptionNumber: "PK240003", supplier: "Adidas", carrier: "Chronopost", dock: 3, pallets: 18, status: "quality", progress: 75 },
    { id: 4, receptionNumber: "PK240004", supplier: "Samsung", carrier: "UPS", dock: 4, pallets: 26, status: "arriving", progress: 0 },
    { id: 5, receptionNumber: "PK240005", supplier: "Sony", carrier: "DB Schenker", dock: 5, pallets: 20, status: "planned", progress: 0 },
  ],

  black_friday: [
    { id: 1, receptionNumber: "BF240001", supplier: "Nike", carrier: "DHL", dock: 1, pallets: 42, status: "unloading", progress: 55 },
    { id: 2, receptionNumber: "BF240002", supplier: "Apple", carrier: "Geodis", dock: 2, pallets: 36, status: "dock", progress: 20 },
    { id: 3, receptionNumber: "BF240003", supplier: "Samsung", carrier: "UPS", dock: 3, pallets: 31, status: "unloading", progress: 65 },
    { id: 4, receptionNumber: "BF240004", supplier: "Amazon", carrier: "DB Schenker", dock: 4, pallets: 46, status: "arriving", progress: 0 },
    { id: 5, receptionNumber: "BF240005", supplier: "Adidas", carrier: "Chronopost", dock: 5, pallets: 24, status: "quality", progress: 95 },
    { id: 6, receptionNumber: "BF240006", supplier: "Sony", carrier: "DHL", dock: 6, pallets: 39, status: "planned", progress: 0 },
  ],

  transport_issue: [
    { id: 1, receptionNumber: "TR240001", supplier: "Nike", carrier: "DHL", dock: 1, pallets: 24, status: "arriving", progress: 0 },
    { id: 2, receptionNumber: "TR240002", supplier: "Apple", carrier: "Geodis", dock: 2, pallets: 18, status: "dock", progress: 10 },
    { id: 3, receptionNumber: "TR240003", supplier: "Adidas", carrier: "Chronopost", dock: 3, pallets: 12, status: "unloading", progress: 30 },
  ],

  quality_alert: [
    { id: 1, receptionNumber: "QA240001", supplier: "Nike", carrier: "DHL", dock: 1, pallets: 24, status: "quality", progress: 95 },
    { id: 2, receptionNumber: "QA240002", supplier: "Apple", carrier: "Geodis", dock: 2, pallets: 18, status: "quality", progress: 90 },
    { id: 3, receptionNumber: "QA240003", supplier: "Adidas", carrier: "Chronopost", dock: 3, pallets: 12, status: "unloading", progress: 70 },
    { id: 4, receptionNumber: "QA240004", supplier: "Samsung", carrier: "UPS", dock: 4, pallets: 16, status: "dock", progress: 20 },
  ],
};

export function createSimulationReceptionDetailsV2(
  scenario: SimulationScenario,
): SimulationReceptionDetailV2[] {
  return scenarioReceptionDetails[scenario].map((reception) => ({
    ...reception,
  }));
}
