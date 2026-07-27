"use client";

import useSimulationV2 from "../../hooks/useSimulationV2";
import useWarehouseSummary from "../../hooks/useWarehouseSummary";

export default function MissionControlBar() {
  const simulation = useSimulationV2();
  const warehouse = useWarehouseSummary();

  const hasRealData = warehouse.data.dataConnected;

  const trucks = simulation.running
    ? simulation.state.docks.trucksWaiting
    : 0;

  const docks = simulation.running
    ? simulation.state.docks.occupied
    : hasRealData
      ? warehouse.data.receptions.occupiedDocks
      : 0;

  const receptions = simulation.running
    ? simulation.state.receptions.atDock +
      simulation.state.receptions.unloading +
      simulation.state.receptions.inspection
    : hasRealData
      ? warehouse.data.receptions.active
      : 0;

  const health = simulation.running
    ? simulation.state.kpis.warehouseHealth
    : hasRealData
      ? warehouse.data.healthScore
      : 0;

  return (
    <section className="rounded-2xl border border-cyan-900 bg-gradient-to-r from-[#081422] to-[#10253d] p-5 shadow-xl">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <div>
          <p className="text-xs uppercase text-slate-400">
            État global
          </p>
          <p className="mt-2 text-2xl font-bold text-emerald-400">
            🟢 {health}%
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-slate-400">
            Camions
          </p>
          <p className="mt-2 text-2xl font-bold text-white">
            🚛 {trucks}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-slate-400">
            Quais occupés
          </p>
          <p className="mt-2 text-2xl font-bold text-white">
            🚪 {docks}/6
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-slate-400">
            Réceptions
          </p>
          <p className="mt-2 text-2xl font-bold text-white">
            📦 {receptions}
          </p>
        </div>

        <div className="flex items-center justify-center rounded-xl bg-cyan-500/10">
          <span className="font-semibold text-cyan-300">
            {simulation.running
              ? "🤖 IA : Entrepôt sous contrôle"
              : hasRealData
                ? "🤖 IA : Analyse ERP"
                : "🤖 IA : ERP non connecté"}
          </span>
        </div>
      </div>
    </section>
  );
}
