"use client";

import useWarehouseSummary from "../../hooks/useWarehouseSummary";

export default function PreparationStats() {
  const { data: warehouse } = useWarehouseSummary();
  const orders = warehouse.orders;

  const cards = [
    { label: "Commandes du jour", value: orders.total },
    { label: "Terminées", value: orders.completed },
    { label: "En préparation", value: orders.inPreparation },
    { label: "Prioritaires", value: orders.priority },
    { label: "Avancement moyen", value: `${orders.progress}%` },
    { label: "Taux de service", value: `${orders.serviceRate}%` },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-[#006bff]/30 bg-gradient-to-br from-[#071426] via-[#06101f] to-[#020617] p-5 shadow-sm"
        >
          <p className="text-sm font-medium text-slate-300">{card.label}</p>
          <p className="mt-2 text-3xl font-bold text-white">{card.value}</p>
        </div>
      ))}
    </section>
  );
}
