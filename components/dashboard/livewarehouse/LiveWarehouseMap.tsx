"use client";

import useSimulationV2 from "../../../hooks/useSimulationV2";

export default function LiveWarehouseMap() {
  const simulation = useSimulationV2();

  const occupiedDocks = simulation.running
    ? simulation.state.docks.occupied
    : 0;

  const trucksWaiting = simulation.running
    ? simulation.state.docks.trucksWaiting
    : 0;

  const activeReceptions = simulation.running
    ? simulation.state.receptions.atDock +
      simulation.state.receptions.unloading +
      simulation.state.receptions.inspection
    : 0;

  const completedToday = simulation.running
    ? simulation.state.receptions.completed
    : 0;

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

        <div
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            simulation.running
              ? "bg-emerald-500/10 text-emerald-300"
              : "bg-slate-800 text-slate-400"
          }`}
        >
          {simulation.running
            ? `LIVE · ${occupiedDocks}/6 quais`
            : "EN ATTENTE"}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-5">
        <div className="mb-5 grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-blue-500/40 bg-blue-500/10 p-4">
            <p className="text-xs text-blue-300">Arrivées</p>

            <p className="mt-2 text-3xl font-bold text-white">
              🚛 {trucksWaiting}
            </p>
          </div>

          <div className="rounded-xl border border-cyan-500/40 bg-cyan-500/10 p-4">
            <p className="text-xs text-cyan-300">Réception</p>

            <p className="mt-2 text-3xl font-bold text-white">
              📦 {activeReceptions}
            </p>
          </div>

          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4">
            <p className="text-xs text-emerald-300">Terminées</p>

            <p className="mt-2 text-3xl font-bold text-white">
              ✅ {completedToday}
            </p>
          </div>

          <div className="rounded-xl border border-violet-500/40 bg-violet-500/10 p-4">
            <p className="text-xs text-violet-300">Décision IA</p>

            <p className="mt-2 text-sm font-semibold text-white">
              {simulation.running
                ? "Réallouer 1 préparateur"
                : "Aucune décision disponible"}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-900/70 bg-[#081422] p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-bold text-white">🚛 Zone quais</p>

            <p className="text-xs text-slate-400">
              {simulation.running
                ? "Flux entrant en temps réel"
                : "Aucune donnée opérationnelle"}
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-6">
            {docks.map((dock) => (
              <div
                key={dock.number}
                className={`rounded-xl border p-4 text-center ${dock.color}`}
              >
                <p className="text-xl">
                  {dock.status === "Libre" ? "🚪" : "🚛"}
                </p>

                <p className="mt-2 text-sm text-white">
                  Quai {dock.number}
                </p>

                <p className="mt-1 text-xs font-bold">
                  {dock.status}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
            <p className="font-bold text-white">📦 Zone Réception</p>

            <p className="mt-4 text-3xl">
              {simulation.running ? "📦 📦 📦 📦" : "—"}
            </p>

            <p className="mt-3 text-xs text-slate-400">
              {simulation.running ? "Flux normal" : "En attente"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
            <p className="font-bold text-white">👷 Zone Préparation</p>

            <p className="mt-4 text-3xl">
              {simulation.running ? "👷 👷 👷 👷" : "—"}
            </p>

            <p className="mt-3 text-xs text-slate-400">
              {simulation.running ? "Équipe active" : "En attente"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
            <p className="font-bold text-white">🚚 Zone Expédition</p>

            <p className="mt-4 text-3xl">
              {simulation.running ? "🚚 🚚 📦" : "—"}
            </p>

            <p className="mt-3 text-xs text-slate-400">
              {simulation.running
                ? "Départs en préparation"
                : "En attente"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
