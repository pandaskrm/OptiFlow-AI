"use client";

export default function DashboardHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-slate-950 p-8 shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(6,182,212,0.25),transparent_35%),radial-gradient(circle_at_90%_80%,rgba(236,72,153,0.22),transparent_30%)]" />
      <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-cyan-500/10 via-blue-500/5 to-transparent" />

      <div className="relative z-10 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="mb-4 text-sm font-bold uppercase tracking-widest text-cyan-300">
            OptiFlow AI
          </p>

          <h1 className="text-5xl font-black leading-tight text-white">
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
              ["📈", "Décisions", "en temps réel"],
              ["🤖", "IA Copilote", "intelligente"],
              ["🛡️", "Opérations", "sécurisées"],
              ["⚡", "Alertes", "proactives"],
            ].map(([icon, title, text]) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur transition hover:-translate-y-1 hover:border-cyan-400/40"
              >
                <p className="text-3xl">{icon}</p>
                <p className="mt-2 text-sm font-bold text-white">{title}</p>
                <p className="text-xs text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[280px] rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-slate-900 via-cyan-950/40 to-slate-950 p-6">
          <div className="absolute inset-x-8 bottom-8 h-24 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative h-full rounded-2xl border border-white/10 bg-slate-900/70 p-5">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300">
                ● Temps réel
              </span>
              <span className="text-sm text-slate-400">Live warehouse</span>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {[1, 2, 3].map((dock) => (
                <div
                  key={dock}
                  className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-center"
                >
                  <p className="text-xs text-slate-400">Quai 0{dock}</p>
                  <p className="mt-2 text-2xl">🚛</p>
                  <p className="mt-2 text-xs font-bold text-cyan-300">
                    Actif
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-purple-500/20 bg-purple-500/10 p-4">
              <p className="text-sm font-bold text-purple-300">
                🤖 Copilote IA
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Analyse des quais, priorités et alertes en temps réel.
              </p>
            </div>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-700">
              <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}