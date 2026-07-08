"use client";

import { useEffect, useState } from "react";
import AnimatedCounter from "./AnimatedCounter";
import {
  getWorkflowReceptions,
  subscribeWorkflow,
} from "../../lib/workflow/workflowStore";
import { WorkflowReception } from "../../lib/workflow/workflowEngine";

type DashboardStatsProps = {
  refreshKey: number;
};

export default function DashboardStats({ refreshKey }: DashboardStatsProps) {
  const [workflowReceptions, setWorkflowReceptions] = useState<
    WorkflowReception[]
  >(getWorkflowReceptions());

  useEffect(() => {
    setWorkflowReceptions(getWorkflowReceptions());

    const unsubscribe = subscribeWorkflow((data) => {
      setWorkflowReceptions(data);
    });

    return () => unsubscribe();
  }, [refreshKey]);

  const trucksWaiting = workflowReceptions.filter(
    (item) => item.status === "arriving"
  ).length;

  const occupiedDocks = workflowReceptions.filter(
    (item) =>
      item.status === "dock" ||
      item.status === "unloading" ||
      item.status === "quality"
  ).length;

  const activeReceptions = workflowReceptions.filter(
    (item) => item.status !== "completed"
  ).length;

  const completedToday = workflowReceptions.filter(
    (item) => item.status === "completed"
  ).length;

  const alerts = workflowReceptions.filter(
    (item) => item.status === "quality"
  ).length;

  const warehouseHealth = Math.max(
    70,
    100 - trucksWaiting * 5 - alerts * 8 - occupiedDocks * 2
  );

  const stats = [
    {
      label: "🚚 Camions",
      value: trucksWaiting,
      detail: "annoncés",
    },
    {
      label: "🚪 Quais occupés",
      value: occupiedDocks,
      suffix: "/6",
      detail: `${6 - occupiedDocks} libres`,
    },
    {
      label: "📦 Réceptions",
      value: activeReceptions,
      detail: "en cours",
    },
    {
      label: "✅ Terminées",
      value: completedToday,
      detail: "aujourd'hui",
    },
    {
      label: "❤️ Santé",
      value: warehouseHealth,
      suffix: "%",
      detail: "entrepôt",
    },
    {
      label: "⚠ Alertes",
      value: alerts,
      detail: alerts > 0 ? "contrôle qualité" : "RAS",
    },
  ];

  return (
    <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5 shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20"
        >
          <p className="text-sm text-slate-400">{stat.label}</p>

          <p className="mt-3 text-4xl font-bold text-white transition-all duration-500">
            <AnimatedCounter value={stat.value} />
            {stat.suffix ?? ""}
          </p>

          <p className="mt-2 text-sm text-cyan-300 transition-all duration-500">
            {stat.detail}
          </p>
        </div>
      ))}
    </div>
  );
}