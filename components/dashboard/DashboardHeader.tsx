"use client";

import { useEffect, useState } from "react";

import useDemo from "../../hooks/useDemo";
import useScenario from "../../hooks/useScenario";
import useWarehouseSummary from "../../hooks/useWarehouseSummary";
import {
  setScenario,
  stopScenarioAutoplay,
} from "../../lib/scenarios/scenarioStore";
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
  const demo = useDemo();
  const { data: scenario } = useScenario();
  const { data: warehouse, loading, error } = useWarehouseSummary();

  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    setCurrentDate(formatDate());
  }, []);

  const health = demo.running
    ? scenario.dashboard.health
    : warehouse.healthScore;

  const dataConnected = demo.running || warehouse.dataConnected;

  function startDemo() {
    setScenario("normal");
    demo.start();
  }

  function stopDemo() {
    stopScenarioAutoplay();
    setScenario("normal");
    demo.stop();
  }

  const connectionLabel = demo.running
    ? "Mode Démo actif"
    : loading
      ? "Connexion en cours"
      : error
        ? "Données indisponibles"
        : dataConnected
          ? "ERP connecté"
          : "ERP non connecté";

  return (
    <header className="mb-8 space-y-5">
      <div className="overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 p-6 shadow-2xl shadow-cyan-950/20 lg:p-8">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                OptiFlow AI
              </span>

              <LiveClock />
            </div>

            <p className="text-sm font-semibold text-cyan-400">
              Centre de commandement logistique
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              Bonjour Kevin 👋
            </h1>

            <p className="mt-3 capitalize text-slate-300">
              {currentDate || "Chargement de la date..."}
            </p>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">
              Pilotez les réceptions, les quais, les alertes et les
              recommandations de l’IA depuis une vue unique.
            </p>
          </div>

          <div className="grid w-full gap-3 sm:grid-cols-3 xl:max-w-2xl">
            <div className="rounded-2xl border border-slate-700/80 bg-slate-950/60 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Source
              </p>

              <p
                className={`mt-2 font-bold ${
                  dataConnected
                    ? "text-emerald-400"
                    : "text-slate-300"
                }`}
              >
                {connectionLabel}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700/80 bg-slate-950/60 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Santé dépôt
              </p>

              <p className="mt-2 text-2xl font-black text-white">
                {health} %
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700/80 bg-slate-950/60 p-4 backdrop-blur">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Intelligence IA
              </p>

              <p
                className={`mt-2 font-bold ${
                  dataConnected
                    ? "text-cyan-300"
                    : "text-slate-400"
                }`}
              >
                {dataConnected ? "Analyse active" : "En attente"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-4 border-t border-slate-800 pt-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs text-slate-500">
              Activité en cours
            </p>

            <p className="mt-1 font-semibold text-white">
              {demo.running
                ? demo.event.title
                : "Aucune simulation active"}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              {demo.running
                ? demo.event.message
                : "Connectez un ERP ou lancez le Mode Démo pour alimenter le tableau de bord."}
            </p>
          </div>

          <button
            type="button"
            onClick={demo.running ? stopDemo : startDemo}
            className={`min-w-[230px] rounded-xl px-6 py-3 font-bold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 ${
              demo.running
                ? "bg-red-600 shadow-red-950/40 hover:bg-red-500"
                : "bg-emerald-600 shadow-emerald-950/40 hover:bg-emerald-500"
            }`}
          >
            {demo.running
              ? "■ Arrêter le Mode Démo"
              : "▶ Lancer le Mode Démo"}
          </button>
        </div>
      </div>

      {demo.running && <ScenarioSelector />}
    </header>
  );
}