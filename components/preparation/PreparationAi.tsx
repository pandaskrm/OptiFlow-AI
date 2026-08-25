"use client";

import useWarehouseSummary from "../../hooks/useWarehouseSummary";
import { getPreparationAiInsight, type PreparationPrediction } from "@/lib/preparation/preparationEngine";

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
    : null;

  const prediction: PreparationPrediction | null =
    insight && "riskLevel" in insight
      ? (insight as PreparationPrediction)
      : null;

  const riskLabel =
    prediction?.riskLevel === "HIGH"
      ? "Risque Ã©levÃ©"
      : prediction?.riskLevel === "MEDIUM"
        ? "Sous surveillance"
        : prediction?.riskLevel === "LOW"
          ? "Objectif maÃ®trisÃ©"
          : "Mode dÃ©mo";

  const riskClass =
    prediction?.riskLevel === "HIGH"
      ? "border-red-500/30 bg-red-500/100/10 text-red-300"
      : prediction?.riskLevel === "MEDIUM"
        ? "border-amber-500/30 bg-amber-500/100/10 text-amber-300"
        : "border-emerald-500/30 bg-emerald-500/100/10 text-emerald-300";

  return (
    <section className="organia-electric-panel organia-electric-panel-v2 group relative overflow-hidden rounded-3xl border border-[#008cff]/55 bg-gradient-to-br from-[#071426] via-[#06101f] to-[#020617] p-6 text-white shadow-[0_0_28px_rgba(0,107,255,0.18),inset_0_0_28px_rgba(0,140,255,0.05)] transition duration-300 hover:border-[#00e5ff]/75 hover:shadow-[0_0_38px_rgba(0,140,255,0.28)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.35)]">
            OrganIA Intelligence
          </p>

          <h2 className="mt-1 text-xl font-bold">
            {insight.title}
          </h2>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-bold ${riskClass}`}
        >
          {riskLabel}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-200">
        {insight.message}
      </p>

      {prediction && (
        <>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Metric
              label="Fin estimÃ©e"
              value={prediction.projectedEnd}
              alert={prediction.riskLevel === "HIGH"}
            />

            <Metric
              label="Retard prÃ©vu"
              value={`${prediction.delayMinutes} min`}
              alert={prediction.delayMinutes > 0}
            />

            <Metric
              label="CapacitÃ© actuelle"
              value={`${prediction.currentHourlyCapacity} lignes/h`}
            />

            <Metric
              label="CapacitÃ© nÃ©cessaire"
              value={`${prediction.requiredHourlyCapacity} lignes/h`}
              alert={
                prediction.requiredHourlyCapacity >
                prediction.currentHourlyCapacity
              }
            />

            <Metric
              label="ProbabilitÃ© objectif 14 h"
              value={`${prediction.onTimeProbability}%`}
              alert={prediction.onTimeProbability < 70}
            />

            <Metric
              label="Confiance IA"
              value={`${prediction.confidenceScore}%`}
            />
          </div>

          <div className="mt-4 rounded-2xl border border-[#006bff]/25 bg-[#006bff]/5 p-4 shadow-[inset_0_0_20px_rgba(0,107,255,0.04)]">
            <DataRow
              label="Lignes restantes"
              value={prediction.remainingLines.toLocaleString("fr-FR")}
            />

            <DataRow
              label="Effectif actif"
              value={prediction.activeEmployees.toString()}
            />

            <DataRow
              label="Renfort conseillÃ©"
              value={
                prediction.reinforcementNeeded > 0
                  ? `+${prediction.reinforcementNeeded}`
                  : "Aucun"
              }
              alert={prediction.reinforcementNeeded > 0}
            />
          </div>
        </>
      )}

      <div className="mt-5 rounded-2xl border border-[#008cff]/45 bg-gradient-to-r from-[#006bff]/15 to-[#00e5ff]/5 p-4 shadow-[0_0_24px_rgba(0,140,255,0.12)]">
        <p className="text-sm font-black text-[#00e5ff]">
          Recommandation OrganIA
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-200">
          {insight.recommendation}
        </p>
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  alert = false,
}: {
  label: string;
  value: string;
  alert?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#006bff]/25 bg-[#071426]/90 p-4 shadow-[0_0_16px_rgba(0,107,255,0.06)] transition hover:border-[#008cff]/55">
      <p className="text-xs font-medium text-slate-400">
        {label}
      </p>

      <p
        className={`mt-1 text-xl font-black ${
          alert ? "text-red-300" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function DataRow({
  label,
  value,
  alert = false,
}: {
  label: string;
  value: string;
  alert?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-[#006bff]/10 py-2 last:border-0">
      <p className="text-sm text-slate-300">
        {label}
      </p>

      <p
        className={`font-black ${
          alert ? "text-orange-300" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
