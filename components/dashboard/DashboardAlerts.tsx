export default function DashboardAlerts() {
  const alerts = [
    "Quai 2 occupé depuis plus de 45 minutes",
    "Transporteur DHL attendu dans 20 minutes",
    "Contrôle qualité en attente sur 2 réceptions",
  ];

  return (
    <div className="rounded-2xl border border-orange-500/20 bg-slate-900/80 p-5 shadow-lg">
      <h2 className="text-lg font-bold text-white">Alertes opérationnelles</h2>

      <div className="mt-4 space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert}
            className="rounded-xl border border-orange-500/20 bg-orange-500/10 p-3 text-sm text-orange-200"
          >
            ⚠️ {alert}
          </div>
        ))}
      </div>
    </div>
  );
}