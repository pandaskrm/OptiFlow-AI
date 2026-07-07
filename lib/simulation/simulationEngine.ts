import { initialSimulation } from "./simulationData";
import { SimulationState } from "./simulationTypes";

let state: SimulationState = structuredClone(initialSimulation);

export function getSimulationState() {
  return state;
}

export function tickSimulation() {
  state = {
    ...state,
    trucksWaiting: Math.max(0, state.trucksWaiting + (Math.random() > 0.6 ? 1 : -1)),
    occupiedDocks: Math.min(6, Math.max(0, state.occupiedDocks + (Math.random() > 0.5 ? 1 : -1))),
    activeReceptions: Math.max(
      0,
      state.activeReceptions + (Math.random() > 0.5 ? 1 : -1)
    ),
    completedToday:
      state.completedToday + (Math.random() > 0.7 ? 1 : 0),
    warehouseHealth: Math.min(
      100,
      Math.max(
        75,
        state.warehouseHealth + (Math.random() > 0.5 ? 1 : -1)
      )
    ),
  };

  return state;
}