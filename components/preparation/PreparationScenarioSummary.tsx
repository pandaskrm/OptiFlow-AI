"use client";

import useScenario from "../../hooks/useScenario";
import { getPreparationDemoData } from "../../lib/demo/preparationDemoData";

export default function PreparationScenarioSummary() {
  const { scenario, data } = useScenario();
  const preparation = getPreparationDemoData(scenario);

  const cards = [
    {
      label: "Commandes du jour",
      value: preparation.total,
    },
    {
      label: "Terminées",
      value: preparation.completed,
    },
    {
      label: "En préparation",
      value: preparation.inProgress,
    },
    {
      label: "Prioritaires",
      value: preparation.urgent,
    },
    {
      label: "Avancement moyen",
      value: `${preparation.averageProgress}%`,
    },
    {
      label: "Taux de service",
      value: `${preparation.serviceRate}%`,
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden rounded-3xl border border-[#006bff]/40 bg-gradient-to-br from-[#071426] via-[#06101f] to-[#020617] p-8 text-white shadow-[0_0_32px_rgba(0,107,255,0.14)]">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#00e5ff]">
          Module préparation
        </p>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight lg:text-5xl">
              Pilotage des commandes à préparer
            </h1>

            <p className="mt-4 max-w-2xl text-slate-300">
              Scénario actif : {data.label}. Les volumes et les priorités
              sont synchronisés avec le tableau de bord.
            </p>
          </div>

          <div className="rounded-2xl border border-[#008cff]/45 bg-gradient-to-r from-[#006bff]/15 to-[#00e5ff]/5 px-5 py-4">
            <p className="text-sm text-[#00e5ff]">
              Statut opérationnel
            </p>

            <p className="text-2xl font-bold text-[#bdf9ff]">
              {preparation.status}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-[#006bff]/30 bg-gradient-to-br from-[#071426] via-[#06101f] to-[#020617] p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-300">
              {card.label}
            </p>

            <p className="mt-2 text-3xl font-bold text-white">
              {card.value}
            </p>
          </div>
        ))}
      </section>
    </>
  );
}