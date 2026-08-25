"use client";

import useSimulationV2 from "../../hooks/useSimulationV2";

const events = [
  "Commande urgente Chronopost lancée",
  "Contrôle qualité terminé",
  "Renfort affecté allée 12",
  "Nouvelle commande prioritaire détectée",
  "Commande terminée et prête à expédier",
];

export default function PreparationTimeline() {
  const simulation = useSimulationV2();
  const active = simulation.state.tick % events.length;

  return (
    <section className="rounded-3xl border border-[#006bff]/35 bg-gradient-to-br from-[#071426] via-[#06101f] to-[#020617] p-6 text-white shadow-[0_0_24px_rgba(0,107,255,0.10)]">
      <h2 className="text-xl font-bold">Timeline préparation</h2>

      <p className="text-sm text-slate-500">
        Événements opérationnels en direct.
      </p>

      <div className="mt-6 space-y-4">
        {events.map((event, index) => (
          <div key={event} className="flex gap-4">
            <div
              className={`mt-1 h-3 w-3 rounded-full ${
                index === active
                  ? "bg-[#00e5ff] shadow-[0_0_12px_rgba(0,229,255,0.65)]"
                  : "bg-[#16304f]"
              }`}
            />

            <p
              className={
                index === active
                  ? "font-semibold text-[#7df4ff]"
                  : "text-slate-500"
              }
            >
              {event}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
