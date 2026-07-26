export type SimulationScenario =
  | "normal"
  | "peak"
  | "black_friday"
  | "transport_issue"
  | "quality_alert";

export type SimulationAlertLevel = "info" | "warning" | "critical";

export interface SimulationAlert {
  id: string;
  level: SimulationAlertLevel;
  title: string;
  message: string;
  createdAt: string;
}

export interface SimulationAiRecommendation {
  id: string;
  priority: SimulationAlertLevel;
  title: string;
  message: string;
  createdAt: string;
}

export interface SimulationReceptionState {
  planned: number;
  atDock: number;
  unloading: number;
  inspection: number;
  completed: number;
  palletsReceived: number;
}

export interface SimulationPreparationState {
  waitingOrders: number;
  activeOrders: number;
  completedOrders: number;
  pickingProgress: number;
  activePickers: number;
  absentPickers: number;
}

export interface SimulationShippingState {
  waitingShipments: number;
  loadingShipments: number;
  completedShipments: number;
  delayedShipments: number;
}

export interface SimulationStockState {
  totalReferences: number;
  lowStockReferences: number;
  stockouts: number;
  inventoryAccuracy: number;
}

export interface SimulationDockState {
  total: number;
  occupied: number;
  available: number;
  trucksWaiting: number;
}

export interface SimulationKpiState {
  orders: number;
  shipments: number;
  receptions: number;
  serviceRate: number;
  productivity: number;
  warehouseHealth: number;
}

export interface SimulationStateV2 {
  running: boolean;
  tick: number;
  scenario: SimulationScenario;
  simulatedAt: string;
  receptions: SimulationReceptionState;
  preparation: SimulationPreparationState;
  shipping: SimulationShippingState;
  stock: SimulationStockState;
  docks: SimulationDockState;
  kpis: SimulationKpiState;
  alerts: SimulationAlert[];
  aiRecommendations: SimulationAiRecommendation[];
}
