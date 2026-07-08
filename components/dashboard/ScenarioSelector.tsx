"use client";

import {
  DemoScenario,
  getScenario,
  setScenario,
  subscribeScenario,
} from "../../lib/scenarios/scenarioStore";
import { useEffect, useState } from "react";

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

  useEffect(() => {
  const unsubscribe = subscribeScenario(setCurrentScenario);

  return () => {
    unsubscribe();
  };
}, []);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-lg font-bold text-white">
        🎬 Mode Démo
      </h2>

      <p className="mt-1 text-sm text-slate-400">
        Choisissez le scénario à simuler.
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        {scenarios.map((item) => (
          <button
            key={item.id}
            onClick={() => setScenario(item.id)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              scenario === item.id
                ? "bg-cyan-500 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}