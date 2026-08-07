"use client";

import useWarehouseSummary from "../../hooks/useWarehouseSummary";
import { getPreparationAiInsight } from "@/lib/preparation/preparationEngine";

type PreparationAiProps = {
  orders?: {
    total: number;
    waiting: number;
    inPreparation: number;
    completed: number;
    priority: number;
    totalLines: number;
    preparedLines: number;
    progress: number;
    serviceRate: number;
  };
  workforce?: {
    present: number;
    paused: number;
    reinforcement: number;
    productivity: number;
  };
};

export default function PreparationAi({
  orders,
  workforce,
}: PreparationAiProps = {}) {
  const { data: warehouse } = useWarehouseSummary();

  const operationalOrders = orders ?? warehouse.orders;
  const operationalWorkforce = workforce ?? warehouse.workforce;

  const hasOperationalData =
    operationalOrders.total > 0 ||
    operationalOrders.totalLines > 0 ||
    operationalWorkforce.present > 0;

  const insight = hasOperationalData
    ? getPreparationAiInsight({
        orders: operationalOrders,
        workforce: operationalWorkforce,
      })
    : getPreparationAiInsight();

  return (
    <section className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-6 text-white shadow-xl">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 text-xl">
          🤖
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
            Copilote IA
          </p>
          <h2 className="text-xl font-bold">{insight.title}</h2>
        </div>
      </div>

      <p className="text-slate-300">{insight.message}</p>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm font-semibold text-cyan-300">
          Recommandation
        </p>
        <p className="mt-2 text-slate-200">{insight.recommendation}</p>
      </div>
    </section>
  );
}
