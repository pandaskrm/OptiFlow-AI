"use client";

import useDemo from "../../hooks/useDemo";

export default function CommandCenter() {
  const demo = useDemo();

  const trucksWaiting = demo.state?.trucksWaiting ?? 2;
  const occupiedDocks = demo.state?.occupiedDocks ?? 3;
  const activeReceptions = demo.state?.activeReceptions ?? 14;
  const completedToday = demo.state?.completedToday ?? 38;
  const health = demo.state?.warehouseHealth ?? 96;

  const actions = [
    {
      icon: "🚛",
      title: `${trucksWaiting} camions en attente`,
      priority: trucksWaiting >= 3 ? "Haute" : "Normale",
      color: trucksWaiting >= 3 ? "border-orange-500" : "border-cyan-500",
    },
    {
      icon: "🚪",
      title: `${occupiedDocks}/6 quais occupés`,
      priority: occupiedDocks >= 5 ? "Critique" : "Stable",
      color: occupiedDocks >= 5 ? "border-red-500" : "border-emerald-500",
    },
    {
      icon: "📦",
      title: `${activeReceptions} réceptions actives`,
      priority: activeReceptions >= 15 ? "Haute" : "Moyenne",
      color: "border-cyan-500",
    },
    {
      icon: "✅",
      title: `${completedToday} opérations terminées aujourd'hui`,
      priority: "Suivi",
      color: "border-emerald-500",
    },
  ];

  return (
    <section className="rounded-xl border border-cyan-900 bg-[#081422] p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-cyan-400">
            Centre de pilotage
          </p>

          <h2 className="text-2xl font-bold text-white mt-1">
            Poste de Commandement
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            Vue temps réel de l'activité entrepôt.
          </p>
        </div>

        <div className="rounded-full bg-emerald-500/20 px-4 py-2 text-emerald-400 text-sm font-semibold">
          IA ACTIVE · {health}%
        </div>
      </div>

      <div className="mb-5 h-2 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-cyan-400 transition-all duration-500"
          style={{ width: `${health}%` }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {actions.map((action, index) => (
          <div
            key={index}
            className={`rounded-lg border-l-4 ${action.color} bg-[#0d1d31] p-4 transition hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{action.icon}</span>

              <span className="rounded bg-slate-800 px-2 py-1 text-xs text-cyan-300">
                {action.priority}
              </span>
            </div>

            <p className="mt-4 text-white font-medium">{action.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}