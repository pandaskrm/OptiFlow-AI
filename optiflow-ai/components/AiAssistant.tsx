export default function AiAssistant() {
  return (
    <section className="px-8 py-16 bg-slate-900">
      <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">

        <div className="flex items-center gap-3 mb-6">
          <div className="text-4xl">🤖</div>

          <div>
            <h2 className="text-3xl font-bold">
              Assistant IA
            </h2>

            <p className="text-gray-400">
              Vos recommandations du jour
            </p>
          </div>
        </div>

        <div className="space-y-4">

          <div className="bg-slate-900 rounded-xl p-5">
            ✅ 3 commandes prioritaires à traiter aujourd'hui.
          </div>

          <div className="bg-slate-900 rounded-xl p-5">
            📈 Votre productivité est en hausse de 5 % par rapport à hier.
          </div>

          <div className="bg-slate-900 rounded-xl p-5">
            💰 Une optimisation pourrait économiser environ 1 250 € ce mois-ci.
          </div>

        </div>

      </div>
    </section>
  );
}