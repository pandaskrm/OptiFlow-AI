export default function PreparationAnalyticsAi() {
  return (
    <section className="rounded-3xl border border-[#006bff]/35 bg-gradient-to-br from-[#071426] via-[#06101f] to-[#020617] p-6 text-white shadow-[0_0_24px_rgba(0,107,255,0.10)]">
      <h2 className="text-xl font-bold">📊 Analyse statistiques IA</h2>

      <p className="mt-4 text-sm text-slate-300">
        La semaine actuelle progresse par rapport à la semaine précédente.
        Le jeudi est le jour le plus chargé avec 501 commandes préparées.
      </p>

      <div className="mt-5 rounded-2xl border border-[#006bff]/25 bg-[#071426]/90 p-4">
        <p className="font-semibold text-[#00e5ff]">Recommandation manager</p>
        <p className="mt-2 text-sm text-slate-300">
          Prévoir un renfort entre 8h et 11h les mardis et jeudis pour maintenir
          le taux de service au-dessus de 98 %.
        </p>
      </div>
    </section>
  );
}