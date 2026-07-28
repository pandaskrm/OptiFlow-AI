"use client";

type LiveOperationsProps = {
  trucksWaiting: number;
  occupiedDocks: number;
  activeReceptions: number;
  completedToday: number;
};

export default function LiveOperations({
  trucksWaiting,
  occupiedDocks,
  activeReceptions,
  completedToday,
}: LiveOperationsProps) {
  const cards = [
    {
      icon: "🚛",
      label: "Camions en attente",
      value: trucksWaiting,
    },
    {
      icon: "🚪",
      label: "Quais occupés",
      value: `${occupiedDocks}/6`,
    },
    {
      icon: "📦",
      label: "Réceptions actives",
      value: activeReceptions,
    },
    {
      icon: "✅",
      label: "Terminées aujourd'hui",
      value: completedToday,
    },
  ];

  return (
    <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg"
        >
          <div className="text-3xl">{card.icon}</div>

          <p className="mt-3 text-sm text-slate-400">
            {card.label}
          </p>

          <p className="mt-1 text-3xl font-bold text-white">
            {card.value}
          </p>
        </div>
      ))}
    </section>
  );
}