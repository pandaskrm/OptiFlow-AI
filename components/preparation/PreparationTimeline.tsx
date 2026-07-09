"use client";

import { useEffect, useState } from "react";

const events = [
  "Commande urgente Chronopost lancée",
  "Contrôle qualité terminé",
  "Renfort affecté allée 12",
  "Nouvelle commande prioritaire détectée",
  "Commande terminée et prête à expédier",
];

export default function PreparationTimeline() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((current) => (current + 1) % events.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-6 text-white shadow-xl">
      <h2 className="text-xl font-bold">Timeline préparation</h2>
      <p className="text-sm text-slate-400">Événements opérationnels en direct.</p>

      <div className="mt-6 space-y-4">
        {events.map((event, index) => (
          <div key={event} className="flex gap-4">
            <div
              className={`mt-1 h-3 w-3 rounded-full ${
                index === active ? "bg-cyan-400" : "bg-slate-700"
              }`}
            />
            <p className={index === active ? "font-semibold text-cyan-200" : "text-slate-400"}>
              {event}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}