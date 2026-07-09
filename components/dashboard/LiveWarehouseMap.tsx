"use client";

import useDemo from "../../hooks/useDemo";

export default function LiveWarehouseMap() {
  const demo = useDemo();

  const occupiedDocks = demo.state?.occupiedDocks ?? 3;
  const trucksWaiting = demo.state?.trucksWaiting ?? 2;
  const activeReceptions = demo.state?.activeReceptions ?? 8;
  const completedToday = demo.state?.completedToday ?? 42;

  const docks = Array.from({ length: 6 }, (_, index) => {
    const dockNumber = index + 1;
    const occupied = dockNumber <= occupiedDocks;
    const critical = occupiedDocks >= 5 && occupied;

    return {
      dockNumber,
      occupied,
      critical,
      status: critical ? "Saturé" : occupied ? "Déchargement" : "Libre",
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
            Entrepôt en temps réel
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Vue opérationnelle des camions, quais, zones et décisions IA.
          </p>
        </div>

        <div className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">
          Simulation active
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-[#0b1728] p-6">
        <div className="grid gap-4 xl:grid-cols-[1fr_2fr_1fr]">
          <div className="space-y-4">
            <div className="rounded-xl border border-blue-500/40 bg-blue-500/10 p-4">
              <p className="text-xs uppercase text-blue-300">Arrivées</p>
              <p className="mt-3 text-4xl font-bold text-white">
                🚛 {trucksWaiting}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                camions en approche
              </p>
            </div>

            <div className="rounded-xl border border-cyan-500/40 bg-cyan-500/10 p-4">
              <p className="text-xs uppercase text-cyan-300">Réceptions</p>
              <p className="mt-3 text-4xl font-bold text-white">
                📦 {activeReceptions}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                dossiers actifs
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-cyan-900/70 bg-slate-950/40 p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-cyan-300">
                Zone quais
              </p>
              <p className="text-xs text-slate-400">
                {occupiedDocks}/6 occupés
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-6">
              {docks.map((dock) => (
                <div
                  key={dock.dockNumber}
                  className={`relative rounded-xl border p-4 text-center ${
                    dock.critical
                      ? "border-red-500 bg-red-500/10"
                      : dock.occupied
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-emerald-500 bg-emerald-500/10"
                  }`}
                >
                  {dock.occupied && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xl">
                      🚛
                    </div>
                  )}

                  <p className="mt-2 text-xs text-slate-400">Quai</p>
                  <p className="text-2xl font-bold text-white">
                    {dock.dockNumber}
                  </p>
                  <p
                    className={`mt-2 text-xs font-semibold ${
                      dock.critical
                        ? "text-red-300"
                        : dock.occupied
                        ? "text-orange-300"
                        : "text-emerald-300"
                    }`}
                  >
                    {dock.status}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                <p className="text-xs text-slate-400">Zone A</p>
                <p className="mt-2 text-xl font-bold text-white">📦📦📦</p>
                <p className="text-xs text-emerald-300">Flux normal</p>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                <p className="text-xs text-slate-400">Équipe</p>
                <p className="mt-2 text-xl font-bold text-white">👷 👷 👷</p>
                <p className="text-xs text-cyan-300">18 actifs</p>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                <p className="text-xs text-slate-400">Flux palettes</p>
                <p className="mt-2 text-xl font-bold text-white">➡️ 📦 ➡️</p>
                <p className="text-xs text-blue-300">En mouvement</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4">
              <p className="text-xs uppercase text-emerald-300">Terminées</p>
              <p className="mt-3 text-4xl font-bold text-white">
                ✅ {completedToday}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                opérations aujourd’hui
              </p>
            </div>

            <div className="rounded-xl border border-violet-500/40 bg-violet-500/10 p-4">
              <p className="text-xs uppercase text-violet-300">Décision IA</p>
              <p className="mt-3 text-sm font-semibold text-white">
                Réallouer 1 préparateur vers la zone B.
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Gain estimé : 18 min
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}