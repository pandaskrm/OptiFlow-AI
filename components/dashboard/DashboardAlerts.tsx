"use client";

import useDemo from "../../hooks/useDemo";

export default function DashboardAlerts() {
  const demo = useDemo();

  const alerts = demo.running
    ? [
        demo.event.message,
        `Camions en attente : ${demo.state.trucksWaiting}`,
        `Quais occupés : ${demo.state.occupiedDocks}/6`,
      ]
    : [
        "Quai 2 occupé depuis plus de 45 minutes",
        "Transporteur DHL attendu dans 20 minutes",
        "Contrôle qualité en attente sur 2 réceptions",
      ];

  return (
    <div className="rounded-2xl border border-orange-500/20 bg-slate-900/80 p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">
          🚨 Alertes opérationnelles
        </h2>

        {demo.running && (
          <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold text-red-400">
            LIVE
          </span>
        )}
      </div>

      <div className="mt-4 space-y-3">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className="rounded-xl border border-orange-500/20 bg-orange-500/10 p-3 text-sm text-orange-200"
          >
            ⚠️ {alert}
          </div>
        ))}
      </div>

      {demo.running && (
        <div className="mt-5 rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4">
          <p className="text-sm font-semibold text-cyan-300">
            🤖 Analyse IA
          </p>

          <p className="mt-2 text-sm text-slate-300">
            L'IA surveille actuellement les quais et les arrivées de camions.
            Les alertes sont mises à jour automatiquement pendant la démonstration.
          </p>
        </div>
      )}
    </div>
  );
}