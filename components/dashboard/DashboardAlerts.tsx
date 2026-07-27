"use client";

import useSimulationV2 from "../../hooks/useSimulationV2";
import useWarehouseSummary from "../../hooks/useWarehouseSummary";

export default function DashboardAlerts() {
  const { state, running } = useSimulationV2();
  const warehouse = useWarehouseSummary();

  const hasRealData = warehouse.data.dataConnected;

  const alerts = running
    ? state.alerts.map((alert) => alert.message)
    : hasRealData
      ? warehouse.data.alerts
      : [];

  return (
    <div className="rounded-2xl border border-orange-500/20 bg-slate-900/80 p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">
          🚨 Alertes opérationnelles
        </h2>

        {running && (
          <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold text-red-400">
            LIVE
          </span>
        )}
      </div>

      <div className="mt-4 space-y-3">
        {alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <div
              key={`${alert}-${index}`}
              className="rounded-xl border border-orange-500/20 bg-orange-500/10 p-3 text-sm text-orange-200"
            >
              ⚠️ {alert}
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-slate-700 bg-slate-950/40 p-4 text-sm text-slate-400">
            {warehouse.loading
              ? "Chargement des alertes..."
              : hasRealData
                ? "Aucune alerte opérationnelle détectée."
                : "Aucune donnée disponible. Connectez votre ERP ou activez le Mode Démo."}
          </div>
        )}
      </div>

      {running && (
        <div className="mt-5 rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4">
          <p className="text-sm font-semibold text-cyan-300">
            🤖 Analyse IA
          </p>

          <p className="mt-2 text-sm text-slate-300">
            Les alertes proviennent du moteur de simulation en temps réel.
          </p>
        </div>
      )}
    </div>
  );
}
