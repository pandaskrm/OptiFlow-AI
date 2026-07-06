"use client";

import { useEffect, useState } from "react";

type DashboardStatsProps = {
  refreshKey: number;
};

type Reception = {
  id: number;
  status: string;
  pallets: number;
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

  const total = receptions.length;
  const pallets = receptions.reduce((sum, item) => sum + item.pallets, 0);
  const planned = receptions.filter((r) => r.status === "Planifiée").length;
  const atDock = receptions.filter((r) => r.status === "À quai").length;
  const alerts = planned + atDock;

  const stats = [
    { label: "Réceptions", value: total, detail: "données réelles" },
    { label: "Quais occupés", value: `${atDock}/6`, detail: `${6 - atDock} quais libres` },
    { label: "Palettes", value: pallets, detail: "total à traiter" },
    { label: "Alertes actives", value: alerts, detail: "à surveiller" },
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