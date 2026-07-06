import { generateWarehouseAnalysis } from "@/lib/warehouse/warehouseAnalysis";

export default function WarehouseAiAnalysis() {
  const analysis = generateWarehouseAnalysis();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-sm font-semibold text-blue-600">Analyse IA</p>
        <h2 className="text-2xl font-bold text-slate-900">
          Santé de l'entrepôt : {analysis.healthScore} %
        </h2>
        <p className="text-sm text-slate-500">Statut : {analysis.status}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-red-50 p-4">
          <h3 className="mb-2 font-semibold text-red-700">Alertes</h3>
          <ul className="space-y-1 text-sm text-red-700">
            {analysis.alerts.map((alert) => (
              <li key={alert}>⚠️ {alert}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl bg-emerald-50 p-4">
          <h3 className="mb-2 font-semibold text-emerald-700">Priorités</h3>
          <ul className="space-y-1 text-sm text-emerald-700">
            {analysis.priorities.map((priority) => (
              <li key={priority}>✅ {priority}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 p-4">
        <h3 className="mb-1 font-semibold text-slate-800">Conseil IA</h3>
        <p className="text-sm text-slate-600">{analysis.aiAdvice}</p>
      </div>

      <p className="mt-4 text-sm font-medium text-slate-700">
        Productivité : {analysis.productivity}
      </p>
    </section>
  );
}