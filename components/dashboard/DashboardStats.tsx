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
      label: "Camions",
      icon: "🚚",
      value: trucksWaiting,
      detail: "annoncés",
      progress: Math.min(100, trucksWaiting * 20),
    },
    {
      label: "Quais occupés",
      icon: "🚪",
      value: occupiedDocks,
      suffix: "/6",
      detail: `${6 - occupiedDocks} libres`,
      progress: Math.min(100, Math.round((occupiedDocks / 6) * 100)),
    },
    {
      label: "Réceptions",
      icon: "📦",
      value: activeReceptions,
      detail: "en cours",
      progress: Math.min(100, activeReceptions * 10),
    },
    {
      label: "Terminées",
      icon: "✅",
      value: completedToday,
      detail: "aujourd'hui",
      progress: Math.min(100, completedToday * 10),
    },
    {
      label: "Santé dépôt",
      icon: "❤️",
      value: warehouseHealth,
      suffix: "%",
      detail: "entrepôt",
      progress: warehouseHealth,
    },
    {
      label: "Alertes",
      icon: "⚠️",
      value: alerts,
      detail: alerts > 0 ? "contrôle qualité" : "RAS",
      progress: Math.min(100, alerts * 25),
    },
  ];

  return (
    <section className="mb-8">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Indicateurs opérationnels
          </p>

          <h2 className="mt-1 text-2xl font-bold text-white">
            Performance en temps réel
          </h2>
        </div>

        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          Mise à jour automatique
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const safeProgress = Math.max(0, Math.min(100, stat.progress));

          return (
            <article
              key={stat.label}
              className="group relative overflow-hidden rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-950 p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-950/30"
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-500/5 blur-2xl transition group-hover:bg-cyan-500/10" />

              <div className="relative">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/80 text-xl">
                      {stat.icon}
                    </span>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        Indicateur
                      </p>

                      <h3 className="mt-1 font-semibold text-slate-200">
                        {stat.label}
                      </h3>
                    </div>
                  </div>

                  <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-300">
                    Live
                  </span>
                </div>

                <div className="mt-6 flex items-end justify-between">
                  <p className="text-4xl font-black tracking-tight text-white">
                    <AnimatedCounter value={stat.value} />
                    {stat.suffix ?? ""}
                  </p>

                  <p className="pb-1 text-sm font-medium text-slate-400">
                    {stat.detail}
                  </p>
                </div>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      safeProgress >= 85
                        ? "bg-emerald-400"
                        : safeProgress >= 60
                          ? "bg-cyan-400"
                          : "bg-orange-400"
                    }`}
                    style={{ width: `${safeProgress}%` }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Niveau actuel
                  </span>

                  <span
                    className={
                      safeProgress >= 85
                        ? "font-semibold text-emerald-400"
                        : safeProgress >= 60
                          ? "font-semibold text-cyan-400"
                          : "font-semibold text-orange-400"
                    }
                  >
                    {safeProgress} %
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}