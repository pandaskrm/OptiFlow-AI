"use client";

import { useEffect, useState } from "react";
import { Reception } from "../../types/reception";
import { RECEPTION_STATUS } from "../../constants/receptionStatus";

export default function AICopilot() {
  const [receptions, setReceptions] = useState<Reception[]>([]);

  useEffect(() => {
    loadReceptions();
  }, []);

  async function loadReceptions() {
    const response = await fetch("/api/receptions");
    const data = await response.json();
    setReceptions(data);
  }

  const total = receptions.length;
  const pallets = receptions.reduce((sum, item) => sum + item.pallets, 0);

  const planned = receptions.filter(
    (item) => item.status === RECEPTION_STATUS.PLANNED
  ).length;

  const atDock = receptions.filter(
    (item) => item.status === RECEPTION_STATUS.AT_DOCK
  ).length;

  const unloading = receptions.filter(
    (item) => item.status === RECEPTION_STATUS.UNLOADING
  ).length;

  const inspection = receptions.filter(
    (item) => item.status === RECEPTION_STATUS.INSPECTION
  ).length;

  const completed = receptions.filter(
    (item) => item.status === RECEPTION_STATUS.COMPLETED
  ).length;

  const activeReception = receptions.find(
    (item) => item.status !== RECEPTION_STATUS.COMPLETED
  );

  const advice =
    total === 0
      ? "Commencez par enregistrer les réceptions prévues afin d'obtenir un planning automatique des quais."
      : planned > 0
      ? "Des réceptions sont encore planifiées. Priorisez leur mise à quai."
      : unloading > 0
      ? "Des camions sont en déchargement. Surveillez le passage en contrôle qualité."
      : inspection > 0
      ? "Des réceptions sont en contrôle qualité. Pensez à les clôturer dès validation."
      : "Toutes les réceptions sont bien avancées. Continuez le suivi opérationnel.";

  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 to-slate-900 p-6 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/20 text-3xl">
          🤖
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">
            Copilote OptiFlow AI
          </h2>
          <p className="text-slate-400">
            Analyse intelligente des réceptions
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-slate-800/50 p-4">
          <p className="text-sm text-slate-400">Réceptions</p>
          <p className="text-3xl font-bold text-white">{total}</p>
        </div>

        <div className="rounded-xl bg-slate-800/50 p-4">
          <p className="text-sm text-slate-400">Palettes</p>
          <p className="text-3xl font-bold text-white">{pallets}</p>
        </div>

        <div className="rounded-xl bg-slate-800/50 p-4">
          <p className="text-sm text-slate-400">Terminées</p>
          <p className="text-3xl font-bold text-green-400">{completed}</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-slate-800/50 p-5">
        <h3 className="mb-4 font-semibold text-cyan-300">
          Bonjour Kevin 👋
        </h3>

        <div className="space-y-3 text-sm text-slate-300">
          <p>🔵 {planned} planifiée(s)</p>
          <p>🟠 {atDock} à quai</p>
          <p>📦 {unloading} en déchargement</p>
          <p>🔍 {inspection} en contrôle qualité</p>

          {activeReception && (
            <p className="pt-2 text-cyan-200">
              Priorité actuelle : {activeReception.carrier} -{" "}
              {activeReception.dock}
            </p>
          )}

          <p className="pt-3 font-semibold text-cyan-300">
            💡 Conseil du jour
          </p>

          <p>{advice}</p>
        </div>
      </div>
    </div>
  );
}