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
  if (riskLevel === "HIGH") return "Élevé";
  if (riskLevel === "MEDIUM") return "Modéré";
  if (riskLevel === "LOW") return "Faible";
  return "En attente";
}

function getRiskClass(riskLevel: RiskLevel) {
  if (riskLevel === "HIGH") return "text-red-400";
  if (riskLevel === "MEDIUM") return "text-orange-400";
  if (riskLevel === "LOW") return "text-emerald-400";
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
    <section className="organia-electric-panel organia-electric-panel-v2 organia-ai-core organia-plasma-active mb-6 overflow-hidden rounded-[24px] border border-[#00e5ff]/70 bg-gradient-to-br from-[#01040b] via-[#03152d] to-[#002c69]/80 shadow-[0_0_26px_rgba(0,229,255,0.35),0_0_80px_rgba(0,107,255,0.22),inset_0_0_60px_rgba(0,140,255,0.08)]">

      {/* HERO PREMIUM */}
      <div className="relative min-h-[330px] overflow-hidden border-b border-[#008cff]/40">

        {/* halos */}
        <div className="pointer-events-none absolute -left-20 top-1/2 h-[360px] w-[360px] -translate-y-1/2 rounded-full bg-[#006bff]/15 blur-[90px]" />
        <div className="pointer-events-none absolute right-[8%] top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-[#00e5ff]/10 blur-[100px]" />

        {/* grille holographique */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.13]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,229,255,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,.18) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 35%, black 80%, transparent 100%)",
          }}
        />

        {/* LIBOT MANAGER */}
        <div className="pointer-events-none absolute bottom-0 left-0 hidden h-[340px] w-[360px] xl:block">
          <div className="absolute bottom-5 left-8 h-[220px] w-[220px] rounded-full bg-[#00e5ff]/15 blur-[65px]" />

          <Image
            src="/avatars/manager.png"
            alt="Libot Manager"
            fill
            priority
            sizes="360px"
            className="object-contain object-bottom drop-shadow-[0_0_30px_rgba(0,229,255,0.48)]"
          />
        </div>

        {/* CERVEAU CENTRAL */}
        <div className="pointer-events-none absolute left-[47%] top-1/2 hidden h-[350px] w-[690px] -translate-x-1/2 -translate-y-1/2 xl:block">
          <Image
            src="/organia-reference/organia-ai-brain-transparent.png"
            alt=""
            fill
            priority
            sizes="690px"
            className="object-contain mix-blend-screen"
            style={{
              filter:
                "saturate(1.95) brightness(1.30) contrast(1.20) drop-shadow(0 0 22px rgba(0,229,255,.75)) drop-shadow(0 0 70px rgba(0,107,255,.45))",
            }}
          />

          <div className="absolute left-1/2 top-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00e5ff]/15 shadow-[0_0_70px_rgba(0,229,255,.15)]" />
          <div className="absolute left-1/2 top-1/2 h-[290px] w-[290px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#008cff]/10" />
        </div>

        {/* CONTENU */}
        <div className="relative z-10 flex min-h-[330px] items-center px-6 py-7 xl:pl-[300px]">
          <div className="grid w-full gap-8 xl:grid-cols-[1fr_340px] xl:items-center">

            <div className="max-w-[600px] xl:ml-auto">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#00e5ff]/35 bg-[#00152c]/70 px-3 py-1.5 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00e5ff] shadow-[0_0_10px_#00e5ff]" />
                <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#73f4ff]">
                  Intelligence opérationnelle
                </span>
              </div>

              <h2 className="text-3xl font-black tracking-tight text-white xl:text-4xl">
                Centre de commande IA
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
                Analyse en temps réel de la santé de l’entrepôt, des risques,
                des priorités et des actions recommandées.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-[#008cff]/35 bg-[#006bff]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#7ddfff]">
                  Analyse prédictive
                </span>

                <span className="rounded-full border border-[#008cff]/35 bg-[#006bff]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#7ddfff]">
                  Priorités opérationnelles
                </span>

                <span className="rounded-full border border-[#008cff]/35 bg-[#006bff]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#7ddfff]">
                  Assistant Libot
                </span>
              </div>
            </div>

            <div className="xl:justify-self-end">
              <div className="rounded-2xl border border-[#008cff]/40 bg-[#020b19]/75 p-5 shadow-[0_0_35px_rgba(0,107,255,0.14)] backdrop-blur-xl">

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                      Statut IA
                    </p>

                    <p className="mt-1 text-lg font-black text-white">
                      {active ? "Analyse active" : "En attente"}
                    </p>
                  </div>

                  <span
                    className={`h-3 w-3 rounded-full ${
                      active
                        ? "bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,1)]"
                        : "bg-slate-500"
                    }`}
                  />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-[#008cff]/25 bg-[#020617]/70 p-3">
                    <p className="text-[9px] uppercase tracking-wider text-slate-500">
                      Santé
                    </p>
                    <p className="mt-1 text-xl font-black text-white">
                      {health > 0 ? `${health}%` : "--"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#008cff]/25 bg-[#020617]/70 p-3">
                    <p className="text-[9px] uppercase tracking-wider text-slate-500">
                      Score IA
                    </p>
                    <p className="mt-1 text-xl font-black text-white">
                      {aiScore === null ? "—" : aiScore}
                    </p>
                  </div>
                </div>

                <div className="mt-3 rounded-xl border border-[#008cff]/25 bg-[#020617]/70 p-3">
                  <p className="text-[9px] uppercase tracking-wider text-slate-500">
                    Source
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#7ddfff]">
                    {dataSource}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 4 BLOCS ANALYSE */}
      <div className="grid gap-4 border-b border-[#008cff]/40 p-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-[#008cff]/40 bg-gradient-to-br from-[#071426] to-[#020617] p-5 shadow-[0_0_18px_rgba(0,107,255,0.08)] transition hover:-translate-y-1 hover:border-[#00e5ff]/80">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Santé globale
          </p>
          <p className="mt-3 text-4xl font-black text-white">{health}%</p>
          <p className="mt-2 text-sm font-semibold text-[#49efff]">
            {healthLabel}
          </p>
        </div>

        <div className="rounded-2xl border border-[#008cff]/40 bg-gradient-to-br from-[#071426] to-[#020617] p-5 transition hover:-translate-y-1 hover:border-[#00e5ff]/80">
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

        <div className="rounded-2xl border border-[#008cff]/40 bg-gradient-to-br from-[#071426] to-[#020617] p-5 transition hover:-translate-y-1 hover:border-[#00e5ff]/80">
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

        <div className="rounded-2xl border border-[#008cff]/40 bg-gradient-to-br from-[#071426] to-[#020617] p-5 transition hover:-translate-y-1 hover:border-[#00e5ff]/80">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Source des données
          </p>
          <p className="mt-3 text-xl font-bold text-white">{dataSource}</p>
          <p className="mt-2 text-sm text-slate-500">
            {active ? "Synchronisation active" : "Connexion requise"}
          </p>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="grid gap-4 p-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-[#020617] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-400">
            Action prioritaire
          </p>

          <h3 className="mt-3 text-xl font-bold text-white">
            {mainPriority}
          </h3>

          <p className="mt-3 leading-6 text-slate-300">
            {aiAdvice}
          </p>
        </div>

        <div className="rounded-2xl border border-[#008cff]/40 bg-gradient-to-br from-[#071426] to-[#020617] p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#49efff]">
              Recommandation IA
            </p>

            <span className="rounded-full border border-[#008cff]/30 bg-[#006bff]/10 px-3 py-1 text-xs font-bold text-[#7ddfff]">
              {alerts.length}
            </span>
          </div>

          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            {alerts.length > 0 ? (
              alerts.slice(0, 3).map((alert) => (
                <li
                  key={alert}
                  className="flex items-start gap-3 rounded-xl border border-[#008cff]/25 bg-[#020617]/75 p-3"
                >
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,.8)]" />
                  <span>{alert}</span>
                </li>
              ))
            ) : (
              <li className="flex items-center gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-3 text-emerald-300">
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
