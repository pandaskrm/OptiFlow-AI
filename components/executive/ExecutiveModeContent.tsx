"use client";

import useDemo from "../../hooks/useDemo";

import ExecutiveHero from "./ExecutiveHero";
import ExecutiveStats from "./ExecutiveStats";
import ExecutiveHealthScore from "./ExecutiveHealthScore";
import ExecutiveOperations from "./ExecutiveOperations";
import ExecutiveAi from "./ExecutiveAi";
import ExecutiveDecisions from "./ExecutiveDecisions";

const zeroCards = [
  { label: "Santé entrepôt", value: "0/100" },
  { label: "Taux de service", value: "0%" },
  { label: "Productivité", value: "0%" },
  { label: "Alertes", value: "0" },
  { label: "Réceptions", value: "0" },
  { label: "Préparations", value: "0" },
  { label: "Expéditions", value: "0" },
  { label: "Retards", value: "0" },
];

function ExecutiveZeroState() {
  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-3xl border border-white/10 bg-slate-950 p-8 text-white shadow-2xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
          Vue Direction
        </p>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight lg:text-5xl">
              Santé globale de l&apos;exploitation
            </h1>

            <p className="mt-4 max-w-2xl text-slate-300">
              Connectez votre ERP ou lancez le mode Démo pour afficher la
              réception, la préparation, l&apos;expédition, les équipes et les
              priorités IA.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-600 bg-slate-800 px-5 py-4">
            <p className="text-sm text-slate-400">
              Statut global
            </p>

            <p className="text-2xl font-bold text-slate-300">
              En attente de données
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {zeroCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">
              {card.label}
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              {card.value}
            </p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
            Score global
          </p>

          <div className="mt-6 flex items-center justify-center">
            <div className="flex h-52 w-52 items-center justify-center rounded-full border-[18px] border-slate-100">
              <div className="text-center">
                <p className="text-5xl font-bold text-slate-950">
                  0
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  sur 100
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {[
              "Productivité",
              "Service",
              "Qualité",
              "Ponctualité",
            ].map((label) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-xl bg-slate-50 p-3"
              >
                <span className="text-sm text-slate-600">
                  {label}
                </span>

                <span className="font-bold text-slate-950">
                  0
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-950">
              Performance opérationnelle
            </h2>

            <p className="text-sm text-slate-500">
              Aucune activité disponible.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              "Réception",
              "Préparation",
              "Expédition",
            ].map((label) => (
              <div
                key={label}
                className="rounded-2xl bg-slate-50 p-5"
              >
                <p className="text-sm text-slate-500">
                  {label}
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-950">
                  0%
                </p>

                <div className="mt-4 h-3 rounded-full bg-slate-200">
                  <div
                    className="h-3 rounded-full bg-cyan-500"
                    style={{ width: "0%" }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
            Aucun indicateur opérationnel disponible.
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-6 text-white shadow-xl">
          <h2 className="text-xl font-bold">
            IA Direction
          </h2>

          <p className="mt-4 text-sm text-slate-300">
            Aucune analyse exécutive disponible sans ERP ou mode Démo.
          </p>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="font-semibold text-cyan-300">
              Synthèse exécutive
            </p>

            <p className="mt-2 text-sm text-slate-300">
              Connectez une source de données pour obtenir une synthèse des
              opérations et des risques.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-6 text-white shadow-xl">
          <h2 className="text-xl font-bold">
            Décisions prioritaires
          </h2>

          <p className="mt-4 text-sm text-slate-300">
            Aucune décision disponible.
          </p>

          <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-slate-400">
            Lancez le mode Démo pour découvrir les recommandations de la
            Direction.
          </div>
        </section>
      </div>
    </div>
  );
}

export default function ExecutiveModeContent() {
  const demo = useDemo();

  if (!demo.running) {
    return <ExecutiveZeroState />;
  }

  return (
    <div className="flex flex-col gap-6">
      <ExecutiveHero />
      <ExecutiveStats />

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <ExecutiveHealthScore />
        <ExecutiveOperations />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ExecutiveAi />
        <ExecutiveDecisions />
      </div>
    </div>
  );
}