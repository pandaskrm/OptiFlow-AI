export default function AiCockpit() {
  return (
    <div className="rounded-2xl border border-blue-900 bg-slate-900 p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-400">
            🤖 Copilote IA
          </p>

          <h2 className="mt-1 text-2xl font-bold text-white">
            Priorités du jour
          </h2>
        </div>

        <div className="rounded-full bg-emerald-500/20 px-4 py-2 text-emerald-400 font-bold">
          Santé 91%
        </div>
      </div>

      <div className="mt-6 space-y-4">

        <div className="rounded-xl bg-slate-800 p-4">
          <h3 className="font-semibold text-orange-400">
            🚛 Priorité n°1
          </h3>

          <p className="mt-2 text-slate-300">
            Décharger le camion DHL avant 14h.
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-4">
          <h3 className="font-semibold text-red-400">
            ⚠️ Risque détecté
          </h3>

          <p className="mt-2 text-slate-300">
            Le quai 2 pourrait être saturé dans moins d'une heure.
          </p>
        </div>

        <div className="rounded-xl bg-slate-800 p-4">
          <h3 className="font-semibold text-green-400">
            💡 Recommandation IA
          </h3>

          <p className="mt-2 text-slate-300">
            Déplacer un collaborateur du quai 5 vers le quai 2 pendant 45 minutes.
          </p>
        </div>

      </div>
    </div>
  );
}