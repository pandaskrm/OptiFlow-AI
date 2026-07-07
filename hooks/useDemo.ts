"use client";

import { useEffect, useState } from "react";
import {
  getCurrentDemoEvent,
  getDemoState,
  isDemoRunning,
  startDemo,
  stopDemo,
  subscribeDemo,
} from "../lib/simulation/demoStore";
import { SimulationState } from "../lib/simulation/simulationTypes";

export default function useDemo() {
  const [state, setState] = useState<SimulationState>(getDemoState());
  const [running, setRunning] = useState(isDemoRunning());
  const [event, setEvent] = useState(getCurrentDemoEvent());

  useEffect(() => {
    const unsubscribe = subscribeDemo((newState) => {
      setState({ ...newState });
      setRunning(isDemoRunning());
      setEvent(getCurrentDemoEvent());
    });

    return unsubscribe;
  }, []);

  function start() {
    startDemo();
    setRunning(true);
    setEvent(getCurrentDemoEvent());
  }

  function stop() {
    stopDemo();
    setRunning(false);
    setState({ ...getDemoState() });
    setEvent(getCurrentDemoEvent());
  }

  return {
    running,
    state,
    event,
    start,
    stop,
  };
}