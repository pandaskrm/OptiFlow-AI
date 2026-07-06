"use client";

import { useEffect, useState } from "react";
import { Reception } from "../../types/reception";
import { generateDashboard } from "../../lib/dashboard/dashboardEngine";

type DashboardStatsProps = {
  refreshKey: number;
};

export default function DashboardStats({ refreshKey }: DashboardStatsProps) {
  const [receptions, setReceptions] = useState<Reception[]>([]);

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
      label: "Réceptions",
      value: dashboard.totalReceptions,
      detail: "données réelles",
    },
    {
      label: "Quais occupés",
      value: `${dashboard.occupiedDocks}/6`,
      detail: `${dashboard.freeDocks} quais libres`,
    },
    {
      label: "Palettes",
      value: dashboard.totalPallets,
      detail: "total à traiter",
    },
    {
      label: "Alertes actives",
      value: dashboard.activeAlerts.length,
      detail:
        dashboard.activeAlerts.length > 0
          ? "à surveiller"
          : "aucune alerte",
    },
  ];

  return (
    <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5 shadow-lg"
        >
          <p className="text-sm text-slate-400">{stat.label}</p>
          <p className="mt-3 text-3xl font-bold text-white">{stat.value}</p>
          <p className="mt-2 text-sm text-cyan-300">{stat.detail}</p>
        </div>
      ))}
    </div>
  );
}