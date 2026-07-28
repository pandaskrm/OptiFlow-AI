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

  return (
    <section className="mb-8 rounded-2xl border border-blue-900 bg-slate-900 p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-cyan-400">
            IA OPERATIONNELLE
          </p>

          <h2 className="mt-1 text-2xl font-bold text-white">
            Centre de commande IA
          </h2>
        </div>

        <div
          className={`rounded-full px-4 py-2 text-sm font-bold ${
            active
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-slate-800 text-slate-400"
          }`}
        >
          {active ? "ACTIVE" : "EN ATTENTE"}
        </div>
      </div>

      <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-cyan-400 transition-all duration-500"
          style={{ width: `${health}%` }}
        />
      </div>

      <p className="mt-3 text-lg font-semibold text-white">
        Santé de l'entrepôt : {health}%
      </p>

      <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800 p-5">
        <p className="text-sm font-bold text-orange-400">
          PRIORITÉ
        </p>

        <h3 className="mt-2 text-xl font-bold text-white">
          {mainPriority}
        </h3>

        <p className="mt-3 text-slate-300">
          {aiAdvice}
        </p>
      </div>

      <div className="mt-5 rounded-xl border border-slate-700 bg-slate-800 p-5">
        <p className="text-sm font-bold text-red-400">
          ALERTES
        </p>

        <ul className="mt-3 space-y-2 text-slate-300">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <li key={alert}>• {alert}</li>
            ))
          ) : (
            <li>Aucune alerte critique.</li>
          )}
        </ul>
      </div>
    </section>
  );
}
