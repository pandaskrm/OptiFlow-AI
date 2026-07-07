import { SimulationState } from "./simulationTypes";
import { getSimulationState, tickSimulation } from "./simulationEngine";
import { demoEvents } from "./demoEvents";
import {
  addHistoryEvent,
  resetHistory,
} from "./eventHistory";

type Listener = (state: SimulationState) => void;

let state = getSimulationState();
let currentEvent = 0;
let running = false;

const listeners = new Set<Listener>();

export function getDemoState() {
  return state;
}

export function isDemoRunning() {
  return running;
}

export function getCurrentDemoEvent() {
  return demoEvents[currentEvent];
}

export function subscribeDemo(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach((listener) => listener(state));
}

let interval: ReturnType<typeof setInterval> | null = null;

export function startDemo() {
  if (interval) return;

  running = true;
  currentEvent = 0;
  resetHistory();
  addHistoryEvent(currentEvent);
  notify();

  interval = setInterval(() => {
    state = { ...tickSimulation() };
    currentEvent = (currentEvent + 1) % demoEvents.length;
    addHistoryEvent(currentEvent);
    notify();
  }, 3000);
}

export function stopDemo() {
  if (!interval) return;

  clearInterval(interval);
  interval = null;
  running = false;
  currentEvent = 0;
  resetHistory();
  notify();
}