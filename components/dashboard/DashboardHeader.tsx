"use client";

import useDemo from "../../hooks/useDemo";
import ScenarioSelector from "./ScenarioSelector";
import {
  setScenario,
  stopScenarioAutoplay,
} from "../../lib/scenarios/scenarioStore";

export default function DashboardHeader() {
  const demo = useDemo();

  function startDemo() {
    setScenario("normal");
    demo.start();
  }

  function stopDemo() {
    stopScenarioAutoplay();
    setScenario("normal");
    demo.stop();
  }

  return (
    <div className="mb-8 space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-cyan-400">
            Centre de commandement logistique
          </p>

          <h1 className="mt-2 text-4xl font-bold text-white">
            Tableau de bord
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Suivez vos réceptions, vos quais, vos alertes et les
            recommandations IA en temps réel.
          </p>
        </div>

        <div className="flex w-full flex-col gap-4 lg:w-auto lg:min-w-[360px]">
          <div className="w-full rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-4">
            <p className="text-xs text-slate-400">
              {demo.running
                ? "Événement en cours"
                : "Source des données"}
            </p>

            <p className="mt-1 text-lg font-semibold text-cyan-300">
              {demo.running
                ? demo.event.title
                : "Aucun ERP connecté"}
            </p>

            <p className="mt-1 text-sm text-slate-300">
              {demo.running
                ? demo.event.message
                : "Lancez le mode Démo pour simuler l'activité de l'entrepôt."}
            </p>
          </div>

          <button
            type="button"
            onClick={demo.running ? stopDemo : startDemo}
            className={`w-full rounded-xl px-6 py-3 font-bold text-white transition-all duration-300 ${
              demo.running
                ? "bg-red-600 hover:bg-red-700"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {demo.running
              ? "■ Arrêter le Mode Démo"
              : "▶ Lancer le Mode Démo"}
          </button>

          <div
            className={`rounded-xl border px-4 py-2 text-center text-sm font-semibold ${
              demo.running
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-slate-700 bg-slate-900 text-slate-400"
            }`}
          >
            {demo.running
              ? "● Démonstration en cours"
              : "○ Démonstration arrêtée"}
          </div>
        </div>
      </div>

      {demo.running && <ScenarioSelector />}
    </div>
  );
}