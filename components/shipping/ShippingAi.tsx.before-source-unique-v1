import { getShippingAiInsight } from "@/lib/shipping/shippingEngine";

export default function ShippingAi() {
  const insight = getShippingAiInsight();

  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-6 text-white shadow-xl">
      <h2 className="text-xl font-bold">🤖 {insight.title}</h2>

      <p className="mt-4 text-sm text-slate-300">{insight.message}</p>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="font-semibold text-cyan-300">Recommandation</p>
        <p className="mt-2 text-sm text-slate-300">{insight.recommendation}</p>
      </div>
    </section>
  );
}