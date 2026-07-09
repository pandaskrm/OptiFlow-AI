"use client";

import useDemo from "../../../hooks/useDemo";

export default function LiveWarehouseMap() {
  const demo = useDemo();

  const occupiedDocks = demo.state?.occupiedDocks ?? 3;
  const trucksWaiting = demo.state?.trucksWaiting ?? 2;
  const activeReceptions = demo.state?.activeReceptions ?? 8;
  const completedToday = demo.state?.completedToday ?? 42;

  const docks = Array.from({ length: 6 }, (_, index) => {
    const number = index + 1;
    const occupied = number <= occupiedDocks;
    const critical = occupiedDocks >= 5 && occupied;

    return {
      number,
      status: critical ? "Saturé" : occupied ? "Déchargement" : "Libre",
      color: critical
        ? "border-red-500 bg-red-500/10 text-red-300"
        : occupied
        ? "border-orange-500 bg-orange-500/10 text-orange-300"
        : "border-emerald-500 bg-emerald-500/10 text-emerald-300",
    };
  });

  return (
    <section className="rounded-xl border border-cyan-900 bg-[#07111f] p-6 shadow-lg">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-cyan-400">
            Live Warehouse
          </p>
          <h2 className="mt-1 text-2xl font-bold text-white">
            Plan vivant de l'entrepôt
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Vue opérationnelle des quais, zones, flux et décisions IA.
          </p>
        </div>

        <div className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">
          LIVE · {occupiedDocks}/6 quais
        </div>
      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-5">
        <div className="mb-5 grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-blue-500/40 bg-blue-500/10 p-4">
            <p className="text-xs text-blue-300">Arrivées</p>
            <p className="mt-2 text-3xl font-bold text-white">🚛 {trucksWaiting}</p>
          </div>

          <div className="rounded-xl border border-cyan-500/40 bg-cyan-500/10 p-4">
            <p className="text-xs text-cyan-300">Réception</p>
            <p className="mt-2 text-3xl font-bold text-white">📦 {activeReceptions}</p>
          </div>

          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4">
            <p className="text-xs text-emerald-300">Terminées</p>
            <p className="mt-2 text-3xl font-bold text-white">✅ {completedToday}</p>
          </div>

          <div className="rounded-xl border border-violet-500/40 bg-violet-500/10 p-4">
            <p className="text-xs text-violet-300">Décision IA</p>
            <p className="mt-2 text-sm font-semibold text-white">
              Réallouer 1 préparateur
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-900/70 bg-[#081422] p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-bold text-white">🚛 Zone quais</p>
            <p className="text-xs text-slate-400">Flux entrant en temps réel</p>
          </div>

          <div className="grid gap-3 md:grid-cols-6">
            {docks.map((dock) => (
              <div
                key={dock.number}
                className={`rounded-xl border p-4 text-center ${dock.color}`}
              >
                <p className="text-xl">{dock.status === "Libre" ? "🚪" : "🚛"}</p>
                <p className="mt-2 text-sm text-white">Quai {dock.number}</p>
                <p className="mt-1 text-xs font-bold">{dock.status}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
            <p className="font-bold text-white">📦 Zone Réception</p>
            <p className="mt-4 text-3xl">📦 📦 📦 📦</p>
            <p className="mt-3 text-xs text-emerald-300">Flux normal</p>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
            <p className="font-bold text-white">👷 Zone Préparation</p>
            <p className="mt-4 text-3xl">👷 👷 👷 👷</p>
            <p className="mt-3 text-xs text-cyan-300">Équipe active</p>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
            <p className="font-bold text-white">🚚 Zone Expédition</p>
            <p className="mt-4 text-3xl">🚚 🚚 📦</p>
            <p className="mt-3 text-xs text-blue-300">Départs en préparation</p>
          </div>
        </div>
      </div>
    </section>
  );
}