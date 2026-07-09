import { getShippingStats } from "@/lib/shipping/shippingEngine";

export default function ShippingStats() {
  const stats = getShippingStats();

  const cards = [
    { label: "Expéditions du jour", value: stats.total },
    { label: "Expédiées", value: stats.shipped },
    { label: "Chargements", value: stats.loading },
    { label: "Prioritaires", value: stats.urgent },
    { label: "Colis", value: stats.parcels },
    { label: "Palettes", value: stats.pallets },
    { label: "Avancement moyen", value: `${stats.averageProgress}%` },
    { label: "Taux de service", value: `${stats.serviceRate}%` },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm text-slate-500">{card.label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-950">{card.value}</p>
        </div>
      ))}
    </section>
  );
}