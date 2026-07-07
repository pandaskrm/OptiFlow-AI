export type SimulationEvent = {
  id: number;
  time: string;
  title: string;
  description: string;
  type: "truck" | "dock" | "reception" | "alert" | "ai";
};

export type SimulationState = {
  trucksWaiting: number;
  occupiedDocks: number;
  activeReceptions: number;
  completedToday: number;
  warehouseHealth: number;
  events: SimulationEvent[];
};