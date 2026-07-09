"use client";

import useDemo from "../../hooks/useDemo";

export default function MissionControlBar() {
  const demo = useDemo();

  const trucks = demo.state?.trucksWaiting ?? 2;
  const docks = demo.state?.occupiedDocks ?? 3;
  const receptions = demo.state?.activeReceptions ?? 8;
  const health = demo.state?.warehouseHealth ?? 96;

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