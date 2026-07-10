"use client";

import { useEffect, useState } from "react";

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

const activeStatuses = ["À quai", "Déchargement", "Contrôle"];

const statusStyle: Record<string, string> = {
  Libre: "bg-green-500/20 text-green-400 border-green-500/30",
  "À quai": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Déchargement: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  Contrôle: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

function getProgress(status: string) {
  if (status === "À quai") return 40;
  if (status === "Déchargement") return 60;
  if (status === "Contrôle") return 80;
  return 0;
}

function getStatusIcon(status: string) {
  if (status === "À quai") return "🚛";
  if (status === "Déchargement") return "📦";
  if (status === "Contrôle") return "🔍";
  return "🟢";
}

function getStoredReceptions(): Reception[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export default function DockPlanning({ refreshKey }: DockPlanningProps) {
  const [receptions, setReceptions] = useState<Reception[]>([]);

  useEffect(() => {
    setReceptions(getStoredReceptions());
  }, [refreshKey]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">📍 Occupation des quais</h2>
        <p className="mt-1 text-sm text-slate-400">
          Suivi live des quais : arrivée, déchargement, contrôle et disponibilité.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {docks.map((dock) => {
          const reception = receptions.find(
            (item) =>
              item.dock === `Quai ${dock}` && activeStatuses.includes(item.status)
          );

          const status = reception ? reception.status : "Libre";
          const icon = getStatusIcon(status);
          const progress = getProgress(status);

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
                    <p className="text-sm text-slate-200">🚛 {reception.carrier}</p>
                    <p className="text-sm text-slate-300">📦 {reception.supplier}</p>
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
                    <p className="text-sm font-bold text-green-400">🟢 Disponible</p>
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