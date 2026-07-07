"use client";

import useDemo from "../../hooks/useDemo";

export default function DemoEventCard() {
  const demo = useDemo();

  if (!demo.running) return null;

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5 shadow-lg">
      <p className="text-sm font-semibold text-cyan-300">
        🤖 Événement IA en direct
      </p>

      <h3 className="mt-3 text-xl font-bold text-white">
        {demo.event.title}
      </h3>

      <p className="mt-2 text-sm text-slate-300">
        {demo.event.message}
      </p>

      <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
        <p className="font-semibold text-emerald-300">
          💡 Recommandation IA
        </p>

        <p className="mt-2 text-sm text-slate-300">
          Adapter les ressources en fonction de l’événement en cours.
        </p>
      </div>
    </div>
  );
}