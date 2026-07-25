"use client";

import { useEffect, useState } from "react";
import {
  buildDemoWarehouseSummary,
  DemoWarehouseSummary,
} from "../lib/warehouse/demoWarehouseSummary";
import {
  getWorkflowReceptions,
  subscribeWorkflow,
} from "../lib/workflow/workflowStore";

export default function useDemoWarehouseSummary() {
  const [data, setData] = useState<DemoWarehouseSummary>(() =>
    buildDemoWarehouseSummary(getWorkflowReceptions())
  );

  useEffect(() => {
    const unsubscribe = subscribeWorkflow((receptions) => {
      setData(buildDemoWarehouseSummary(receptions));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return data;
}