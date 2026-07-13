"use client";

import useScenario from "../../hooks/useScenario";
import { getShippingDemoData } from "../../lib/demo/shippingDemoData";

export default function ShippingScenarioSummary() {
  const { scenario, data } = useScenario();
  const shipping = getShippingDemoData(scenario);

  const cards = [
    { label: "Expéditions du jour", value: shipping.total },
    { label: "Expédiées", value: shipping.shipped },
    { label: "Chargements", value: shipping.loading },
    { label: "Prioritaires", value: shipping.urgent },
    { label: "Colis", value: shipping.parcels },
    { label: "Palettes", value: shipping.pallets },
    {
      label: "Avancement moyen",
      value: `${shipping.averageProgress}%`,
    },
    {
      label: "Taux de service",
      value: `${shipping.serviceRate}%`,
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
              Scénario actif : {data.label}. Les volumes d’expédition sont
              synchronisés avec le tableau de bord.
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-4">
            <p className="text-sm text-cyan-300">
              Statut expédition
            </p>

            <p className="text-2xl font-bold text-cyan-100">
              {shipping.status}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
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
    </>
  );
}