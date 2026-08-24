import type {
  SimulationScenario,
  SimulationStateV2,
} from "./simulationTypesV2";
import {
  createInitialSimulationStateV2,
  tickSimulationV2,
} from "./simulationEngineV2";

type Listener = (state: SimulationStateV2) => void;

let state = createInitialSimulationStateV2();
let interval: ReturnType<typeof setInterval> | null = null;

const listeners = new Set<Listener>();

export function getSimulationStateV2() {
  return state;
}

export function subscribeSimulationV2(listener: Listener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

function notifySimulationV2() {
  listeners.forEach((listener) => listener(state));
}

export function startSimulationV2() {
  if (interval) return;

  state = {
    ...state,
    running: true,
    simulatedAt: new Date().toISOString(),
  };

  notifySimulationV2();

  interval = setInterval(() => {
    state = tickSimulationV2(state);
    notifySimulationV2();
  }, 3000);
}

export function setSimulationStateV2(
  nextState: SimulationStateV2,
) {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }

  state = {
    ...nextState,
    simulatedAt: new Date().toISOString(),
  };

  notifySimulationV2();
}

export function stopSimulationV2() {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }

  state = {
    ...state,
    running: false,
    simulatedAt: new Date().toISOString(),
  };

  notifySimulationV2();
}

export function resetSimulationV2() {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }

  state = createInitialSimulationStateV2();
  notifySimulationV2();
}

export function setSimulationScenarioV2(
  scenario: SimulationScenario,
) {
  state = {
    ...state,
    scenario,
    simulatedAt: new Date().toISOString(),
  };

  notifySimulationV2();
}
