"use client";

import { useEffect, useState } from "react";
import useDemo from "../../hooks/useDemo";
import {
  getWorkflowReceptions,
  subscribeWorkflow,
} from "../../lib/workflow/workflowStore";
import { WorkflowReception } from "../../lib/workflow/workflowEngine";
import {
  ACTIVE_RECEPTION_STATUSES,
  RECEPTION_STATUS,
} from "../../constants/receptionStatus";

type DockPlanningProps = {
  refreshKey: number;
};

type Reception = {
  id: number;
  supplier: string;
  carrier: string;
  dock: string;
  pallets: number;
  status: string;
};

const docks = [1, 2, 3, 4, 5, 6];

const STATUS_FREE = "Libre";

const statusStyle: Record<string, string> = {
  [STATUS_FREE]:
    "bg-green-500/20 text-green-400 border-green-500/30",
  [RECEPTION_STATUS.AT_DOCK]:
    "bg-orange-500/20 text-orange-400 border-orange-500/30",
  [RECEPTION_STATUS.UNLOADING]:
    "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  [RECEPTION_STATUS.INSPECTION]:
    "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

function getProgress(status: string) {
  if (status === RECEPTION_STATUS.AT_DOCK) return 40;
  if (status === RECEPTION_STATUS.UNLOADING) return 60;
  if (status === RECEPTION_STATUS.INSPECTION) return 80;
  return 0;
}

function getStatusIcon(status: string) {
  if (status === RECEPTION_STATUS.AT_DOCK) return "🚛";
  if (status === RECEPTION_STATUS.UNLOADING) return "📦";
  if (status === RECEPTION_STATUS.INSPECTION) return "🔎";
  return "🟢";
}

function getDemoStatus(
  status: WorkflowReception["status"]
): string | null {
  if (status === "dock") return RECEPTION_STATUS.AT_DOCK;
  if (status === "unloading") return RECEPTION_STATUS.UNLOADING;
  if (status === "quality") return RECEPTION_STATUS.INSPECTION;

  return null;
}

function convertDemoReceptions(
  rows: WorkflowReception[]
): Reception[] {
  return rows
    .map((row) => {
      const status = getDemoStatus(row.status);

      if (!status) return null;

      return {
        id: row.id,
        supplier: row.supplier,
        carrier: row.carrier,
        dock: `Quai ${row.dock}`,
        pallets: row.pallets,
        status,
      };
    })
    .filter((row): row is Reception => row !== null);
}

export default function DockPlanning({
  refreshKey,
}: DockPlanningProps) {
  const [receptions, setReceptions] = useState<Reception[]>([]);
  const [loading, setLoading] = useState(true);
  const demo = useDemo();

  useEffect(() => {
    if (demo.running) {
      setLoading(false);
      setReceptions(
        convertDemoReceptions(getWorkflowReceptions())
      );

      const unsubscribe = subscribeWorkflow((rows) => {
        setReceptions(convertDemoReceptions(rows));
      });

      return () => {
        unsubscribe();
      };
    }

    async function loadReceptions() {
      try {
        setLoading(true);

        const response = await fetch("/api/receptions", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Impossible de charger les quais.");
        }

        const data = await response.json();
        setReceptions(data);
      } catch (error) {
        console.error(error);
        setReceptions([]);
      } finally {
        setLoading(false);
      }
    }

    loadReceptions();
  }, [refreshKey, demo.running]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">
          📍 Occupation des quais
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Suivi en direct des quais : arrivée, déchargement,
          contrôle et disponibilité.
        </p>
      </div>

      {loading && !demo.running ? (
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 text-center text-slate-400">
          Chargement des quais...
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {docks.map((dock) => {
            const reception = receptions.find(
              (item) =>
                item.dock === `Quai ${dock}` &&
                ACTIVE_RECEPTION_STATUSES.includes(
                  item.status as never
                )
            );

            const status = reception
              ? reception.status
              : STATUS_FREE;

            const icon = getStatusIcon(status);
            const progress = getProgress(status);

            return (
              <div
                key={dock}
                className={`rounded-2xl border bg-slate-800 p-4 transition-all duration-700 hover:-translate-y-1 hover:shadow-lg ${
                  statusStyle[status] || statusStyle[STATUS_FREE]
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-white">
                    Quai {dock}
                  </h3>

                  <span className="text-2xl">{icon}</span>
                </div>

                <div className="mt-4">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold ${
                      statusStyle[status] ||
                      statusStyle[STATUS_FREE]
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
                          <span>{progress}%</span>
                        </div>

                        <div className="h-2 rounded-full bg-slate-700">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-700"
                            style={{ width: `${progress}%` }}
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
      )}
    </div>
  );
}