export default function DashboardCharts() {
  const days = [
    { day: "Lun", value: 80 },
    { day: "Mar", value: 65 },
    { day: "Mer", value: 90 },
    { day: "Jeu", value: 55 },
    { day: "Ven", value: 75 },
  ];

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5 shadow-lg">
      <h2 className="text-lg font-bold text-white">Réceptions de la semaine</h2>

      <div className="mt-6 flex h-48 items-end gap-4">
        {days.map((item) => (
          <div key={item.day} className="flex flex-1 flex-col items-center gap-2">
            <div
              className="w-full rounded-t-xl bg-cyan-500/70"
              style={{ height: `${item.value}%` }}
            />
            <span className="text-xs text-slate-400">{item.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}