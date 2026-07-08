"use client";

import { useEffect, useState } from "react";

import {
  DemoScenario,
  getScenario,
  setScenario,
  subscribeScenario,
  startScenarioAutoplay,
  stopScenarioAutoplay,
  isAutoplayRunning,
} from "../../lib/scenarios/scenarioStore";

const scenarios: {
  id: DemoScenario;
  label: string;
}[] = [
  { id: "normal", label: "🟢 Journée normale" },
  { id: "peak", label: "🟠 Pic d'activité" },
  { id: "black_friday", label: "🔴 Black Friday" },
  { id: "transport_issue", label: "🚚 Incident transport" },
  { id: "quality_alert", label: "🔍 Contrôle qualité" },
];

export default function ScenarioSelector() {
  const [scenario, setCurrentScenario] = useState(getScenario());
  const [autoplay, setAutoplay] = useState(isAutoplayRunning());

  useEffect(() => {
    const unsubscribe = subscribeScenario(setCurrentScenario);

    return () => {
      unsubscribe();
    };
  }, []);

  function startDemo() {
    startScenarioAutoplay();
    setAutoplay(true);
  }

  function stopDemo() {
    stopScenarioAutoplay();
    setAutoplay(false);
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">
            🎬 Mode Démo
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Choisissez un scénario ou lancez la démonstration automatique.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {autoplay ? (
            <>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
                ● AUTOPILOT
              </span>

              <button
                onClick={stopDemo}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                ⏸ Arrêter
              </button>
            </>
          ) : (
            <button
              onClick={startDemo}
              className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500"
            >
              ▶ Lancer la démo
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {scenarios.map((item) => (
          <button
            key={item.id}
            onClick={() => setScenario(item.id)}
            disabled={autoplay}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              scenario === item.id
                ? "bg-cyan-500 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            } ${
              autoplay ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}