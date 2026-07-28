"use client";

type AiCommandCenterProps = {
  health: number;
  hasData: boolean;
  simulationRunning: boolean;
  mainPriority: string;
  aiAdvice: string;
  alerts: string[];
};

export default function AiCommandCenter({
  health,
  hasData,
  simulationRunning,
  mainPriority,
  aiAdvice,
  alerts,
}: AiCommandCenterProps) {
  const active = hasData || simulationRunning;

  const healthLabel =
    health >= 80
      ? "Situation maîtrisée"
      : health >= 60
        ? "Vigilance requise"
        : health > 0
          ? "Risque opérationnel"
          : "En attente de données";

  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-cyan-900/70 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 shadow-xl">
      <div className="border-b border-slate-800 p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-800 bg-cyan-500/10 text-xl">
                IA
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                  Intelligence opérationnelle
                </p>

                <h2 className="mt-1 text-2xl font-bold text-white">
                  Centre de commande IA
                </h2>
              </div>
            </div>

            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-400">
              Analyse en temps réel de la santé de l'entrepôt, des risques
              opérationnels et des actions prioritaires.
            </p>
          </div>

          <div
            className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider ${
              active
                ? "border-emerald-700 bg-emerald-500/10 text-emerald-400"
                : "border-slate-700 bg-slate-800 text-slate-400"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                active ? "bg-emerald-400" : "bg-slate-500"
              }`}
            />

            {active ? "Analyse active" : "En attente"}
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-6 lg:grid-cols-[220px_1fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Santé de l'entrepôt
          </p>

          <div className="mt-4 flex items-end gap-2">
            <span className="text-5xl font-black text-white">
              {health}
            </span>

            <span className="pb-1 text-xl font-semibold text-slate-500">
              %
            </span>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-cyan-400 transition-all duration-700"
              style={{ width: `${health}%` }}
            />
          </div>

          <p className="mt-4 text-sm font-semibold text-cyan-300">
            {healthLabel}
          </p>
        </div>

        <div className="grid gap-4">
          <div className="rounded-2xl border border-orange-900/70 bg-orange-500/5 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">
              Priorité principale
            </p>

            <h3 className="mt-3 text-xl font-bold text-white">
              {mainPriority}
            </h3>

            <p className="mt-3 leading-6 text-slate-300">
              {aiAdvice}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-400">
                Alertes détectées
              </p>

              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300">
                {alerts.length}
              </span>
            </div>

            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {alerts.length > 0 ? (
                alerts.slice(0, 4).map((alert) => (
                  <li
                    key={alert}
                    className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3"
                  >
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-400" />
                    <span>{alert}</span>
                  </li>
                ))
              ) : (
                <li className="flex items-center gap-3 rounded-xl border border-emerald-900/60 bg-emerald-500/5 p-3 text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Aucune alerte critique détectée.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
