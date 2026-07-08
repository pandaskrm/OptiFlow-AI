"use client";

import { useEffect, useState } from "react";

import useDemo from "../../hooks/useDemo";
import { getHistoryEvents } from "../../lib/simulation/eventHistory";
import { subscribeEvents } from "../../lib/events/eventBus";
export default function NotificationCenter() {
  const demo = useDemo();
  const [, setRefresh] = useState(0);
  useEffect(() => {
  const unsubscribe = subscribeEvents(() => {
    setRefresh((value) => value + 1);
  });

  return () => unsubscribe();
}, []);
  const history = getHistoryEvents().slice(0, 5);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Centre de notifications
          </h2>
          <p className="text-sm text-slate-500">
            Alertes opérationnelles en temps réel
          </p>
        </div>

        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {demo.running ? "Live" : "Stable"}
        </span>
      </div>

      <div className="space-y-3">
        {history.length === 0 ? (
          <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
            Aucune alerte pour le moment.
          </div>
        ) : (
          history.map((event, index) => (
            <div
              key={`${event.title}-${index}`}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {event.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {event.message}
                  </p>
                </div>

                <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-700">
                  {event.category}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}