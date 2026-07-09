export default function PreparationAnalyticsAi() {
  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-6 text-white shadow-xl">
      <h2 className="text-xl font-bold">📊 Analyse statistiques IA</h2>

      <p className="mt-4 text-sm text-slate-300">
        La semaine actuelle progresse par rapport à la semaine précédente.
        Le jeudi est le jour le plus chargé avec 501 commandes préparées.
      </p>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="font-semibold text-cyan-300">Recommandation manager</p>
        <p className="mt-2 text-sm text-slate-300">
          Prévoir un renfort entre 8h et 11h les mardis et jeudis pour maintenir
          le taux de service au-dessus de 98 %.
        </p>
      </div>
    </section>
  );
}