"use client";

import useSimulationV2 from "../../hooks/useSimulationV2";

const scenarioLabels = {
  normal: "Normal",
  peak: "Pic d'activité",
  black_friday: "Black Friday",
  transport_issue: "Incident transport",
  quality_alert: "Alerte qualité",
} as const;

export default function ShippingScenarioSummary() {
  const simulation = useSimulationV2();
  const shipping = simulation.state.shipping;
  const kpis = simulation.state.kpis;

  const total =
    shipping.completedShipments +
    shipping.loadingShipments +
    shipping.waitingShipments;

  const status =
    shipping.delayedShipments > 0
      ? "Transport perturbé"
      : shipping.waitingShipments > 10
        ? "Charge élevée"
        : "Flux maîtrisé";

  const cards = [
    {
      label: "Expéditions du jour",
      value: total,
    },
    {
      label: "Expédiées",
      value: shipping.completedShipments,
    },
    {
      label: "Chargements",
      value: shipping.loadingShipments,
    },
    {
      label: "En attente",
      value: shipping.waitingShipments,
    },
    {
      label: "En retard",
      value: shipping.delayedShipments,
    },
    {
      label: "Taux de service",
      value: `${kpis.serviceRate}%`,
    },
  ];

  return (
    <>
      <section className="rounded-3xl border border-white/10 bg-slate-950 p-8 text-white shadow-2xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
          Module expédition
        </p>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight lg:text-5xl">
              Pilotage des expéditions
            </h1>

            <p className="mt-4 max-w-2xl text-slate-300">
              Scénario actif : {scenarioLabels[simulation.scenario]}.
              Les volumes sont synchronisés avec le moteur de simulation V2.
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-4">
            <p className="text-sm text-cyan-300">
              Statut expédition
            </p>

            <p className="text-2xl font-bold text-cyan-100">
              {status}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-700">
              {card.label}
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              {card.value}
            </p>
          </div>
        ))}
      </section>
    </>
  );
}