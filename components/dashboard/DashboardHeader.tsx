export default function DashboardHeader() {
  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm font-medium text-cyan-400">
          Centre de commandement logistique
        </p>

        <h1 className="mt-2 text-3xl font-bold text-white">
          Tableau de bord
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Suivez vos réceptions, vos quais, vos alertes et les recommandations IA
          en temps réel.
        </p>
      </div>

      <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-4 text-right">
        <p className="text-xs text-slate-400">Priorité actuelle</p>
        <p className="mt-1 text-lg font-semibold text-cyan-300">
          Fluidifier les quais
        </p>
      </div>
    </div>
  );
}