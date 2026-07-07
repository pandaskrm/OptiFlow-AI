export default function AiCockpit() {
  return (
    <div className="rounded-2xl border border-cyan-900 bg-gradient-to-br from-slate-900 to-slate-950 p-6 shadow-xl">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-cyan-400 font-semibold text-sm">
            🤖 Copilote IA OptiFlow
          </p>

          <h2 className="text-2xl font-bold text-white mt-1">
            Analyse temps réel
          </h2>

          <p className="text-slate-400 mt-1">
            Dernière analyse : il y a quelques secondes
          </p>
        </div>

        <div className="rounded-xl bg-emerald-500/20 border border-emerald-500/30 px-5 py-3 text-center">
          <p className="text-xs text-slate-300">
            Santé entrepôt
          </p>

          <p className="text-3xl font-bold text-emerald-400">
            91%
          </p>
        </div>

      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-slate-400 text-sm">
            🚚 Camions attendus
          </p>

          <p className="text-3xl font-bold text-white mt-2">
            3
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-slate-400 text-sm">
            📦 Palettes à traiter
          </p>

          <p className="text-3xl font-bold text-white mt-2">
            42
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-slate-400 text-sm">
            🚪 Quais disponibles
          </p>

          <p className="text-3xl font-bold text-emerald-400 mt-2">
            5
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-4">
          <p className="text-slate-400 text-sm">
            ⚠️ Alertes
          </p>

          <p className="text-3xl font-bold text-orange-400 mt-2">
            2
          </p>
        </div>

      </div>

      <div className="space-y-4 mt-8">

        <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-4">

          <h3 className="font-bold text-orange-400">
            🚛 Priorité immédiate
          </h3>

          <p className="text-slate-300 mt-2">
            Le camion DHL est attendu dans moins de 20 minutes.
            Préparez le quai 1 afin d'éviter un temps d'attente.
          </p>

        </div>

        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">

          <h3 className="font-bold text-red-400">
            ⚠️ Analyse des risques
          </h3>

          <p className="text-slate-300 mt-2">
            Si deux nouveaux transporteurs arrivent simultanément,
            le quai 2 risque une saturation temporaire.
          </p>

        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">

          <h3 className="font-bold text-emerald-400">
            💡 Recommandation IA
          </h3>

          <p className="text-slate-300 mt-2">
            Affecter un préparateur disponible au contrôle qualité
            permettra de réduire le temps moyen de réception de 12%.
          </p>

        </div>

      </div>

    </div>
  );
}