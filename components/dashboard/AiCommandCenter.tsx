"use client";

import Image from "next/image";

type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | null;

type AiCommandCenterProps = {
  health: number;
  aiScore: number | null;
  riskLevel: RiskLevel;
  dataSource: string;
  hasData: boolean;
  simulationRunning: boolean;
  mainPriority: string;
  aiAdvice: string;
  alerts: string[];
};

function getRiskLabel(riskLevel: RiskLevel) {
  if (riskLevel === "HIGH") {
    return "Élevé";
  }

  if (riskLevel === "MEDIUM") {
    return "Modéré";
  }

  if (riskLevel === "LOW") {
    return "Faible";
  }

  return "En attente";
}

function getRiskClass(riskLevel: RiskLevel) {
  if (riskLevel === "HIGH") {
    return "text-red-400";
  }

  if (riskLevel === "MEDIUM") {
    return "text-orange-400";
  }

  if (riskLevel === "LOW") {
    return "text-emerald-400";
  }

  return "text-slate-500";
}

export default function AiCommandCenter({
  health,
  aiScore,
  riskLevel,
  dataSource,
  hasData,
  simulationRunning,
  mainPriority,
  aiAdvice,
  alerts,
}: AiCommandCenterProps) {
  const active = hasData || simulationRunning;

  const healthLabel =
    health >= 80
      ? "Situation maîtrisée"
      : health >= 60
        ? "Vigilance requise"
        : health > 0
          ? "Risque opérationnel"
          : "En attente de données";

  return (
    <section className="organia-electric-panel organia-electric-panel-v2 organia-ai-core mb-6 overflow-hidden rounded-2xl border border-[#008cff]/75 bg-gradient-to-br from-[#020617] via-[#071426] to-[#00265c] shadow-[0_0_20px_rgba(0,140,255,0.30),0_0_55px_rgba(0,107,255,0.13),inset_0_0_35px_rgba(0,140,255,0.06)]">
      <div className="relative overflow-hidden border-b border-[#008cff]/40 p-6">
  <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[250px] w-[1120px] -translate-x-1/2 -translate-y-1/2 xl:block">
    <Image
      src="/organia-reference/organia-ai-brain-transparent.png"
      alt=""
      fill
      priority
      sizes="680px"
      className="object-contain mix-blend-screen scale-[1.22]"
      style={{
        filter:
          "saturate(1.85) brightness(1.30) contrast(1.22) drop-shadow(0 0 22px rgba(0,229,255,.70)) drop-shadow(0 0 58px rgba(0,107,255,.45))",
      }}
    />
  </div>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#00e5ff] drop-shadow-[0_0_7px_rgba(0,229,255,0.55)]">
              Intelligence opérationnelle
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Centre de commande IA
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
              Analyse de la santé de l'entrepôt, des risques et des
              actions prioritaires.
            </p>
          </div>

          <div
            className={`inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider ${
              active
                ? "border-emerald-700 bg-emerald-500/10 text-emerald-400"
                : "border-slate-700 bg-slate-800 text-slate-500"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                active ? "bg-emerald-400" : "bg-slate-500"
              }`}
            />

            {active ? "Analyse active" : "En attente"}
          </div>
        </div>
      </div>

      <div className="grid gap-4 border-b border-[#008cff]/40 p-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-[#008cff]/45 bg-gradient-to-br from-[#071426] to-[#020617] p-5 shadow-[0_0_18px_rgba(0,107,255,0.08)] transition hover:-translate-y-1 hover:border-[#00e5ff] hover:shadow-[0_0_16px_rgba(0,229,255,0.40),0_0_38px_rgba(0,140,255,0.28)]">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Santé globale
          </p>

          <p className="mt-3 text-4xl font-black text-white">
            {health}%
          </p>

          <p className="mt-2 text-sm font-semibold text-[#49efff]">
            {healthLabel}
          </p>
        </div>

        <div className="rounded-2xl border border-[#008cff]/45 bg-gradient-to-br from-[#071426] to-[#020617] p-5 shadow-[0_0_18px_rgba(0,107,255,0.08)] transition hover:-translate-y-1 hover:border-[#00e5ff] hover:shadow-[0_0_16px_rgba(0,229,255,0.40),0_0_38px_rgba(0,140,255,0.28)]">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Score IA
          </p>

          <p className="mt-3 text-4xl font-black text-white">
            {aiScore === null ? "—" : aiScore}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            {aiScore === null ? "En attente de données" : "Sur 100"}
          </p>
        </div>

        <div className="rounded-2xl border border-[#008cff]/45 bg-gradient-to-br from-[#071426] to-[#020617] p-5 shadow-[0_0_18px_rgba(0,107,255,0.08)] transition hover:-translate-y-1 hover:border-[#00e5ff] hover:shadow-[0_0_16px_rgba(0,229,255,0.40),0_0_38px_rgba(0,140,255,0.28)]">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Niveau de risque
          </p>

          <p className={`mt-3 text-3xl font-black ${getRiskClass(riskLevel)}`}>
            {getRiskLabel(riskLevel)}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Analyse opérationnelle
          </p>
        </div>

        <div className="rounded-2xl border border-[#008cff]/45 bg-gradient-to-br from-[#071426] to-[#020617] p-5 shadow-[0_0_18px_rgba(0,107,255,0.08)] transition hover:-translate-y-1 hover:border-[#00e5ff] hover:shadow-[0_0_16px_rgba(0,229,255,0.40),0_0_38px_rgba(0,140,255,0.28)]">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Source des données
          </p>

          <p className="mt-3 text-xl font-bold text-white">
            {dataSource}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            {active ? "Synchronisation active" : "Connexion requise"}
          </p>
        </div>
      </div>

      <div className="grid gap-4 p-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-orange-900/70 bg-orange-500/5 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">
            Priorité principale
          </p>

          <h3 className="mt-3 text-xl font-bold text-white">
            {mainPriority}
          </h3>

          <p className="mt-3 leading-6 text-slate-300">
            {aiAdvice}
          </p>
        </div>

        <div className="rounded-2xl border border-[#008cff]/45 bg-gradient-to-br from-[#071426] to-[#020617] p-5 shadow-[0_0_18px_rgba(0,107,255,0.08)]">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-400">
              Alertes détectées
            </p>

            <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300">
              {alerts.length}
            </span>
          </div>

          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            {alerts.length > 0 ? (
              alerts.slice(0, 4).map((alert) => (
                <li
                  key={alert}
                  className="flex items-start gap-3 rounded-xl border border-[#008cff]/45 bg-[#020617]/80 p-3"
                >
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-400" />
                  <span>{alert}</span>
                </li>
              ))
            ) : (
              <li className="flex items-center gap-3 rounded-xl border border-emerald-900/60 bg-emerald-500/5 p-3 text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Aucune alerte critique détectée.
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
