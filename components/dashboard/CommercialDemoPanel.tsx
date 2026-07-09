"use client";

const steps = [
  {
    title: "🚛 Arrivée des camions",
    description:
      "Les camions arrivent automatiquement aux quais selon le scénario choisi.",
    gain: "Temps gagné : 15 min",
  },
  {
    title: "📦 Réceptions intelligentes",
    description:
      "L'IA priorise les déchargements et détecte les anomalies potentielles.",
    gain: "Erreurs réduites",
  },
  {
    title: "🤖 Décision IA",
    description:
      "Le système recommande automatiquement les meilleures actions à effectuer.",
    gain: "Décision en quelques secondes",
  },
  {
    title: "📈 Résultat",
    description:
      "Le responsable visualise immédiatement l'impact sur la performance de l'entrepôt.",
    gain: "+12 % de productivité (simulation)",
  },
];

export default function CommercialDemoPanel() {
  return (
    <section className="rounded-2xl border border-violet-900 bg-gradient-to-r from-[#0a1422] to-[#13263f] p-6 shadow-xl">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-violet-400">
          Mode Démonstration
        </p>

        <h2 className="mt-2 text-3xl font-bold text-white">
          Démonstration commerciale
        </h2>

        <p className="mt-2 text-slate-400">
          Présentez OptiFlow AI en quelques minutes avec un scénario réaliste.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {steps.map((step, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-700 bg-slate-900/70 p-5 transition hover:border-violet-500"
          >
            <h3 className="text-lg font-bold text-white">
              {step.title}
            </h3>

            <p className="mt-2 text-sm text-slate-300">
              {step.description}
            </p>

            <p className="mt-4 text-sm font-semibold text-emerald-400">
              {step.gain}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4">
        <p className="text-center text-cyan-300 font-semibold">
          🎬 Ce scénario est conçu pour montrer la valeur d'OptiFlow AI à un prospect ou à une direction en moins de 5 minutes.
        </p>
      </div>
    </section>
  );
}