"use client";

import { useEffect, useState } from "react";
import {
  getWorkflowReceptions,
  subscribeWorkflow,
} from "../../../lib/workflow/workflowStore";
import { WorkflowReception } from "../../../lib/workflow/workflowEngine";

const docks = [1, 2, 3, 4, 5, 6];

function getStatusLabel(reception?: WorkflowReception) {
  if (!reception) return "Libre";

  switch (reception.status) {
    case "arriving":
      return "Camion annoncé";
    case "dock":
      return "À quai";
    case "unloading":
      return "Déchargement";
    case "quality":
      return "Contrôle qualité";
    default:
      return "Libre";
  }
}

function getStatusIcon(reception?: WorkflowReception) {
  if (!reception) return "🟢";

  switch (reception.status) {
    case "arriving":
      return "🚚";
    case "dock":
      return "🚛";
    case "unloading":
      return "📦";
    case "quality":
      return "🔍";
    default:
      return "🟢";
  }
}

function getStatusStyle(reception?: WorkflowReception) {
  if (!reception) {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
  }

  switch (reception.status) {
    case "arriving":
      return "border-blue-500/30 bg-blue-500/10 text-blue-300";
    case "dock":
      return "border-orange-500/30 bg-orange-500/10 text-orange-300";
    case "unloading":
      return "border-cyan-500/30 bg-cyan-500/10 text-cyan-300";
    case "quality":
      return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";
    default:
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
  }
}

export default function LiveWarehouseMap() {
  const [receptions, setReceptions] = useState<WorkflowReception[]>(
    getWorkflowReceptions()
  );

  useEffect(() => {
    const unsubscribe = subscribeWorkflow((data) => {
      setReceptions(data);
    });

    setReceptions(getWorkflowReceptions());

    return () => unsubscribe();
  }, []);

  const activeDocks = receptions.filter(
    (item) => item.status !== "completed"
  ).length;

  const averageProgress =
    receptions.length > 0
      ? Math.round(
          receptions.reduce((sum, item) => sum + item.progress, 0) /
            receptions.length
        )
      : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-950/80 p-5">
      <div className="absolute inset-x-8 bottom-0 h-24 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">
            Live Warehouse
          </p>
          <h3 className="text-xl font-black text-white">
            Jumeau numérique des quais
          </h3>
        </div>

        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
          ● LIVE
        </span>
      </div>

      <div className="relative mb-5 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-slate-400">Quais actifs</p>
          <p className="mt-1 text-3xl font-black text-white">
            {activeDocks}/6
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-slate-400">Progression</p>
          <p className="mt-1 text-3xl font-black text-cyan-300">
            {averageProgress}%
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-slate-400">Flux IA</p>
          <p className="mt-1 text-3xl font-black text-emerald-300">
            OK
          </p>
        </div>
      </div>

      <div className="relative grid gap-3">
        {docks.map((dock) => {
          const reception = receptions.find(
            (item) => item.dock === dock && item.status !== "completed"
          );

          const status = getStatusLabel(reception);
          const icon = getStatusIcon(reception);
          const progress = reception?.progress ?? 0;
          const style = getStatusStyle(reception);

          return (
            <div
              key={dock}
              className={`rounded-2xl border p-3 transition-all duration-700 ${style}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{icon}</span>

                  <div>
                    <p className="text-sm font-bold text-white">
                      Quai {dock}
                    </p>
                    <p className="text-xs text-slate-400">
                      {reception
                        ? `${reception.carrier} · ${reception.supplier}`
                        : "Disponible"}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-black">
                  {status}
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}