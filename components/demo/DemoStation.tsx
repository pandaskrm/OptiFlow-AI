"use client";

import { useEffect, useMemo, useState } from "react";
import {
  demoStationSteps,
  type DemoStationStep,
} from "../../lib/demo/demoStationData";

const accentClasses = {
  cyan: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
  violet: "border-violet-500/40 bg-violet-500/10 text-violet-300",
  emerald: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  amber: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  rose: "border-rose-500/40 bg-rose-500/10 text-rose-300",
};

export default function DemoStation() {
  const [open, setOpen] = useState(true);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);

  const step: DemoStationStep = demoStationSteps[index];

  const progress = useMemo(
    () => Math.round(((index + 1) / demoStationSteps.length) * 100),
    [index]
  );

  const finished = index === demoStationSteps.length - 1;

  useEffect(() => {
    if (!started || !playing || finished) return;

    const timer = window.setTimeout(() => {
      setIndex((current) =>
        Math.min(current + 1, demoStationSteps.length - 1)
      );
    }, 5500);

    return () => window.clearTimeout(timer);
  }, [started, playing, index, finished]);

  useEffect(() => {
    if (finished) {
      setPlaying(false);
    }
  }, [finished]);

  function startDemo() {
    setIndex(0);
    setStarted(true);
    setPlaying(true);
  }

  function replay() {
    setIndex(0);
    setStarted(true);
    setPlaying(true);
  }

  function next() {
    setIndex((current) =>
      Math.min(current + 1, demoStationSteps.length - 1)
    );
  }

  function previous() {
    setIndex((current) => Math.max(current - 1, 0));
  }

  if (!open) {
    return (
      <section className="rounded-2xl border border-violet-500/30 bg-slate-950/70 p-5 shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">
              Demo Station
            </p>
            <h2 className="mt-1 text-xl font-bold text-white">
              Démonstration guidée OptiFlow AI
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Revivez une journée complète et découvrez chaque module.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-500"
          >
            🎬 Ouvrir la Demo Station
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-violet-500/30 bg-[#07111f] shadow-2xl shadow-violet-950/40">
        {!started ? (
          <div className="p-8 md:p-12">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-5 top-5 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-400 hover:text-white"
            >
              Fermer
            </button>

            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/10 text-3xl">
                🚀
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.28em] text-violet-300">
                OptiFlow AI
              </p>

              <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
                Une journée complète.
                <span className="block text-violet-300">
                  Un entrepôt piloté intelligemment.
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300">
                Suivez une journée accélérée de 08h00 à 17h30.
                OptiFlow AI vous présente progressivement ses modules,
                ses automatismes et les interventions de Libot.
              </p>

              <div className="mt-8 grid gap-3 text-left sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["👥", "Équipe"],
                  ["📧", "Mail Intelligence"],
                  ["📥", "Réception"],
                  ["📦", "Stock"],
                  ["📋", "Préparation"],
                  ["🚚", "Expédition"],
                  ["🤖", "Libot IA"],
                  ["📊", "Direction"],
                ].map(([icon, label]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-sm font-semibold text-slate-200"
                  >
                    <span className="mr-2">{icon}</span>
                    {label}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={startDemo}
                className="mt-9 rounded-2xl bg-violet-600 px-8 py-4 text-base font-black text-white shadow-lg shadow-violet-950/40 transition hover:bg-violet-500"
              >
                ▶ Lancer la démonstration
              </button>

              <p className="mt-4 text-xs text-slate-500">
                Première version du parcours guidé Premium — narration accélérée.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="border-b border-slate-800 bg-slate-950/70 px-6 py-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">
                    Demo Station • Journée accélérée
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Étape {index + 1} / {demoStationSteps.length}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPlaying((value) => !value)}
                    disabled={finished}
                    className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800 disabled:opacity-40"
                  >
                    {playing ? "⏸ Pause" : "▶ Reprendre"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-400 hover:text-white"
                  >
                    Quitter
                  </button>
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-violet-500 transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="grid min-h-[520px] lg:grid-cols-[1fr_340px]">
              <main className="flex flex-col justify-between p-7 md:p-10">
                <div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-3xl">
                      {step.icon}
                    </div>

                    <div>
                      <p className="text-sm font-bold text-violet-300">
                        {step.time}
                      </p>
                      <h2 className="mt-1 text-2xl font-black text-white md:text-3xl">
                        {step.title}
                      </h2>
                    </div>
                  </div>

                  <div
                    className={`mt-8 rounded-2xl border p-5 ${accentClasses[step.accent]}`}
                  >
                    <p className="text-xs font-black uppercase tracking-[0.2em]">
                      À quoi sert cette étape ?
                    </p>
                    <p className="mt-3 text-base leading-7 text-slate-100">
                      {step.explanation}
                    </p>
                  </div>

                  <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-xl">
                        🤖
                      </div>

                      <div>
                        <p className="font-black text-cyan-300">Libot</p>
                        <p className="mt-2 leading-7 text-slate-200">
                          {step.libot}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={previous}
                    disabled={index === 0}
                    className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-bold text-slate-300 hover:bg-slate-800 disabled:opacity-30"
                  >
                    ← Étape précédente
                  </button>

                  {finished ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={replay}
                        className="rounded-xl border border-violet-500/40 px-4 py-3 text-sm font-bold text-violet-300 hover:bg-violet-500/10"
                      >
                        ↻ Revoir
                      </button>

                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-black text-white hover:bg-emerald-500"
                      >
                        Explorer OptiFlow →
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={next}
                      className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-black text-white hover:bg-violet-500"
                    >
                      Étape suivante →
                    </button>
                  )}
                </div>
              </main>

              <aside className="border-t border-slate-800 bg-slate-950/50 p-6 lg:border-l lg:border-t-0">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                  Timeline
                </p>

                <div className="mt-5 max-h-[450px] space-y-2 overflow-y-auto pr-2">
                  {demoStationSteps.map((item, itemIndex) => {
                    const active = itemIndex === index;
                    const done = itemIndex < index;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setIndex(itemIndex)}
                        className={`w-full rounded-xl border p-3 text-left transition ${
                          active
                            ? "border-violet-500/50 bg-violet-500/10"
                            : "border-slate-800 bg-slate-900/50 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5">
                            {done ? "✓" : item.icon}
                          </span>

                          <div>
                            <p
                              className={`text-xs font-bold ${
                                active ? "text-violet-300" : "text-slate-500"
                              }`}
                            >
                              {item.time}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-200">
                              {item.title}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </aside>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
