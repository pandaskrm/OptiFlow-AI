"use client";

import { useEffect, useState } from "react";
import {
  DemoScenario,
  getScenario,
  subscribeScenario,
} from "../lib/scenarios/scenarioStore";
import {
  getGlobalDemoData,
  GlobalDemoData,
} from "../lib/demo/globalDemoData";

export default function useScenario(): {
  scenario: DemoScenario;
  data: GlobalDemoData;
} {
  const [scenario, setScenario] =
    useState<DemoScenario>(getScenario());

  useEffect(() => {
    const unsubscribe = subscribeScenario(setScenario);

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    scenario,
    data: getGlobalDemoData(scenario),
  };
}