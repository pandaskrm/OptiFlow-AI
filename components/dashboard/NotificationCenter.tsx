"use client";

import { useEffect, useMemo, useState } from "react";

import useSimulationV2 from "../../hooks/useSimulationV2";
import {
  getHistoryEvents,
  subscribeHistory,
  type EventHistoryItem,
} from "../../lib/simulation/eventHistory";

const CATEGORY_STYLES: Record<
  EventHistoryItem["category"],
  {
    label: string;
    badge: string;
    border: string;
    background: string;
  }
> = {
  event: {
    label: "Événement",
    badge: "bg-blue-100 text-blue-700",
    border: "border-blue-100",
    background: "bg-blue-50/40",
  },
  ai: {
    label: "IA",
    badge: "bg-violet-100 text-violet-700",
    border: "border-violet-100",
    background: "bg-violet-50/40",
  },
  alert: {
    label: "Alerte",
    badge: "bg-orange-100 text-orange-700",
    border: "border-orange-100",
    background: "bg-orange-50/40",
  },
  action: {
    label: "Action",
    badge: "bg-emerald-100 text-emerald-700",
    border: "border-emerald-100",
    background: "bg-emerald-50/40",
  },
};

export default function NotificationCenter() {
  const simulation = useSimulationV2();
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
  const unsubscribe = subscribeHistory(() => {
    setRefresh((value) => value + 1);
  });

  return () => unsubscribe();
}, []);

  const history = useMemo(
    () => getHistoryEvents().slice(0, 8),
    [refresh]
  );

  const alertCount = history.filter(
    (event) => event.category === "alert"
  ).length;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Activité en direct
          </p>

          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            Centre de notifications
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Alertes opérationnelles et événements récents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {alertCount > 0 ? (
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
              {alertCount} alerte{alertCount > 1 ? "s" : ""}
            </span>
          ) : null}

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              simulation.running
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {simulation.running ? "Temps réel" : "Stable"}
          </span>
        </div>
      </div>

      <div className="space-y-3 p-5">
        {history.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
            <p className="font-medium text-slate-700">
              Aucune notification
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Les nouveaux événements apparaîtront ici automatiquement.
            </p>
          </div>
        ) : (
          history.map((event) => {
            const style = CATEGORY_STYLES[event.category];

            return (
              <article
                key={event.id}
                className={`rounded-xl border p-4 transition hover:shadow-sm ${style.border} ${style.background}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-900">
                        {event.title}
                      </p>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${style.badge}`}
                      >
                        {style.label}
                      </span>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {event.message}
                    </p>
                  </div>

                  <time className="shrink-0 text-xs font-medium text-slate-400">
                    {event.time}
                  </time>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
