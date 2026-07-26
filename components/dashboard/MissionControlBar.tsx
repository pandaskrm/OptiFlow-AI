"use client";

import useSimulationV2 from "../../hooks/useSimulationV2";

export default function MissionControlBar() {
  const simulation = useSimulationV2();

  const trucks = simulation.state.docks.trucksWaiting;
  const docks = simulation.state.docks.occupied;
  const receptions =
    simulation.state.receptions.atDock +
    simulation.state.receptions.unloading +
    simulation.state.receptions.inspection;
  const health = simulation.state.kpis.warehouseHealth;

  return (
    <section className="rounded-2xl border border-cyan-900 bg-gradient-to-r from-[#081422] to-[#10253d] p-5 shadow-xl">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <div>
          <p className="text-xs uppercase text-slate-400">État global</p>
          <p className="mt-2 text-2xl font-bold text-emerald-400">
            🟢 {health}%
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-slate-400">Camions</p>
          <p className="mt-2 text-2xl font-bold text-white">
            🚛 {trucks}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-slate-400">Quais occupés</p>
          <p className="mt-2 text-2xl font-bold text-white">
            🚪 {docks}/6
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-slate-400">Réceptions</p>
          <p className="mt-2 text-2xl font-bold text-white">
            📦 {receptions}
          </p>
        </div>

        <div className="flex items-center justify-center rounded-xl bg-cyan-500/10">
          <span className="font-semibold text-cyan-300">
            🤖 IA : Entrepôt sous contrôle
          </span>
        </div>
      </div>
    </section>
  );
}
