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

const docks = [1, 2, 3, 4, 5];

const statusStyle: Record<string, string> = {
  Libre: "bg-green-500/20 text-green-400",
  "Camion annoncé": "bg-blue-500/20 text-blue-400",
  "À quai": "bg-orange-500/20 text-orange-400",
  Déchargement: "bg-cyan-500/20 text-cyan-400",
  Contrôle: "bg-yellow-500/20 text-yellow-400",
  Terminée: "bg-purple-500/20 text-purple-400",
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
    case "completed":
      return "Terminée";
    default:
      return "Libre";
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
          Les quais sont maintenant pilotés par le Workflow Engine.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {docks.map((dock) => {
          const reception = workflowReceptions.find(
            (item) => item.dock === dock && item.status !== "completed"
          );

          const status = getDockStatus(reception);

          return (
            <div
              key={dock}
              className="rounded-xl border border-slate-700 bg-slate-800 p-4 transition-all duration-500 hover:-translate-y-1 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">Quai {dock}</h3>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    statusStyle[status] || statusStyle.Libre
                  }`}
                >
                  {status}
                </span>
              </div>

              <div className="mt-5 space-y-2">
                {reception ? (
                  <>
                    <p className="text-sm text-slate-300">
                      🚛 {reception.carrier}
                    </p>

                    <p className="text-sm text-slate-300">
                      📦 {reception.supplier}
                    </p>

                    <p className="text-sm text-slate-400">
                      Palettes : {reception.pallets}
                    </p>

                    <div className="pt-2">
                      <div className="mb-1 text-xs text-slate-400">
                        Progression : {reception.progress} %
                      </div>

                      <div className="h-2 rounded-full bg-slate-700">
                        <div
                          className="h-2 rounded-full bg-cyan-500 transition-all duration-700"
                          style={{ width: `${reception.progress}%` }}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-green-400">🟢 Disponible</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}