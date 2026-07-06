export default function DashboardActivity() {
  const activities = [
    "Réception TEST 1 mise à quai",
    "Contrôle qualité terminé",
    "Nouvelle réception transporteur Chrono",
    "Quai 4 libéré",
  ];

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-5 shadow-lg">
      <h2 className="text-lg font-bold text-white">Activité récente</h2>

      <div className="mt-4 space-y-3">
        {activities.map((activity) => (
          <div
            key={activity}
            className="rounded-xl bg-slate-800/70 p-3 text-sm text-slate-300"
          >
            ✅ {activity}
          </div>
        ))}
      </div>
    </div>
  );
}