"use client";

import { useEffect, useMemo, useState } from "react";

import {
  demoStationSteps,
  type DemoStationStep,
} from "../../lib/demo/demoStationData";

import {
  demoStationSnapshots,
  type DemoStationSnapshot,
} from "../../lib/demo/demoStationMetrics";

const STEP_DURATION_MS = 30000;

const accentClasses = {
  cyan: "border-cyan-500/40 bg-cyan-500/10 text-cyan-300",
  violet: "border-violet-500/40 bg-violet-500/10 text-violet-300",
  emerald: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  amber: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  rose: "border-rose-500/40 bg-rose-500/10 text-rose-300",
};

function percent(value: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((value / total) * 100);
}

function MetricCard({
  icon,
  label,
  value,
  detail,
  danger = false,
}: {
  icon: string;
  label: string;
  value: string;
  detail: string;
  danger?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        danger
          ? "border-rose-500/30 bg-rose-500/10"
          : "border-slate-800 bg-slate-900/70"
      }`}
    >
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">
          {label}
        </p>
      </div>

      <p
        className={`mt-2 text-xl font-black ${
          danger ? "text-rose-300" : "text-white"
        }`}
      >
        {value}
      </p>

      <p className="mt-1 text-[11px] text-slate-500">{detail}</p>
    </div>
  );
}

function LiveMetrics({ snapshot }: { snapshot: DemoStationSnapshot }) {
  const preparationProgress = percent(
    snapshot.ordersCompleted,
    snapshot.ordersTotal
  );

  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-6">
      <MetricCard
        icon="📋"
        label="Commandes"
        value={`${snapshot.ordersCompleted}/${snapshot.ordersTotal}`}
        detail={`${snapshot.ordersInProgress} en cours`}
      />

      <MetricCard
        icon="📈"
        label="Avancement"
        value={`${preparationProgress}%`}
        detail={`${snapshot.priorityOrders} prioritaires`}
      />

      <MetricCard
        icon="⚡"
        label="Productivité"
        value={`${snapshot.productivity}%`}
        detail={`Objectif projeté ${snapshot.projectedService}%`}
        danger={snapshot.productivity < 90}
      />

      <MetricCard
        icon="📥"
        label="Réceptions"
        value={`${snapshot.receptionsFinished}`}
        detail={`${snapshot.receptionsActive} active`}
      />

      <MetricCard
        icon="🚚"
        label="Expéditions"
        value={`${snapshot.shipmentsFinished}`}
        detail={`${snapshot.shipmentsConfirmed} confirmées`}
      />

      <MetricCard
        icon="🏭"
        label="Santé dépôt"
        value={`${snapshot.warehouseHealth}%`}
        detail={`${snapshot.alerts} alerte(s)`}
        danger={snapshot.warehouseHealth < 92}
      />
    </div>
  );
}

function OperationalPulse({
  snapshot,
  actionApplied,
}: {
  snapshot: DemoStationSnapshot;
  actionApplied: boolean;
}) {
  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
        <p className="text-xs text-slate-500">👥 Effectif</p>
        <p className="mt-1 font-black text-white">
          {snapshot.staffPresent} présents
        </p>
        <p className="text-xs text-slate-500">
          {snapshot.pickersActive} préparateurs actifs
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
        <p className="text-xs text-slate-500">📧 Mail Intelligence</p>
        <p className="mt-1 font-black text-white">
          {snapshot.mailReceived} mail(s)
        </p>
        <p
          className={`text-xs ${
            snapshot.mailAwaitingReply > 0
              ? "text-amber-300"
              : "text-slate-500"
          }`}
        >
          {snapshot.mailAwaitingReply} réponse en attente
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
        <p className="text-xs text-slate-500">📦 Activité</p>
        <p className="mt-1 font-black text-white">
          {snapshot.preparedLines.toLocaleString("fr-FR")} lignes
        </p>
        <p className="text-xs text-slate-500">
          {snapshot.preparedUnits.toLocaleString("fr-FR")} unités •{" "}
          {snapshot.parcels.toLocaleString("fr-FR")} colis
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
        <p className="text-xs text-slate-500">🧠 Décision IA</p>
        <p className="mt-1 font-black text-white">
          {actionApplied ? "Action appliquée" : snapshot.status}
        </p>
        <p className="text-xs text-slate-500">
          {snapshot.stockMovements} mouvements stock
        </p>
      </div>
    </div>
  );
}

function EndOfDayReport({ snapshot }: { snapshot: DemoStationSnapshot }) {
  const leaderboard = [
    { name: "Préparateur A", lines: 633, productivity: 112 },
    { name: "Préparateur B", lines: 542, productivity: 107 },
    { name: "Préparateur C", lines: 498, productivity: 104 },
    { name: "Préparateur D", lines: 479, productivity: 101 },
  ];

  return (
    <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-300">
            Bilan opérationnel
          </p>
          <h3 className="mt-1 text-xl font-black text-white">
            La journée est sous contrôle
          </h3>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
          <p className="text-xs text-emerald-300">Objectif opérationnel</p>
          <p className="font-black text-white">
            {snapshot.projectedService}% atteint
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-slate-950/50 p-3">
          <p className="text-xs text-slate-500">Commandes terminées</p>
          <p className="mt-1 text-2xl font-black text-white">
            {snapshot.ordersCompleted}
          </p>
        </div>

        <div className="rounded-xl bg-slate-950/50 p-3">
          <p className="text-xs text-slate-500">Lignes préparées</p>
          <p className="mt-1 text-2xl font-black text-white">
            {snapshot.preparedLines.toLocaleString("fr-FR")}
          </p>
        </div>

        <div className="rounded-xl bg-slate-950/50 p-3">
          <p className="text-xs text-slate-500">Unités préparées</p>
          <p className="mt-1 text-2xl font-black text-white">
            {snapshot.preparedUnits.toLocaleString("fr-FR")}
          </p>
        </div>

        <div className="rounded-xl bg-slate-950/50 p-3">
          <p className="text-xs text-slate-500">Expéditions terminées</p>
          <p className="mt-1 text-2xl font-black text-white">
            {snapshot.shipmentsFinished}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
          Performance préparation
        </p>

        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {leaderboard.map((picker, index) => (
            <div
              key={picker.name}
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3"
            >
              <div>
                <p className="text-sm font-bold text-white">
                  #{index + 1} {picker.name}
                </p>
                <p className="text-xs text-slate-500">
                  {picker.lines} lignes préparées
                </p>
              </div>

              <span className="font-black text-emerald-300">
                {picker.productivity}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
        <p className="text-sm font-bold text-cyan-300">
          🤖 Synthèse Libot
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Le ralentissement détecté à mi-journée a été absorbé grâce au
          renforcement de la préparation et à la priorisation des commandes
          urgentes. Les flux critiques sont sécurisés et aucune alerte majeure
          ne reste ouverte.
        </p>
      </div>
    </div>
  );
}

export default function DemoStation() {
  const [open, setOpen] = useState(true);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [actionApplied, setActionApplied] = useState(false);

  const step: DemoStationStep = demoStationSteps[index];
  const snapshot = demoStationSnapshots[step.id];

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
    }, STEP_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [started, playing, index, finished]);

  useEffect(() => {
    if (finished) {
      setPlaying(false);
    }
  }, [finished]);

  function startDemo() {
    setIndex(0);
    setActionApplied(false);
    setStarted(true);
    setPlaying(true);
  }

  function replay() {
    setIndex(0);
    setActionApplied(false);
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

  function applyRecommendation() {
    setActionApplied(true);

    window.setTimeout(() => {
      setIndex(8);
      setPlaying(true);
    }, 800);
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-3 backdrop-blur-md">
      <div className="relative max-h-[96vh] w-full max-w-7xl overflow-hidden rounded-3xl border border-violet-500/30 bg-[#07111f] shadow-2xl shadow-violet-950/40">
        {!started ? (
          <div className="overflow-y-auto p-8 md:p-12">
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
                Suivez une journée accélérée de 08h00 à 17h30 en environ
                6 minutes. Les indicateurs évoluent pendant que Libot
                analyse, alerte et recommande les actions utiles.
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
                ▶ Lancer la journée
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="border-b border-slate-800 bg-slate-950/70 px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-300">
                    Demo Station • Journée accélérée
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    {step.time} • Étape {index + 1}/{demoStationSteps.length} •{" "}
                    {snapshot.status}
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

              <div className="mt-4">
                <LiveMetrics snapshot={snapshot} />
              </div>
            </div>

            <div className="grid max-h-[73vh] overflow-hidden lg:grid-cols-[1fr_330px]">
              <main className="overflow-y-auto p-6 md:p-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-2xl">
                    {step.icon}
                  </div>

                  <div>
                    <p className="text-sm font-bold text-violet-300">
                      {step.time}
                    </p>

                    <h2 className="mt-1 text-2xl font-black text-white">
                      {step.title}
                    </h2>
                  </div>
                </div>

                <div
                  className={`mt-5 rounded-2xl border p-4 ${accentClasses[step.accent]}`}
                >
                  <p className="text-xs font-black uppercase tracking-[0.2em]">
                    À quoi sert cette étape ?
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-100">
                    {step.explanation}
                  </p>
                </div>

                <div className="mt-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-xl">
                      🤖
                    </div>

                    <div>
                      <p className="font-black text-cyan-300">Libot</p>

                      <p className="mt-1 text-sm leading-6 text-slate-200">
                        {step.libot}
                      </p>

                      {step.id === 8 && !actionApplied ? (
                        <button
                          type="button"
                          onClick={applyRecommendation}
                          className="mt-4 rounded-xl bg-amber-500 px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-amber-400"
                        >
                          ⚡ Appliquer la recommandation
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>

                <OperationalPulse
                  snapshot={snapshot}
                  actionApplied={actionApplied}
                />

                {finished ? <EndOfDayReport snapshot={snapshot} /> : null}

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={previous}
                    disabled={index === 0}
                    className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-bold text-slate-300 hover:bg-slate-800 disabled:opacity-30"
                  >
                    ← Étape précédente
                  </button>

                  {finished ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={replay}
                        className="rounded-xl border border-violet-500/40 px-4 py-2 text-sm font-bold text-violet-300 hover:bg-violet-500/10"
                      >
                        ↻ Revoir
                      </button>

                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="rounded-xl bg-emerald-600 px-5 py-2 text-sm font-black text-white hover:bg-emerald-500"
                      >
                        Explorer OptiFlow →
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={next}
                      className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-black text-white hover:bg-violet-500"
                    >
                      Étape suivante →
                    </button>
                  )}
                </div>
              </main>

              <aside className="overflow-y-auto border-t border-slate-800 bg-slate-950/50 p-5 lg:border-l lg:border-t-0">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                  Timeline
                </p>

                <div className="mt-4 space-y-2">
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
                                active
                                  ? "text-violet-300"
                                  : "text-slate-500"
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
