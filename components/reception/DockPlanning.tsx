"use client";

import { useEffect, useState } from "react";
import {
  getWorkflowReceptions,
  subscribeWorkflow,
} from "../../lib/workflow/workflowStore";
import { WorkflowReception } from "../../lib/workflow/workflowEngine";

type DockPlanningProps = {
  refreshKey: number;
};

const docks = [1, 2, 3, 4, 5, 6];

const statusStyle: Record<string, string> = {
  Libre: "bg-green-500/20 text-green-400 border-green-500/30",
  "Camion annoncé": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "À quai": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Déchargement: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Contrôle: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

function getDockStatus(reception?: WorkflowReception) {
  if (!reception) return "Libre";

  switch (reception.status) {
    case "arriving":
      return "Camion annoncé";
    case "dock":
      return "À quai";
    case "unloading":
      return "Déchargement";
    case "quality":
      return "Contrôle";
    default:
      return "Libre";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "Camion annoncé":
      return "🚚";
    case "À quai":
      return "🚛";
    case "Déchargement":
      return "📦";
    case "Contrôle":
      return "🔍";
    default:
      return "🟢";
  }
}

export default function DockPlanning({ refreshKey }: DockPlanningProps) {
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

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">
          📍 Occupation des quais
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Suivi live des quais : arrivée, déchargement, contrôle et disponibilité.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {docks.map((dock) => {
          const reception = workflowReceptions.find(
            (item) => item.dock === dock && item.status !== "completed"
          );

          const status = getDockStatus(reception);
          const icon = getStatusIcon(status);

          return (
            <div
              key={dock}
              className={`rounded-2xl border bg-slate-800 p-4 transition-all duration-700 hover:-translate-y-1 hover:shadow-lg ${
                statusStyle[status] || statusStyle.Libre
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-white">Quai {dock}</h3>

                <span className="text-2xl">{icon}</span>
              </div>

              <div className="mt-4">
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold ${
                    statusStyle[status] || statusStyle.Libre
                  }`}
                >
                  {status}
                </span>
              </div>

              <div className="mt-5 min-h-[120px] space-y-2">
                {reception ? (
                  <>
                    <p className="text-sm text-slate-200">
                      🚛 {reception.carrier}
                    </p>

                    <p className="text-sm text-slate-300">
                      📦 {reception.supplier}
                    </p>

                    <p className="text-sm text-slate-400">
                      Palettes : {reception.pallets}
                    </p>

                    <div className="pt-3">
                      <div className="mb-1 flex justify-between text-xs text-slate-400">
                        <span>Progression</span>
                        <span>{reception.progress}%</span>
                      </div>

                      <div className="h-2 rounded-full bg-slate-700">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700"
                          style={{ width: `${reception.progress}%` }}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full min-h-[100px] items-center justify-center rounded-xl border border-green-500/20 bg-green-500/10">
                    <p className="text-sm font-bold text-green-400">
                      🟢 Disponible
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}