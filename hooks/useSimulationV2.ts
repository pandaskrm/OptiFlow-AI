"use client";

import { useSyncExternalStore } from "react";
import {
  getSimulationStateV2,
  resetSimulationV2,
  setSimulationScenarioV2,
  startSimulationV2,
  stopSimulationV2,
  subscribeSimulationV2,
} from "@/lib/simulation/simulationStoreV2";

export function useSimulationV2() {
  const state = useSyncExternalStore(
    subscribeSimulationV2,
    getSimulationStateV2,
    getSimulationStateV2,
  );

  return {
    state,
    running: state.running,
    scenario: state.scenario,
    start: startSimulationV2,
    stop: stopSimulationV2,
    reset: resetSimulationV2,
    setScenario: setSimulationScenarioV2,
  };
}

export default useSimulationV2;
