"use client";

import { useEffect, useState } from "react";

import useSimulationV2 from "../../hooks/useSimulationV2";
import useWarehouseSummary from "../../hooks/useWarehouseSummary";
import { stopScenarioAutoplay } from "../../lib/scenarios/scenarioStore";
import LiveClock from "./LiveClock";
import ScenarioSelector from "./ScenarioSelector";

function formatDate() {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export default function DashboardHeader() {
  const simulation = useSimulationV2();
  const { data: warehouse, loading, error } = useWarehouseSummary();

  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    setCurrentDate(formatDate());
  }, []);

  const currentEvent = simulation.state.alerts[0];
  const hasRealData = warehouse.dataConnected;

  const health = simulation.running
    ? simulation.state.kpis.warehouseHealth
    : hasRealData
      ? warehouse.healthScore
      : 0;

  function startDemo() {
    simulation.setScenario("normal");
    simulation.start();
  }

  function stopDemo() {
    stopScenarioAutoplay();
    simulation.setScenario("normal");
    simulation.stop();
  }

  const connectionLabel = simulation.running
    ? "Mode Démo"
    : loading
      ? "Connexion..."
      : error
        ? "Indisponible"
        : hasRealData
          ? "ERP connecté"
          : "ERP non connecté";

  const activityTitle = simulation.running
    ? currentEvent?.title ?? "Simulation active"
    : hasRealData
      ? "Données ERP disponibles"
      : "Aucune activité disponible";

  const activityMessage = simulation.running
    ? currentEvent?.message ??
      "Le moteur de simulation analyse les opérations."
    : hasRealData
      ? "OptiFlow AI analyse les données synchronisées."
      : "Connectez un ERP ou lancez le Mode Démo.";

  return (
    <header className="mb-3 space-y-2">
      <div className="overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/30 px-5 py-3 shadow-lg">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                OptiFlow AI
              </span>

              <LiveClock />
            </div>

            <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-end sm:gap-4">
              <h1 className="text-2xl font-black tracking-tight text-white">
                Bonjour Kevin 👋
              </h1>

              <p className="text-sm capitalize text-slate-400">
                {currentDate || "Chargement..."}
              </p>
            </div>

            <div className="mt-2 flex flex-col gap-1">
              <p className="text-sm font-semibold text-white">
                {activityTitle}
              </p>

              <p className="text-sm text-slate-400">
                {activityMessage}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 xl:items-end">
            <div className="grid w-full gap-2 sm:grid-cols-3 xl:w-auto">
              <div className="min-w-[150px] rounded-xl border border-slate-700/80 bg-slate-950/60 px-3 py-2">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Source
                </p>
                <p className="mt-1 text-sm font-bold text-white">
                  {connectionLabel}
                </p>
              </div>

              <div className="min-w-[130px] rounded-xl border border-slate-700/80 bg-slate-950/60 px-3 py-2">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Santé dépôt
                </p>
                <p className="mt-1 text-sm font-bold text-white">
                  {simulation.running || hasRealData ? `${health} %` : "--"}
                </p>
              </div>

              <div className="min-w-[130px] rounded-xl border border-slate-700/80 bg-slate-950/60 px-3 py-2">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Intelligence IA
                </p>
                <p className="mt-1 text-sm font-bold text-white">
                  {simulation.running || hasRealData
                    ? "Analyse active"
                    : "En attente"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={simulation.running ? stopDemo : startDemo}
              className={`inline-flex min-w-[200px] items-center justify-center rounded-lg px-4 py-2 text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 ${
                simulation.running
                  ? "bg-red-600 hover:bg-red-500"
                  : "bg-emerald-600 hover:bg-emerald-500"
              }`}
            >
              {simulation.running
                ? "■ Arrêter le Mode Démo"
                : "▶ Lancer le Mode Démo"}
            </button>
          </div>
        </div>
      </div>

      {simulation.running && <ScenarioSelector />}
    </header>
  );
}
