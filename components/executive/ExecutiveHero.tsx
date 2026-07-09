export default function ExecutiveHero() {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-950 p-8 text-white shadow-2xl">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
        Vue Direction
      </p>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight lg:text-5xl">
            Santé globale de l'exploitation
          </h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            Une vision claire pour piloter la réception, la préparation,
            l'expédition, les équipes et les priorités IA.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-5 py-4">
          <p className="text-sm text-emerald-300">Statut global</p>
          <p className="text-2xl font-bold text-emerald-200">Sous contrôle</p>
        </div>
      </div>
    </section>
  );
}