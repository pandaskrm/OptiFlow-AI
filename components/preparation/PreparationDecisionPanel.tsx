"use client";

import { useState } from "react";

type Decision = {
  priority: "Haute" | "Moyenne" | "Basse";
  title: string;
  action: string;
  impact: string;
};

const decisions: Decision[] = [
  {
    priority: "Haute",
    title: "Renforcer immédiatement la préparation",
    action:
      "Affecter 2 collaborateurs en renfort pendant 60 minutes sur les commandes prioritaires.",
    impact: "Gain estimé : 31 minutes sur l'heure de fin.",
  },
  {
    priority: "Moyenne",
    title: "Prioriser les départs du jour",
    action:
      "Traiter en priorité toutes les commandes concernées par l'objectif avant 14 h.",
    impact: "Réduction du risque de commandes non expédiées aujourd'hui.",
  },
  {
    priority: "Basse",
    title: "Décaler les commandes non urgentes",
    action:
      "Reporter temporairement les commandes hors objectif afin de libérer de la capacité.",
    impact: "Meilleure fluidité pendant le pic de préparation.",
  },
];

function priorityStyle(priority: Decision["priority"]) {
  if (priority === "Haute") return "bg-red-500/15 text-red-300";
  if (priority === "Moyenne") return "bg-amber-500/15 text-amber-300";
  return "bg-emerald-500/15 text-emerald-300";
}

export default function PreparationDecisionPanel() {
  const [reinforcementApplied, setReinforcementApplied] = useState(false);
  const [ignored, setIgnored] = useState<string[]>([]);

  const eligibleOrders = 486;
  const completedOrders = reinforcementApplied ? 389 : 372;
  const remainingOrders = eligibleOrders - completedOrders;

  const projectedEnd = reinforcementApplied ? "13:47" : "14:18";
  const objectiveRate = Math.round(
    (completedOrders / eligibleOrders) * 100
  );

  const objectiveSafe = reinforcementApplied;

  return (
    <section className="rounded-3xl border border-[#006bff]/35 bg-gradient-to-br from-[#071426] via-[#06101f] to-[#020617] p-6 text-white shadow-[0_0_24px_rgba(0,107,255,0.10)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#00e5ff]">
            Libot · Pilotage préparation
          </p>

          <h2 className="mt-2 text-xl font-bold">
            Objectif départ avant 14 h
          </h2>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            objectiveSafe
              ? "bg-emerald-500/100/20 text-emerald-300"
              : "bg-red-500/100/20 text-red-300"
          }`}
        >
          {objectiveSafe ? "Objectif sécurisé" : "Risque détecté"}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Metric
          label="Commandes concernées"
          value={eligibleOrders.toString()}
        />

        <Metric
          label="Déjà préparées"
          value={completedOrders.toString()}
        />

        <Metric
          label="Restantes"
          value={remainingOrders.toString()}
        />

        <Metric
          label="Fin estimée"
          value={projectedEnd}
          alert={!objectiveSafe}
        />
      </div>

      <div className="mt-5 rounded-2xl border border-[#006bff]/25 bg-[#071426]/90 p-4">
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-semibold text-slate-300">
            Avancement objectif
          </span>

          <span className="text-xl font-black text-white">
            {objectiveRate}%
          </span>
        </div>

        <div className="mt-3 h-3 overflow-hidden rounded-full border border-[#006bff]/20 bg-[#020617]">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              objectiveSafe ? "bg-emerald-500/100" : "bg-orange-500"
            }`}
            style={{ width: `${objectiveRate}%` }}
          />
        </div>
      </div>

      <div
        className={`mt-5 rounded-2xl border p-4 ${
          objectiveSafe
            ? "border-emerald-500/30 bg-emerald-500/100/10"
            : "border-red-500/30 bg-red-500/100/10"
        }`}
      >
        <p
          className={`text-sm font-bold ${
            objectiveSafe ? "text-emerald-300" : "text-red-300"
          }`}
        >
          Analyse OrganIA
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-200">
          {objectiveSafe
            ? "Le renfort permet désormais de terminer les commandes prioritaires avant 14 h. L'objectif redevient atteignable."
            : "Au rythme actuel, les commandes prioritaires devraient être terminées vers 14 h 18. L'objectif est menacé. Je recommande de renforcer immédiatement la préparation."}
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {decisions.map((decision, index) => {
          const isIgnored = ignored.includes(decision.title);
          const isApplied =
            index === 0 && reinforcementApplied;

          return (
            <article
              key={decision.title}
              className={`rounded-2xl border p-4 transition ${
                isApplied
                  ? "border-emerald-500/30 bg-emerald-500/100/10"
                  : isIgnored
                    ? "border-[#006bff]/10 bg-[#071426]/40 opacity-50"
                    : "border-[#006bff]/25 bg-[#071426]/90"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-white">
                    {decision.title}
                  </h3>

                  <p className="mt-2 text-sm text-slate-300">
                    {decision.action}
                  </p>

                  <p className="mt-2 text-sm font-semibold text-[#00e5ff]">
                    {decision.impact}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${priorityStyle(
                    decision.priority
                  )}`}
                >
                  {decision.priority}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={isApplied}
                  onClick={() => {
                    if (index === 0) {
                      setReinforcementApplied(true);
                    }
                  }}
                  className="rounded-xl bg-gradient-to-r from-[#006bff] to-[#00a8ff] px-3 py-2 text-xs font-bold text-white shadow-[0_0_18px_rgba(0,140,255,0.25)] transition hover:brightness-110 disabled:cursor-default disabled:bg-emerald-600"
                >
                  {isApplied ? "Plan appliqué" : "Valider"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setIgnored((current) =>
                      current.includes(decision.title)
                        ? current
                        : [...current, decision.title]
                    )
                  }
                  className="rounded-xl border border-[#006bff]/30 bg-[#071426]/80 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-[#071426]/10"
                >
                  Ignorer
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <button
        type="button"
        className="mt-5 w-full rounded-xl border border-[#008cff]/45 bg-gradient-to-r from-[#006bff]/15 to-[#00e5ff]/5 px-4 py-3 text-sm font-bold text-[#7df4ff] transition hover:bg-cyan-400/20"
      >
        Voir les commandes à risque
      </button>
    </section>
  );
}

function Metric({
  label,
  value,
  alert = false,
}: {
  label: string;
  value: string;
  alert?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#006bff]/25 bg-[#071426]/90 p-4">
      <p className="text-xs font-medium text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 text-2xl font-black ${
          alert ? "text-red-300" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}