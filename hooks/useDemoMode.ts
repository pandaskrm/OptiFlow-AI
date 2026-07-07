"use client";

import { useEffect, useState } from "react";
import { nextDemoEvent, resetDemo } from "../lib/simulation/demoEngine";
import { SimulationEvent } from "../lib/simulation/simulationTypes";

export default function useDemoMode() {
  const [running, setRunning] = useState(false);
  const [events, setEvents] = useState<SimulationEvent[]>([]);

  function startDemo() {
    resetDemo();
    setEvents([]);
    setRunning(true);
  }

  function stopDemo() {
    setRunning(false);
  }

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      const event = nextDemoEvent();

      setEvents((current) => [event, ...current].slice(0, 6));
    }, 3000);

    return () => clearInterval(interval);
  }, [running]);

  return {
    running,
    events,
    startDemo,
    stopDemo,
  };
}