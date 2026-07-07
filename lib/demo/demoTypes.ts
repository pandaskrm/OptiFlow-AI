export type DemoEventType =
  | "truck-arrival"
  | "dock"
  | "unloading"
  | "quality"
  | "finished"
  | "alert"
  | "ai";

export type DemoStatus = "stopped" | "running";

export interface DemoEvent {
  id: number;
  delay: number;
  type: DemoEventType;
  icon: string;
  title: string;
  description: string;
}

export interface DemoKpi {
  trucks: number;
  occupiedDocks: number;
  receptions: number;
  finished: number;
  health: number;
  alerts: number;
  pallets: number;
}

export interface DemoState {
  status: DemoStatus;
  currentStep: number;
  kpi: DemoKpi;
  events: DemoEvent[];
  aiMessage: string;
}