"use client";

import useDemo from "../../hooks/useDemo";
import { getHistoryEvents } from "../../lib/simulation/eventHistory";

export default function LiveActivityFeed() {
  const demo = useDemo();

  const history = getHistoryEvents();

  if (!demo.running) {
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

      {/* Notification Premium */}

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
          {demo.event.title}
        </p>

        <p className="mt-2 text-sm text-slate-300">
          {demo.event.message}
        </p>

      </div>

      {/* Historique */}

      <div className="mt-6">

        <h3 className="mb-3 font-semibold text-white">
          Historique des événements
        </h3>

        <div className="space-y-2">

          {history.map((item) => (

            <div
              key={item.id}
              className="rounded-lg border border-slate-700 bg-slate-800 p-3 transition-all hover:border-cyan-500 hover:bg-slate-800/80"
            >

              <div className="flex items-center justify-between">

                <span className="font-semibold text-cyan-300">
                  {item.title}
                </span>

                <span className="text-xs text-slate-500">
                  {item.time}
                </span>

              </div>

              <p className="mt-1 text-sm text-slate-300">
                {item.message}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}