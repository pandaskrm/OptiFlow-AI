"use client";

import { useEffect, useState } from "react";
import {
  getCurrentDemoEvent,
  getDemoState,
  isDemoRunning,
  startDemo,
  stopDemo,
  subscribeDemo,
} from "@/lib/simulation/demoStore";

export function useDemo() {
  const [state, setState] = useState(getDemoState());
  const [running, setRunning] = useState(isDemoRunning());
  const [event, setEvent] = useState(getCurrentDemoEvent());

  useEffect(() => {
    const unsubscribe = subscribeDemo((newState) => {
      setState({ ...newState });
      setRunning(isDemoRunning());
      setEvent(getCurrentDemoEvent());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    state,
    running,
    event,
    start: startDemo,
    stop: stopDemo,
  };
}
export default useDemo;