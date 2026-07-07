"use client";

import { useEffect, useState } from "react";
import {
  getSimulationState,
  tickSimulation,
} from "../lib/simulation/simulationEngine";
import { SimulationState } from "../lib/simulation/simulationTypes";

export default function useSimulation() {
  const [simulation, setSimulation] = useState<SimulationState>(
    getSimulationState()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setSimulation({ ...tickSimulation() });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return simulation;
}