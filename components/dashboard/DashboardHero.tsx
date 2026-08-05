"use client";

import { useEffect, useState } from "react";
import useSimulationV2 from "../../hooks/useSimulationV2";
import useWarehouseSummary from "../../hooks/useWarehouseSummary";
import {
  DemoScenario,
  getScenario,
  subscribeScenario,
} from "../../lib/scenarios/scenarioStore";
import LiveWarehouseMap from "./livewarehouse/LiveWarehouseMap";
import LiveClock from "./LiveClock";

const scenarioLabels: Record<DemoScenario, string> = {
  normal: "🟢 Journée normale",
  peak: "🟠 Pic d'activité",
  black_friday: "🔴 Black Friday",
  transport_issue: "🚚 Incident transport",
  quality_alert: "🔍 Contrôle qualité",
};

const scenarioMessages: Record<DemoScenario, string> = {
  normal: "Activité stable. Les quais sont sous contrôle.",
  peak: "Pic d'activité détecté. Renforcez l'équipe réception.",
  black_friday: "Charge exceptionnelle. Risque de saturation élevé.",
  transport_issue: "Incident transport. Réorganisez les quais prioritaires.",
  quality_alert: "Contrôle qualité renforcé sur les réceptions sensibles.",
};

const scenarioBadgeStyle: Record<DemoScenario, string> = {
  normal: "bg-emerald-500/20 text-emerald-300",
  peak: "bg-orange-500/20 text-orange-300",
  black_friday: "bg-red-500/20 text-red-300",
  transport_issue: "bg-blue-500/20 text-blue-300",
  quality_alert: "bg-yellow-500/20 text-yellow-300",
};

export default function DashboardHero() {
  const [scenario, setScenario] = useState<DemoScenario>(getScenario());
  const simulation = useSimulationV2();
  const warehouse = useWarehouseSummary();

  useEffect(() => {
    const unsubscribe = subscribeScenario(setScenario);
    return () => unsubscribe();
  }, []);

  const hasRealData = warehouse.data.dataConnected;
  const hasOperationalData = simulation.running || hasRealData;

  const missionTitle = simulation.running
    ? scenario === "normal"
      ? "Entrepôt parfaitement fluide"
      : scenario === "peak"
        ? "Pic d'activité détecté"
        : scenario === "black_friday"
          ? "Black Friday : capacité maximale"
          : scenario === "transport_issue"
            ? "Retard transport identifié"
            : "Contrôle qualité renforcé"
    : hasRealData
      ? "Pilotage des opérations en temps réel"
      : "En attente de connexion ERP";

  const missionMessage = simulation.running
    ? scenarioMessages[scenario]
    : hasRealData
      ? "Les indicateurs affichés proviennent des données opérationnelles de votre entrepôt."
      : "Connectez votre ERP ou activez le Mode Démo pour afficher les indicateurs et recommandations IA.";

  const productivity = simulation.running
    ? simulation.state.kpis.productivity
    : hasRealData
      ? warehouse.data.performance.productivity
      : 0;

  const occupiedDocks = simulation.running
    ? simulation.state.docks.occupied
    : hasRealData
      ? warehouse.data.receptions.occupiedDocks
      : 0;

  const serviceRate = simulation.running
    ? simulation.state.kpis.serviceRate
    : hasRealData
      ? warehouse.data.performance.service
      : 0;

  const metrics = [
    [`${productivity}%`, "Productivité"],
    [`${occupiedDocks}`, "Quais occupés"],
    [`${serviceRate}%`, "Taux de service"],
  ];

  return (
    <section className="relative min-h-[380px] overflow-hidden rounded-2xl border border-cyan-500/20 bg-slate-950 p-5 shadow-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(6,182,212,0.28),transparent_35%),radial-gradient(circle_at_95%_80%,rgba(236,72,153,0.20),transparent_30%)]" />

      <div className="relative z-10 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col justify-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-cyan-300">
            OptiFlow AI
          </p>

          <h1 className="text-4xl font-black leading-tight text-white xl:text-5xl">
            Votre entrepôt.
            <br />
            <span className="bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Optimisé par l'IA.
            </span>
          </h1>

          <p className="mt-3 text-lg font-semibold text-white">
            Anticipez. Optimisez. Performez.
          </p>

          <div className="mt-5 rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">
              {hasOperationalData
                ? "Mission IA en cours"
                : "Assistant opérationnel"}
            </p>

            <h3 className="mt-2 text-2xl font-black text-white">
              {missionTitle}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              {missionMessage}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {metrics.map(([value, label]) => (
              <div
                key={label}
                className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3"
              >
                <p className="text-2xl font-black text-cyan-300">
                  {value}
                </p>
                <p className="mt-1 text-xs text-slate-300">
                  {label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-1 text-xs text-slate-300 sm:grid-cols-2">
            <p>✓ Pilotage des quais en temps réel</p>
            <p>✓ Réceptions intelligentes et priorisées</p>
            <p>✓ Alertes opérationnelles instantanées</p>
            <p>✓ Recommandations IA en continu</p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ["📈", "Décisions"],
              ["🤖", "IA Copilote"],
              ["🛡️", "Sécurité"],
              ["⚡", "Alertes"],
            ].map(([icon, title]) => (
              <div
                key={title}
                className="rounded-xl border border-white/10 bg-white/5 p-3 text-center transition hover:border-cyan-400/40 hover:bg-cyan-500/10"
              >
                <p className="text-2xl">{icon}</p>
                <p className="mt-1 text-xs font-bold text-white">
                  {title}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-slate-900/90 via-cyan-950/40 to-slate-950 p-4">
          <div className="mb-3 flex items-center justify-between">
            {simulation.running ? (
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${scenarioBadgeStyle[scenario]}`}
              >
                {scenarioLabels[scenario]}
              </span>
            ) : (
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  hasRealData
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-slate-700/60 text-slate-300"
                }`}
              >
                {hasRealData
                  ? "🟢 ERP synchronisé"
                  : "⚪ ERP non connecté"}
              </span>
            )}

            <span className="text-sm text-slate-500">
              Centre de commandement
            </span>
          </div>

          <div className="mb-3 flex justify-end">
            <LiveClock />
          </div>

          <LiveWarehouseMap />
        </div>
      </div>
    </section>
  );
}
