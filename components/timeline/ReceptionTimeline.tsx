"use client";

import { generateReceptionTimeline } from "../../lib/timeline/timelineEngine";
import { Reception } from "../../types/reception";

type Props = {
  reception: Reception;
};

export default function ReceptionTimeline({ reception }: Props) {
  const timeline = generateReceptionTimeline(reception);

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">
          Timeline de la réception
        </h2>

        <div className="rounded-full bg-cyan-500/20 px-4 py-2 font-semibold text-cyan-300">
          {timeline.progress}% terminé
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {timeline.steps.map((step) => (
          <div
            key={step.label}
            className={`flex items-center rounded-xl border p-4 ${
              step.done
                ? "border-green-500/30 bg-green-500/10"
                : "border-slate-700 bg-slate-800/40"
            }`}
          >
            <div className="mr-4 text-3xl">{step.icon}</div>

            <div className="flex-1">
              <h3 className="font-semibold text-white">
                {step.label}
              </h3>

              <p className="text-sm text-slate-400">
                {step.description}
              </p>
            </div>

            <div className="text-2xl">
              {step.done ? "✅" : "⏳"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}