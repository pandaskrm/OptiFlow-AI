export default function Features() {
  return (
    <section className="py-24 px-8 bg-slate-900">
      <h2 className="text-4xl font-bold text-center mb-12">
        Pourquoi choisir OptiFlow AI ?
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-slate-800 p-8 rounded-2xl">
          <h3 className="text-2xl font-semibold mb-4">⚡ Gain de temps</h3>
          <p className="text-gray-400">
            Automatisez les tâches répétitives et concentrez-vous sur l'essentiel.
          </p>
        </div>

        <div className="bg-slate-800 p-8 rounded-2xl">
          <h3 className="text-2xl font-semibold mb-4">📊 Analyse intelligente</h3>
          <p className="text-gray-400">
            L'IA analyse vos données et vous aide à prendre de meilleures décisions.
          </p>
        </div>

        <div className="bg-slate-800 p-8 rounded-2xl">
          <h3 className="text-2xl font-semibold mb-4">🚀 Productivité</h3>
          <p className="text-gray-400">
            Centralisez vos outils et améliorez les performances de votre entreprise.
          </p>
        </div>
      </div>
    </section>
  );
}