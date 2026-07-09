import { getPreparationStats } from "@/lib/preparation/preparationEngine";

export default function PreparationStats() {
  const stats = getPreparationStats();

  const cards = [
    { label: "Commandes du jour", value: stats.total },
    { label: "Terminées", value: stats.completed },
    { label: "En préparation", value: stats.inProgress },
    { label: "Prioritaires", value: stats.urgent },
    { label: "Avancement moyen", value: `${stats.averageProgress}%` },
    { label: "Taux de service", value: `${stats.serviceRate}%` },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
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