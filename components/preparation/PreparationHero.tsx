export default function PreparationHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#006bff]/40 bg-gradient-to-br from-[#071426] via-[#06101f] to-[#020617] p-8 text-white shadow-[0_0_32px_rgba(0,107,255,0.14)]">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#00e5ff]">
        Module préparation
      </p>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight lg:text-5xl">
            Pilotage des commandes à préparer
          </h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            Suivez les commandes, les préparateurs, les priorités et les retards
            en temps réel avec l'assistance IA d'OptiFlow.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-4">
          <p className="text-sm text-emerald-300">Statut opérationnel</p>
          <p className="text-2xl font-bold text-emerald-200">Flux maîtrisé</p>
        </div>
      </div>
    </section>
  );
}