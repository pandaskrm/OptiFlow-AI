"use client";

import { useEffect, useState } from "react";
import { Reception } from "../../types/reception";
import { generateDailyBrief } from "../../lib/ai/dailyBrief";
import DemoEventCard from "./DemoEventCard";
import {
  OptiFlowEvent,
  subscribeEvents,
} from "../../lib/events/eventBus";

function getAiMessage(event: OptiFlowEvent, payload: any) {
  switch (event) {
    case "truck_arrived":
      return `Le camion ${payload.carrier} vient d'arriver au quai ${payload.dock}. Préparez l'équipe réception.`;

    case "dock_reserved":
      return `${payload.receptionNumber} est maintenant à quai. Le déchargement peut démarrer.`;

    case "unloading_started":
      return `Déchargement en cours pour ${payload.receptionNumber}. Surveillez la progression et les palettes sensibles.`;

    case "quality_started":
      return `Contrôle qualité lancé pour ${payload.receptionNumber}. Vérifiez les écarts avant validation.`;

    case "reception_completed":
      return `${payload.receptionNumber} est terminée. Le quai ${payload.dock} peut être libéré.`;

    default:
      return "Analyse logistique en cours.";
  }
}

export default function AICopilot() {
  const [receptions, setReceptions] = useState<Reception[]>([]);
  const [liveMessage, setLiveMessage] = useState(
    "J'analyse l'activité de l'entrepôt en temps réel."
  );

  useEffect(() => {
    async function loadReceptions() {
      const response = await fetch("/api/receptions");
      const data = await response.json();
      setReceptions(data);
    }

    loadReceptions();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeEvents((event, payload) => {
      setLiveMessage(getAiMessage(event, payload));
    });

    return () => unsubscribe();
  }, []);

  const brief = generateDailyBrief(receptions);

  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 p-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/20 text-4xl">
            🤖
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white">Copilote IA</h2>
            <p className="text-slate-400">
              Analyse intelligente de votre activité logistique
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-center">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Santé entrepôt
          </p>
          <p className="text-3xl font-bold text-emerald-400">
            {brief.warehouseHealth}%
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5">
        <h3 className="font-bold text-cyan-300">
          🧠 Analyse IA live
        </h3>
        <p className="mt-3 text-slate-200 leading-7">
          {liveMessage}
        </p>
      </div>

      <div className="mt-8">
        <DemoEventCard />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-slate-800/60 p-5">
          <p className="text-sm text-slate-400">Réceptions</p>
          <p className="mt-2 text-3xl font-bold text-white">{brief.total}</p>
        </div>

        <div className="rounded-xl bg-slate-800/60 p-5">
          <p className="text-sm text-slate-400">Risque</p>
          <p className="mt-2 text-3xl font-bold text-orange-400">
            {brief.risk}
          </p>
        </div>

        <div className="rounded-xl bg-slate-800/60 p-5">
          <p className="text-sm text-slate-400">Confiance IA</p>
          <p className="mt-2 text-3xl font-bold text-cyan-400">
            {brief.confidence}%
          </p>
        </div>

        <div className="rounded-xl bg-slate-800/60 p-5">
          <p className="text-sm text-slate-400">Alertes</p>
          <p className="mt-2 text-3xl font-bold text-orange-400">
            {brief.alerts.length}
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-800/50 p-6">
        <h3 className="text-xl font-bold text-cyan-300">
          Bonjour Kevin 👋
        </h3>

        <p className="mt-4 text-slate-300 leading-7">
          Aujourd'hui,{" "}
          <span className="font-semibold text-white">
            {brief.total} réception(s)
          </span>{" "}
          sont planifiées, représentant{" "}
          <span className="font-semibold text-white">
            {brief.pallets} palettes
          </span>{" "}
          à traiter.
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-5">
            <h4 className="font-bold text-orange-300">
              🎯 Priorité actuelle
            </h4>

            <p className="mt-3 text-slate-300">{brief.priority}</p>
            <p className="mt-2 text-cyan-300">{brief.estimatedEndTime}</p>
          </div>

          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5">
            <h4 className="font-bold text-red-300">
              ⚠ Analyse des alertes
            </h4>

            {brief.alerts.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {brief.alerts.map((alert) => (
                  <li key={alert} className="text-slate-300">
                    • {alert}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-emerald-400">
                ✔ Aucun risque détecté.
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5">
          <h4 className="font-bold text-emerald-300">
            💡 Recommandation IA
          </h4>

          <p className="mt-3 text-slate-300 leading-7">
            {brief.recommendation}
          </p>
        </div>
      </div>
    </div>
  );
}