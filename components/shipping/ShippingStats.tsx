"use client";

import useWarehouseSummary from "../../hooks/useWarehouseSummary";

export default function ShippingStats() {
  const { data: warehouse } = useWarehouseSummary();
  const shipments = warehouse.shipments;

  const cards = [
    { label: "Expéditions du jour", value: shipments.total },
    { label: "Expédiées", value: shipments.shipped },
    { label: "Prêtes", value: shipments.ready },
    { label: "En attente", value: shipments.waiting },
    { label: "Colis", value: shipments.totalPackages },
    { label: "Palettes", value: shipments.totalPallets },
    { label: "Avancement moyen", value: `${shipments.progress}%` },
    { label: "Taux de service", value: `${shipments.serviceRate}%` },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
  );
}
