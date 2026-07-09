import { executiveStats } from "@/lib/executive/executiveData";

export default function ExecutiveStats() {
  const cards = [
    { label: "Santé entrepôt", value: `${executiveStats.warehouseHealth}/100` },
    { label: "Taux de service", value: `${executiveStats.serviceRate}%` },
    { label: "Productivité", value: `${executiveStats.productivity}%` },
    { label: "Alertes", value: executiveStats.alerts },
    { label: "Réceptions", value: executiveStats.receptions },
    { label: "Préparations", value: executiveStats.preparations },
    { label: "Expéditions", value: executiveStats.shipments },
    { label: "Retards", value: executiveStats.delayedOrders },
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