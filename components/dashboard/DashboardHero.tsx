"use client";

export default function DashboardHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-8 shadow-2xl">
      <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-cyan-500/20 via-blue-500/10 to-transparent" />

      <div className="relative z-10 max-w-3xl">
        <p className="mb-4 text-sm font-bold uppercase tracking-widest text-cyan-300">
          OptiFlow AI
        </p>

        <h1 className="text-5xl font-black leading-tight text-white">
          Votre entrepôt.
          <br />
          <span className="text-cyan-300">Optimisé par l’IA.</span>
        </h1>

        <p className="mt-5 text-xl text-slate-300">
          Anticipez. Optimisez. Performez.
        </p>

        <div className="mt-8 grid max-w-2xl grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-center">
            <p className="text-3xl">📈</p>
            <p className="mt-2 text-sm font-semibold text-white">Décisions</p>
            <p className="text-xs text-slate-400">en temps réel</p>
          </div>

          <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-4 text-center">
            <p className="text-3xl">🤖</p>
            <p className="mt-2 text-sm font-semibold text-white">IA Copilote</p>
            <p className="text-xs text-slate-400">intelligente</p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center">
            <p className="text-3xl">🛡️</p>
            <p className="mt-2 text-sm font-semibold text-white">Opérations</p>
            <p className="text-xs text-slate-400">sécurisées</p>
          </div>

          <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4 text-center">
            <p className="text-3xl">⚡</p>
            <p className="mt-2 text-sm font-semibold text-white">Alertes</p>
            <p className="text-xs text-slate-400">proactives</p>
          </div>
        </div>
      </div>
    </section>
  );
}