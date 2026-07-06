"use client";

import { useEffect, useState } from "react";
import { Reception } from "../../types/reception";
import { generateDailyBrief } from "../../lib/ai/dailyBrief";

export default function AICopilot() {
  const [receptions, setReceptions] = useState<Reception[]>([]);

  useEffect(() => {
    async function loadReceptions() {
      const response = await fetch("/api/receptions");
      const data = await response.json();
      setReceptions(data);
    }

    loadReceptions();
  }, []);

  const brief = generateDailyBrief(receptions);

  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 to-slate-900 p-6 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/20 text-3xl">
          🤖
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">
            Brief IA du matin
          </h2>
          <p className="text-slate-400">
            Analyse automatique de votre activité réception
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-slate-800/50 p-4">
          <p className="text-sm text-slate-400">Réceptions</p>
          <p className="text-3xl font-bold text-white">{brief.total}</p>
        </div>

        <div className="rounded-xl bg-slate-800/50 p-4">
          <p className="text-sm text-slate-400">Palettes</p>
          <p className="text-3xl font-bold text-white">{brief.pallets}</p>
        </div>

        <div className="rounded-xl bg-slate-800/50 p-4">
          <p className="text-sm text-slate-400">Terminées</p>
          <p className="text-3xl font-bold text-green-400">
            {brief.completed}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-slate-800/50 p-5">
        <h3 className="mb-4 font-semibold text-cyan-300">
          Bonjour Kevin 👋
        </h3>

        <div className="space-y-3 text-sm text-slate-300">
          <p>🎯 Priorité actuelle : {brief.priority}</p>
          <p>⏱️ {brief.estimatedEndTime}</p>

          <div className="pt-3">
            <p className="font-semibold text-orange-300">⚠️ Alertes</p>

            {brief.alerts.length > 0 ? (
              <div className="mt-2 space-y-2">
                {brief.alerts.map((alert) => (
                  <p key={alert}>• {alert}</p>
                ))}
              </div>
            ) : (
              <p className="mt-2">Aucune alerte active.</p>
            )}
          </div>

          <div className="pt-3">
            <p className="font-semibold text-cyan-300">
              💡 Recommandation IA
            </p>
            <p className="mt-2">{brief.recommendation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}