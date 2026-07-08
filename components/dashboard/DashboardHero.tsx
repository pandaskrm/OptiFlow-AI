"use client";

import useSimulation from "../../hooks/useSimulation";

export default function DashboardHero() {
  const simulation = useSimulation();

  const kpis = [
    ["🚚", "Camions", simulation.trucksWaiting.toString(), "en attente"],
    ["🚪", "Quais", `${simulation.occupiedDocks}/6`, "occupés"],
    ["📦", "Réceptions", simulation.activeReceptions.toString(), "actives"],
    ["❤️", "Santé", `${simulation.warehouseHealth}%`, "entrepôt"],
  ];

  return (
    <section className="relative min-h-[420px] overflow-hidden rounded-3xl border border-cyan-500/20 bg-slate-950 p-8 shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_30%,rgba(6,182,212,0.28),transparent_34%),radial-gradient(circle_at_92%_78%,rgba(236,72,153,0.25),transparent_30%)]" />
      <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-cyan-500/15 via-blue-500/5 to-transparent" />

      <div className="relative z-10 grid h-full gap-10 xl:grid-cols-[1fr_1fr]">
        <div className="flex flex-col justify-center">
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-cyan-300">
            OptiFlow AI
          </p>

          <h1 className="text-6xl font-black leading-tight text-white">
            Votre entrepôt.
            <br />
            <span className="bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Optimisé par l’IA.
            </span>
          </h1>

          <p className="mt-5 text-xl font-semibold text-white">
            Anticipez. Optimisez. Performez.
          </p>

          <div className="mt-8 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
            {[
              ["📈", "Décisions", "temps réel"],
              ["🤖", "IA Copilote", "active"],
              ["🛡️", "Opérations", "sécurisées"],
              ["⚡", "Alertes", "proactives"],
            ].map(([icon, title, text]) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur transition hover:-translate-y-1 hover:border-cyan-400/40 hover:bg-cyan-500/10"
              >
                <p className="text-3xl">{icon}</p>
                <p className="mt-2 text-sm font-bold text-white">{title}</p>
                <p className="text-xs text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900/90 via-cyan-950/40 to-slate-950 p-6">
          <div className="absolute inset-x-8 bottom-8 h-28 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative h-full rounded-2xl border border-white/10 bg-slate-950/70 p-5">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
                ● Entrepôt connecté
              </span>
              <span className="text-sm text-slate-400">
                Centre de commandement
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {kpis.map(([icon, label, value, detail]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-2xl">{icon}</p>
                  <p className="mt-2 text-xs text-slate-400">{label}</p>
                  <p className="text-3xl font-black text-white">{value}</p>
                  <p className="text-xs font-bold text-cyan-300">{detail}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-purple-500/20 bg-purple-500/10 p-4">
              <p className="text-sm font-bold text-purple-300">
                🤖 Recommandation IA
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Analyse des quais, priorités et alertes en temps réel.
              </p>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 transition-all duration-700"
                style={{ width: `${simulation.warehouseHealth}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}