"use client";

import { useEffect, useState } from "react";
import useDemo from "../../hooks/useDemo";
import {
  getWorkflowReceptions,
  subscribeWorkflow,
} from "../../lib/workflow/workflowStore";
import { WorkflowReception } from "../../lib/workflow/workflowEngine";

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

const STORAGE_KEY = "optiflow_receptions";
const docks = [1, 2, 3, 4, 5, 6];

const STATUS_FREE = "Libre";
const STATUS_DOCK = "\u00c0 quai";
const STATUS_UNLOADING = "D\u00e9chargement";
const STATUS_QUALITY = "Contr\u00f4le";

const activeStatuses = [
  STATUS_DOCK,
  STATUS_UNLOADING,
  STATUS_QUALITY,
];

const statusStyle: Record<string, string> = {
  [STATUS_FREE]:
    "bg-green-500/20 text-green-400 border-green-500/30",
  [STATUS_DOCK]:
    "bg-orange-500/20 text-orange-400 border-orange-500/30",
  [STATUS_UNLOADING]:
    "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  [STATUS_QUALITY]:
    "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

function getProgress(status: string) {
  if (status === STATUS_DOCK) return 40;
  if (status === STATUS_UNLOADING) return 60;
  if (status === STATUS_QUALITY) return 80;
  return 0;
}

function getStatusIcon(status: string) {
  if (status === STATUS_DOCK) return "\ud83d\ude9b";
  if (status === STATUS_UNLOADING) return "\ud83d\udce6";
  if (status === STATUS_QUALITY) return "\ud83d\udd0e";
  return "\ud83d\udfe2";
}

function getStoredReceptions(): Reception[] {
  if (typeof window === "undefined") return [];

  return JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "[]"
  );
}

function getDemoStatus(
  status: WorkflowReception["status"]
): string | null {
  if (status === "dock") return STATUS_DOCK;
  if (status === "unloading") return STATUS_UNLOADING;
  if (status === "quality") return STATUS_QUALITY;

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
  const demo = useDemo();

  useEffect(() => {
    if (demo.running) {
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

    setReceptions(getStoredReceptions());
  }, [refreshKey, demo.running]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">
          {"\ud83d\udccd Occupation des quais"}
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          {
            "Suivi en direct des quais : arriv\u00e9e, d\u00e9chargement, contr\u00f4le et disponibilit\u00e9."
          }
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {docks.map((dock) => {
          const reception = receptions.find(
            (item) =>
              item.dock === `Quai ${dock}` &&
              activeStatuses.includes(item.status)
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
                      {"\ud83d\ude9b"} {reception.carrier}
                    </p>

                    <p className="text-sm text-slate-300">
                      {"\ud83d\udce6"} {reception.supplier}
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
                      {"\ud83d\udfe2 Disponible"}
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