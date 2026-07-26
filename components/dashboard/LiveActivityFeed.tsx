"use client";

import useSimulationV2 from "../../hooks/useSimulationV2";

export default function LiveActivityFeed() {
  const { state, running } = useSimulationV2();

  if (!running) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5 shadow-lg">
        <h2 className="text-lg font-bold text-white">
          Centre d'activité
        </h2>

        <p className="mt-4 text-sm text-slate-400">
          Lancez le Mode Démo pour suivre les événements en temps réel.
        </p>
      </div>
    );
  }

  const currentEvent = state.alerts[0];

  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">
          Centre d'activité Live
        </h2>

        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
          LIVE
        </span>
      </div>

      {currentEvent ? (
        <div className="mt-5 animate-pulse rounded-xl border border-amber-400/30 bg-amber-500/10 p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-300">
              🔔 Notification en direct
            </span>

            <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
              NOUVEAU
            </span>
          </div>

          <p className="mt-3 text-lg font-semibold text-white">
            {currentEvent.title}
          </p>

          <p className="mt-2 text-sm text-slate-300">
            {currentEvent.message}
          </p>
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <p className="font-semibold text-emerald-300">
            Activité stable
          </p>

          <p className="mt-2 text-sm text-slate-300">
            Aucune alerte opérationnelle détectée.
          </p>
        </div>
      )}

      <div className="mt-6">
        <h3 className="mb-3 font-semibold text-white">
          Historique des événements
        </h3>

        <div className="space-y-2">
          {state.alerts.length > 0 ? (
            state.alerts.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-slate-700 bg-slate-800 p-3 transition-all hover:border-cyan-500 hover:bg-slate-800/80"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-cyan-300">
                    {item.title}
                  </span>

                  <span className="text-xs text-slate-500">
                    {new Date(item.createdAt).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-300">
                  {item.message}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-slate-700 p-4 text-sm text-slate-400">
              Aucun événement enregistré pour le moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
