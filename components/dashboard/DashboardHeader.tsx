"use client";

import Image from "next/image";
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
    ? "Mode D?mo"
    : loading
      ? "Connexion..."
      : error
        ? "Indisponible"
        : hasRealData
          ? "ERP connect?"
          : "ERP non connect?";

  const activityTitle = simulation.running
    ? currentEvent?.title ?? "Simulation active"
    : hasRealData
      ? "Donn?es ERP disponibles"
      : "Aucune activit? disponible";

  const activityMessage = simulation.running
    ? currentEvent?.message ??
      "Le moteur de simulation analyse les op?rations."
    : hasRealData
      ? "Organ?IA Flow analyse les donn?es synchronis?es."
      : "Connectez un ERP ou lancez le Mode D?mo.";

  return (
    <header className="mb-3 space-y-2">
      <div className="organia-electric-panel organia-electric-panel-v2 organia-plasma-active relative overflow-hidden rounded-2xl border border-[#00e5ff]/75 bg-gradient-to-r from-[#01040b] via-[#03152d] to-[#003b88]/65 px-5 py-3 shadow-[0_0_22px_rgba(0,229,255,0.42),0_0_60px_rgba(0,107,255,0.24),inset_0_0_38px_rgba(0,140,255,0.09)]">

        {/* Globe holographique central */}
        <div className="pointer-events-none absolute inset-0 hidden overflow-hidden xl:block">
          <div className="absolute left-1/2 top-1/2 h-[220%] w-[66%] -translate-x-1/2 -translate-y-[40%] opacity-100">
            <Image
              src="/organia-reference/organia-hero-globe-transparent.png"
              alt=""
              fill
              priority
              sizes="900px"
              className="object-contain object-center mix-blend-screen scale-[1.32]"
              style={{
                filter:
                  "saturate(1.75) brightness(1.25) contrast(1.18) drop-shadow(0 0 20px rgba(0,229,255,.65)) drop-shadow(0 0 55px rgba(0,107,255,.45))",
              }}
            />
          </div>

          {/* Boule lumineuse au-dessus du globe */}
          <div className="absolute left-1/2 top-[-4px] z-30 -translate-x-1/2">
            <span className="block h-5 w-5 rounded-full bg-white shadow-[0_0_8px_#ffffff,0_0_18px_#00e5ff,0_0_38px_#008cff,0_0_72px_rgba(0,107,255,0.8)]" />

            <span className="absolute left-1/2 top-5 h-12 w-[2px] -translate-x-1/2 bg-gradient-to-b from-white via-[#00e5ff] to-transparent shadow-[0_0_12px_rgba(0,229,255,0.9)]" />

            <span className="absolute -left-4 -top-4 h-13 w-13 rounded-full border border-[#00e5ff]/25 shadow-[0_0_28px_rgba(0,140,255,0.35)]" />
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[#008cff]/60 bg-[#006bff]/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#49efff] shadow-[0_0_14px_rgba(0,140,255,0.16)]">
                Organ?IA Flow
              </span>

              <LiveClock />
            </div>

            <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-end sm:gap-4">
              <h1 className="text-2xl font-black tracking-tight text-white">
                Bonjour Kevin ??
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
              <div className="min-w-[150px] rounded-xl border border-[#008cff]/60 bg-[#020617]/85 px-3 py-2 shadow-[inset_0_0_14px_rgba(0,107,255,0.07)] backdrop-blur-sm">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Source
                </p>
                <p className="mt-1 text-sm font-bold text-white">
                  {connectionLabel}
                </p>
              </div>

              <div className="min-w-[130px] rounded-xl border border-[#008cff]/60 bg-[#020617]/85 px-3 py-2 shadow-[inset_0_0_14px_rgba(0,107,255,0.07)] backdrop-blur-sm">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Sant? d?p?t
                </p>
                <p className="mt-1 text-sm font-bold text-white">
                  {simulation.running || hasRealData ? `${health} %` : "--"}
                </p>
              </div>

              <div className="min-w-[130px] rounded-xl border border-[#008cff]/60 bg-[#020617]/85 px-3 py-2 shadow-[inset_0_0_14px_rgba(0,107,255,0.07)] backdrop-blur-sm">
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
              className={`inline-flex min-w-[200px] items-center justify-center rounded-lg border px-4 py-2 text-sm font-black text-white transition hover:-translate-y-0.5 ${
                simulation.running
                  ? "border-red-400/60 bg-gradient-to-r from-red-700 to-red-500 shadow-[0_0_22px_rgba(239,68,68,0.35)]"
                  : "border-[#00e5ff]/70 bg-gradient-to-r from-[#006bff] via-[#008cff] to-[#00b8ff] shadow-[0_0_14px_rgba(0,229,255,0.70),0_0_36px_rgba(0,107,255,0.55)] hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(0,229,255,0.95),0_0_48px_rgba(0,107,255,0.70)]"
              }`}
            >
              {simulation.running
                ? "? Arr?ter le Mode D?mo"
                : "? Lancer le Mode D?mo"}
            </button>
          </div>
        </div>
      </div>

      {simulation.running && <ScenarioSelector />}
    </header>
  );
}