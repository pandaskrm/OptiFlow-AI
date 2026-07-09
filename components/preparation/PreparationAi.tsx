import { getPreparationAiInsight } from "@/lib/preparation/preparationEngine";

export default function PreparationAi() {
  const insight = getPreparationAiInsight();

  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-6 text-white shadow-xl">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-2xl">
          🤖
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
            Copilote IA
          </p>
          <h2 className="text-xl font-bold">{insight.title}</h2>
        </div>
      </div>

      <p className="text-slate-300">{insight.message}</p>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm font-semibold text-cyan-300">Recommandation</p>
        <p className="mt-2 text-slate-200">{insight.recommendation}</p>
      </div>
    </section>
  );
}