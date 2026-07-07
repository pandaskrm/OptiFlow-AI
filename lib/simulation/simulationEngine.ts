import { initialSimulation } from "./simulationData";
import { SimulationState } from "./simulationTypes";

let state: SimulationState = structuredClone(initialSimulation);

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getSimulationState() {
  return state;
}

export function tickSimulation() {
  const truckVariation = random(-1, 2);
  const dockVariation = random(-1, 1);
  const receptionVariation = random(-1, 2);
  const completedVariation = Math.random() > 0.55 ? 1 : 0;
  const healthVariation = random(-2, 2);

  state = {
    ...state,

    trucksWaiting: Math.max(
      0,
      Math.min(12, state.trucksWaiting + truckVariation)
    ),

    occupiedDocks: Math.max(
      0,
      Math.min(6, state.occupiedDocks + dockVariation)
    ),

    activeReceptions: Math.max(
      0,
      Math.min(25, state.activeReceptions + receptionVariation)
    ),

    completedToday: state.completedToday + completedVariation,

    warehouseHealth: Math.max(
      70,
      Math.min(100, state.warehouseHealth + healthVariation)
    ),
  };

  return state;
}