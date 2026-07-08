"use client";

import { useEffect, useState } from "react";
import { Reception } from "../../types/reception";
import { generateDashboard } from "../../lib/dashboard/dashboardEngine";
import useSimulation from "../../hooks/useSimulation";
import AnimatedCounter from "./AnimatedCounter";

type DashboardStatsProps = {
  refreshKey: number;
};

export default function DashboardStats({
  refreshKey,
}: DashboardStatsProps) {
  const [receptions, setReceptions] = useState<Reception[]>([]);
  const simulation = useSimulation();

  useEffect(() => {
    async function loadStats() {
      const response = await fetch("/api/receptions");
      const data = await response.json();
      setReceptions(data);
    }

    loadStats();
  }, [refreshKey]);

  const dashboard = generateDashboard(receptions);

  const stats = [
    {
      label: "🚚 Camions",
      value: simulation.trucksWaiting,
      detail: "en attente",
    },
    {
      label: "🚪 Quais occupés",
      value: `${simulation.occupiedDocks}/6`,
      detail: `${6 - simulation.occupiedDocks} libres`,
    },
    {
      label: "📦 Réceptions",
      value: simulation.activeReceptions,
      detail: `${dashboard.totalReceptions} réelles`,
    },
    {
      label: "✅ Terminées",
      value: simulation.completedToday,
      detail: "aujourd'hui",
    },
    {
      label: "❤️ Santé",
      value: `${simulation.warehouseHealth}%`,
      detail: "entrepôt",
    },
    {
      label: "⚠ Alertes",
      value: dashboard.activeAlerts.length,
      detail:
        dashboard.activeAlerts.length > 0
          ? "à surveiller"
          : "RAS",
    },
  ];

  return (
    <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5 shadow-lg transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20"
        >
          <p className="text-sm text-slate-400">
            {stat.label}
          </p>

          <p className="mt-3 text-4xl font-bold text-white transition-all duration-500">
  {typeof stat.value === "number" ? (
    <AnimatedCounter value={stat.value} />
  ) : (
    stat.value
  )}
</p>

          <p className="mt-2 text-sm text-cyan-300 transition-all duration-500">
            {stat.detail}
          </p>
        </div>
      ))}
    </div>
  );
}