"use client";

import { useEffect, useState } from "react";
import useDemo from "../../hooks/useDemo";

type DockPlanningProps = {
  refreshKey: number;
};

type Reception = {
  id: number;
  number: string;
  supplier: string;
  carrier: string;
  dock: string;
  pallets: number;
  status: string;
  scheduledAt: string;
};

const docks = ["Quai 1", "Quai 2", "Quai 3", "Quai 4", "Quai 5"];

const statusStyle: Record<string, string> = {
  Libre: "bg-green-500/20 text-green-400",
  Planifiée: "bg-blue-500/20 text-blue-400",
  "À quai": "bg-orange-500/20 text-orange-400",
  Terminée: "bg-purple-500/20 text-purple-400",
};

export default function DockPlanning({ refreshKey }: DockPlanningProps) {
  const [receptions, setReceptions] = useState<Reception[]>([]);
  const demo = useDemo();

  useEffect(() => {
    loadReceptions();
  }, [refreshKey]);

  async function loadReceptions() {
    const response = await fetch("/api/receptions");
    const data = await response.json();
    setReceptions(data);
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">📍 Occupation des quais</h2>
        <p className="mt-1 text-sm text-slate-400">
          Les quais se mettent à jour automatiquement avec les réceptions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {docks.map((dock) => {
         const demoRunning = demo.running;

const reception = demoRunning
  ? null
  : receptions.find(
      (item) => item.dock === dock && item.status !== "Terminée"
    );

         let status = reception ? reception.status : "Libre";

if (demoRunning) {
  const occupied = demo.state.occupiedDocks;
  const dockNumber = Number(dock.replace("Quai ", ""));

  if (dockNumber <= occupied) {
    status = "À quai";
  } else {
    status = "Libre";
  }
}

          return (
            <div
              key={dock}
              className="rounded-xl border border-slate-700 bg-slate-800 p-4 transition hover:border-blue-500"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">{dock}</h3>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    statusStyle[status] || statusStyle.Libre
                  }`}
                >
                  {status}
                </span>
              </div>

              <div className="mt-5 space-y-2">
                {demoRunning ? (
  status === "À quai" ? (
    <>
      <p className="text-sm text-slate-300">
        🚛 Transporteur Demo
      </p>

      <p className="text-sm text-slate-300">
        📦 {12 + Math.floor(Math.random() * 18)} palettes
      </p>

      <p className="text-sm text-orange-400">
        ⏳ Déchargement...
      </p>
    </>
  ) : (
    <p className="text-sm text-green-400">
      🟢 Disponible
    </p>
  )
) : reception ? (
  <>
    <p className="text-sm text-slate-300">
      🚛 {reception.carrier}
    </p>

    <p className="text-sm text-slate-300">
      📦 {reception.supplier}
    </p>

    <p className="text-sm text-slate-400">
      ⏰ {reception.scheduledAt || "Heure non définie"}
    </p>

    <p className="text-sm text-slate-400">
      Palettes : {reception.pallets}
    </p>
  </>
) : (
  <p className="text-sm text-green-400">
    🟢 Disponible
  </p>
)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}