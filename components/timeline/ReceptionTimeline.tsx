"use client";

import { generateReceptionTimeline } from "../../lib/timeline/timelineEngine";
import { Reception } from "../../types/reception";

type Props = {
  reception: Reception;
};

export default function ReceptionTimeline({ reception }: Props) {
  const timeline = generateReceptionTimeline(reception);

  return (
    <div className="rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-xl">

      <div className="flex items-center justify-between border-b border-slate-700 pb-6">

        <div>

          <h2 className="text-3xl font-bold text-white">
            🚚 Timeline de la réception
          </h2>

          <p className="mt-2 text-slate-400">
            Suivi complet des opérations en temps réel
          </p>

        </div>

        <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-6 py-4 text-center">

          <p className="text-xs uppercase tracking-wider text-slate-400">
            Progression
          </p>

          <p className="text-3xl font-bold text-cyan-400">
            {timeline.progress}%
          </p>

        </div>

      </div>

      <div className="relative mt-10">

        <div className="absolute left-6 top-0 h-full w-1 rounded bg-slate-700" />

        <div className="space-y-8">

          {timeline.steps.map((step, index) => (

            <div
              key={step.label}
              className="relative flex items-start"
            >

              <div
                className={`z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 text-xl ${
                  step.done
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-slate-600 bg-slate-800 text-slate-300"
                }`}
              >
                {step.done ? "✓" : index + 1}
              </div>

              <div
                className={`ml-6 flex-1 rounded-2xl border p-5 transition-all duration-300 ${
                  step.done
                    ? "border-emerald-500/30 bg-emerald-500/10"
                    : "border-slate-700 bg-slate-800/60"
                }`}
              >

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <span className="text-3xl">
                      {step.icon}
                    </span>

                    <div>

                      <h3 className="text-lg font-bold text-white">
                        {step.label}
                      </h3>

                      <p className="text-sm text-slate-400">
                        {step.description}
                      </p>

                    </div>

                  </div>

                  <div>

                    {step.done ? (

                      <span className="rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-400">
                        Terminé
                      </span>

                    ) : (

                      <span className="rounded-full bg-orange-500/20 px-4 py-2 text-sm font-semibold text-orange-300">
                        En attente
                      </span>

                    )}

                  </div>

                </div>

                {step.done && (

                  <div className="mt-4 rounded-xl bg-slate-900/60 p-4">

                    <p className="text-sm text-slate-400">
                      ⏱ Heure estimée
                    </p>

                    <p className="mt-1 font-semibold text-cyan-300">
                      09:3{index}
                    </p>

                  </div>

                )}

              </div>

            </div>

          ))}

        </div>

      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">

        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-5">

          <h3 className="font-bold text-cyan-300">
            🚛 Camion
          </h3>

          <p className="mt-2 text-slate-300">
            {reception.carrier}
          </p>

        </div>

        <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 p-5">

          <h3 className="font-bold text-violet-300">
            📍 Quai
          </h3>

          <p className="mt-2 text-slate-300">
            {reception.dock}
          </p>

        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-5">

          <h3 className="font-bold text-emerald-300">
            📦 Palettes
          </h3>

          <p className="mt-2 text-slate-300">
            {reception.pallets}
          </p>

        </div>

      </div>

    </div>
  );
}