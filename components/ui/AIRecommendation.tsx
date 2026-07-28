type AIRecommendationProps = {
  title: string;
  message: string;
  gain: string;
};

export default function AIRecommendation({
  title,
  message,
  gain,
}: AIRecommendationProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-blue-800/80 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 shadow-xl">
      <div className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-700 bg-blue-500/10 text-sm font-black text-blue-300">
            IA
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400">
              Copilote OptiFlow
            </p>

            <h2 className="mt-1 text-xl font-bold text-white">
              {title}
            </h2>

            <p className="mt-3 max-w-3xl leading-7 text-slate-300">
              {message}
            </p>
          </div>
        </div>

        <div className="min-w-[220px] rounded-2xl border border-blue-700/70 bg-blue-500/10 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-300">
            Statut de l'analyse
          </p>

          <p className="mt-2 text-2xl font-black text-emerald-400">
            {gain}
          </p>
        </div>
      </div>
    </section>
  );
}
