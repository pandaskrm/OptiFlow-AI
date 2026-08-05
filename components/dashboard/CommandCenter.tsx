"use client";

import useSimulationV2 from "../../hooks/useSimulationV2";

export default function CommandCenter() {
  const simulation = useSimulationV2();
  const { state } = simulation;

  const trucksWaiting = state.docks.trucksWaiting;
  const occupiedDocks = state.docks.occupied;
  const activeReceptions =
    state.receptions.atDock +
    state.receptions.unloading +
    state.receptions.inspection;
  const completedToday = state.receptions.completed;
  const health = state.kpis.warehouseHealth;

  const actions = [
    {
      icon: "🚛",
      title: `${trucksWaiting} camion${trucksWaiting > 1 ? "s" : ""} en attente`,
      priority: trucksWaiting >= 3 ? "Haute" : "Normale",
      color:
        trucksWaiting >= 3
          ? "border-orange-500"
          : "border-cyan-500",
    },
    {
      icon: "🚪",
      title: `${occupiedDocks}/${state.docks.total} quais occupés`,
      priority: occupiedDocks >= 5 ? "Critique" : "Stable",
      color:
        occupiedDocks >= 5
          ? "border-red-500"
          : "border-emerald-500",
    },
    {
      icon: "📦",
      title: `${activeReceptions} réception${activeReceptions > 1 ? "s" : ""} active${activeReceptions > 1 ? "s" : ""}`,
      priority: activeReceptions >= 15 ? "Haute" : "Moyenne",
      color: "border-cyan-500",
    },
    {
      icon: "✅",
      title: `${completedToday} opération${completedToday > 1 ? "s" : ""} terminée${completedToday > 1 ? "s" : ""} aujourd'hui`,
      priority: "Suivi",
      color: "border-emerald-500",
    },
  ];

  return (
    <section className="rounded-xl border border-cyan-900 bg-[#081422] p-4 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-cyan-400">
            Centre de pilotage
          </p>

          <h2 className="mt-1 text-xl font-bold text-white">
            Poste de commandement
          </h2>

          <p className="mt-2 text-sm text-gray-400">
            Vue en temps réel de l'activité de l'entrepôt.
          </p>
        </div>

        <div
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            state.running
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-slate-800 text-slate-500"
          }`}
        >
          IA {state.running ? "ACTIVE" : "EN ATTENTE"} · {health}%
        </div>
      </div>

      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-cyan-400 transition-all duration-500"
          style={{ width: `${health}%` }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {actions.map((action) => (
          <div
            key={action.title}
            className={`rounded-lg border-l-4 ${action.color} bg-[#0d1d31] p-3 transition hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{action.icon}</span>

              <span className="rounded bg-slate-800 px-2 py-1 text-xs text-cyan-300">
                {action.priority}
              </span>
            </div>

            <p className="mt-2 font-medium text-white">
              {action.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
