"use client";

import Image from "next/image";

import useSimulationV2 from "../../hooks/useSimulationV2";
import useWarehouseAnalysis from "../../hooks/useWarehouseAnalysis";
import { generateAiMissions } from "../../lib/ai/missionEngine";

const priorityClass = {
  CRITICAL: "border-red-500/60 bg-red-500/10 text-red-300",
  HIGH: "border-orange-500/60 bg-orange-500/10 text-orange-300",
  MEDIUM: "border-amber-500/60 bg-amber-500/10 text-amber-300",
  LOW: "border-blue-500/60 bg-blue-500/10 text-blue-300",
};

export default function DashboardLiveContent() {
  const simulation = useSimulationV2();
  const { data, loading, error } = useWarehouseAnalysis();

  const warehouse = data?.summary;
  const analysis = data?.analysis;

  const hasRealData = warehouse?.dataConnected ?? false;
  const active = simulation.running || hasRealData;

  const health = simulation.running
    ? simulation.state.kpis.warehouseHealth
    : warehouse?.healthScore ?? 0;

  const orders = simulation.running
    ? simulation.state.kpis.orders
    : warehouse?.orders.total ?? 0;

  const shipments = simulation.running
    ? simulation.state.kpis.shipments
    : warehouse?.shipments.total ?? 0;

  const receptions = simulation.running
    ? simulation.state.kpis.receptions
    : warehouse?.receptions.total ?? 0;

  const productivity = simulation.running
    ? simulation.state.kpis.productivity
    : warehouse?.performance.productivity ?? 0;

  const team = simulation.running
    ? 55
    : warehouse?.workforce.present ?? 0;

  const occupiedDocks = simulation.running
    ? simulation.state.docks.occupied
    : warehouse?.receptions.occupiedDocks ?? 0;

  const totalDocks = simulation.running
    ? simulation.state.docks.total
    : 6;

  const activeReceptions = simulation.running
    ? simulation.state.receptions.atDock +
      simulation.state.receptions.unloading +
      simulation.state.receptions.inspection
    : warehouse?.receptions.active ?? 0;

  const completedToday = simulation.running
    ? simulation.state.receptions.completed
    : warehouse?.receptions.completed ?? 0;

  const preparationProgress = simulation.running
    ? 78
    : warehouse?.performance.preparation ?? 0;

  const shippingProgress = simulation.running
    ? 92
    : warehouse?.performance.shipping ?? 0;

  const alerts = simulation.running
    ? ["Surveiller les prochains quais."]
    : hasRealData && analysis?.predictions.length
      ? analysis.predictions
      : warehouse?.alerts ?? [];

  const missions = generateAiMissions({
    dataConnected: hasRealData,
    simulationRunning: simulation.running,
    healthScore: health,
    occupiedDocks,
    totalDocks,
    receptions: {
      planned: simulation.running
        ? simulation.state.receptions.planned
        : warehouse?.receptions.planned ?? 0,
      active: activeReceptions,
      late: simulation.running
        ? simulation.state.docks.trucksWaiting
        : warehouse?.receptions.late ?? 0,
      completed: completedToday,
    },
    orders: {
      waiting: simulation.running
        ? simulation.state.kpis.orders
        : warehouse?.orders.waiting ?? 0,
      inPreparation: warehouse?.orders.inPreparation ?? 0,
      priority: warehouse?.orders.priority ?? 0,
      progress: preparationProgress,
    },
    shipments: {
      waiting: simulation.running
        ? simulation.state.shipping.waitingShipments
        : warehouse?.shipments.waiting ?? 0,
      ready: warehouse?.shipments.ready ?? 0,
      progress: shippingProgress,
    },
    inventory: {
      lowStockReferences:
        warehouse?.inventory.lowStockReferences ?? 0,
      unavailableReferences:
        warehouse?.inventory.unavailableReferences ?? 0,
    },
    workforce: {
      absent: warehouse?.workforce.absent ?? 0,
      present: warehouse?.workforce.present ?? 0,
      productivity:
        warehouse?.workforce.productivity ?? 0,
    },
    alerts,
    recommendations: analysis?.recommendations ?? [],
  });

  const aiScore =
    simulation.running
      ? health
      : hasRealData && analysis
        ? analysis.score
        : 0;

  const receptionPerformance =
    simulation.running
      ? Math.min(100, 90 + Math.round(health / 20))
      : warehouse?.performance.reception ?? 0;

  const servicePerformance =
    simulation.running
      ? simulation.state.kpis.serviceRate
      : warehouse?.performance.service ?? 0;

  const topMissions = missions.slice(0, 3);

  return (
    <div className="space-y-4">

      {/* HERO */}
      <section className="relative overflow-hidden rounded-[24px] border border-[#008cff]/55 bg-[#020817] shadow-[0_0_40px_rgba(0,140,255,.18)]">

        <div className="relative min-h-[500px] overflow-hidden">

          {/* décor entrepôt */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-[#020817] via-[#03152d]/65 to-[#020817]" />
            <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_center,rgba(0,229,255,.15),transparent_55%)]" />
          </div>

          {/* MANAGER */}
          <div className="absolute bottom-0 left-0 z-20 hidden h-[500px] w-[420px] xl:block">
            <div className="absolute bottom-8 left-6 h-[300px] w-[260px] rounded-full bg-[#008cff]/15 blur-[70px]" />

            <Image
              src="/organia-reference/libot-manager-crossed.png"
              alt="Libot Manager"
              fill
              priority
              sizes="420px"
              className="object-contain object-bottom drop-shadow-[0_0_32px_rgba(0,229,255,.6)]"
            />
          </div>

          {/* CERVEAU CENTRAL */}
          <div className="absolute left-[52%] top-[46%] z-10 hidden h-[500px] w-[760px] -translate-x-1/2 -translate-y-1/2 xl:block">
            <Image
              src="/organia-reference/organia-ai-brain-transparent.png"
              alt=""
              fill
              priority
              sizes="760px"
              className="object-contain mix-blend-screen"
              style={{
                filter:
                  "saturate(2) brightness(1.35) contrast(1.2) drop-shadow(0 0 24px rgba(0,229,255,.85)) drop-shadow(0 0 70px rgba(0,107,255,.55))",
              }}
            />

            <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00e5ff]/25 shadow-[0_0_80px_rgba(0,229,255,.22)]" />
            <div className="absolute left-1/2 top-1/2 h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#008cff]/20" />
          </div>

          {/* LABELS IA */}
          <div className="pointer-events-none absolute left-[34%] top-[13%] z-20 hidden rounded-xl border border-[#00e5ff]/50 bg-[#03152d]/90 px-5 py-3 text-xs font-black text-white shadow-[0_0_20px_rgba(0,229,255,.18)] xl:block">
            📊 ANALYSE
          </div>

          <div className="pointer-events-none absolute left-[32%] top-[38%] z-20 hidden rounded-xl border border-[#00e5ff]/50 bg-[#03152d]/90 px-5 py-3 text-xs font-black text-white xl:block">
            📦 PRIORITÉS
          </div>

          <div className="pointer-events-none absolute right-[31%] top-[14%] z-20 hidden rounded-xl border border-[#00e5ff]/50 bg-[#03152d]/90 px-5 py-3 text-xs font-black text-white xl:block">
            ↗ PRÉDICTIONS
          </div>

          <div className="pointer-events-none absolute right-[29%] top-[39%] z-20 hidden rounded-xl border border-[#00e5ff]/50 bg-[#03152d]/90 px-5 py-3 text-xs font-black text-white xl:block">
            🚚 OPTIMISATION
          </div>

          {/* ORGANIA CENTRAL */}
          <div className="absolute bottom-[48px] left-[52%] z-20 hidden -translate-x-1/2 text-center xl:block">
            <h1 className="text-5xl font-black tracking-[.08em] text-white">
              ORGANIA
            </h1>
            <p className="text-4xl font-black tracking-[.16em] text-[#00e5ff]">
              FLOW
            </p>

            <div className="mt-2 rounded-full border border-[#00e5ff]/50 bg-[#001b3f]/80 px-5 py-1 text-xs font-bold uppercase tracking-[.22em] text-[#7defff]">
              AI Command Center
            </div>
          </div>

          {/* DROITE */}
          <div className="relative z-30 ml-auto grid min-h-[500px] w-full gap-4 p-5 xl:w-[410px]">

            <div className="rounded-2xl border border-[#00e5ff]/50 bg-[#03152d]/90 p-6 shadow-[0_0_30px_rgba(0,140,255,.16)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[.18em] text-[#49efff]">
                  OrganIA Flow Live
                </span>

                <span className={`h-2 w-2 rounded-full ${active ? "bg-emerald-400 shadow-[0_0_12px_#34d399]" : "bg-slate-500"}`} />
              </div>

              <h2 className="mt-5 text-3xl font-black text-white">
                Bonjour Kevin 👋
              </h2>

              <p className="mt-2 text-lg font-bold text-slate-300">
                {active
                  ? "Votre entrepôt est sous surveillance IA."
                  : "Votre cockpit est prêt."}
              </p>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                {active
                  ? `${missions.length} priorité(s) nécessitent votre attention.`
                  : "Connectez votre ERP ou lancez le Mode Démo."}
              </p>

              <button
                type="button"
                onClick={
                  simulation.running
                    ? simulation.stop
                    : simulation.start
                }
                className="mt-5 rounded-xl border border-[#00e5ff]/60 bg-gradient-to-r from-[#006bff] to-[#00b8ff] px-5 py-3 text-sm font-black text-white shadow-[0_0_22px_rgba(0,229,255,.35)]"
              >
                {simulation.running
                  ? "Arrêter le Mode Démo"
                  : "Lancer le Mode Démo"}
              </button>
            </div>

            <div className="rounded-2xl border border-[#008cff]/45 bg-[#020617]/90 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-white">
                  État global
                </h3>

                <span className="text-sm font-bold text-emerald-400">
                  {active ? "● Actif" : "● En attente"}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-[120px_1fr] items-center gap-5">
                <div className="flex h-[110px] w-[110px] items-center justify-center rounded-full border-[9px] border-emerald-400/70 bg-[#03152d] shadow-[0_0_30px_rgba(52,211,153,.2)]">
                  <div className="text-center">
                    <p className="text-3xl font-black text-white">
                      {health}%
                    </p>
                    <p className="text-[9px] text-[#49efff]">
                      Performance
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Réception</span>
                    <span>{receptionPerformance}%</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Préparation</span>
                    <span>{preparationProgress}%</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Expédition</span>
                    <span>{shippingProgress}%</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Service</span>
                    <span>{servicePerformance}%</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* KPI */}
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {[
          ["📦", "Commandes", orders, "Flux commandes"],
          ["🚚", "Expéditions", shipments, "Flux transport"],
          ["📥", "Réceptions", receptions, "En cours"],
          ["⚡", "Productivité", `${productivity}%`, "Performance"],
          ["👥", "Équipe", team, `${warehouse?.workforce.present ?? 0} actifs`],
        ].map(([icon, title, value, subtitle]) => (
          <article
            key={String(title)}
            className="rounded-2xl border border-[#008cff]/55 bg-gradient-to-br from-[#071426] to-[#020617] p-5 shadow-[0_0_22px_rgba(0,107,255,.10)]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#00e5ff]/55 bg-[#006bff]/15 text-xl">
                {icon}
              </div>

              <h3 className="font-bold text-white">
                {title}
              </h3>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-4xl font-black text-white">
                  {value}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {subtitle}
                </p>
              </div>

              <div className="flex h-12 items-end gap-1">
                {[25, 45, 35, 70, 50, 88].map((h, index) => (
                  <span
                    key={index}
                    className="w-1.5 rounded-full bg-gradient-to-t from-[#006bff] to-[#00e5ff]"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* BAS */}
      <section className="grid gap-4 xl:grid-cols-[1.7fr_.9fr_.85fr]">

        {/* ACTIVITE */}
        <article className="overflow-hidden rounded-2xl border border-[#008cff]/55 bg-gradient-to-br from-[#071426] to-[#020617]">
          <div className="p-5">
            <h3 className="text-lg font-black text-white">
              Activité en temps réel
            </h3>
            <p className="text-sm text-slate-500">
              Flux opérationnel de l’entrepôt
            </p>
          </div>

          <div className="grid min-h-[280px] lg:grid-cols-[1fr_1.15fr]">
            <div className="space-y-2 p-5 pt-0">
              {[
                ["🔵", "Réception", `${activeReceptions} active(s)`],
                ["🟢", "Préparation", `${preparationProgress}%`],
                ["🟠", "Expédition", `${shippingProgress}%`],
                ["🔵", "Stock", `${warehouse?.inventory.lowStockReferences ?? 0} alerte(s)`],
              ].map(([dot, title, detail]) => (
                <div
                  key={String(title)}
                  className="flex items-center justify-between rounded-xl border border-[#008cff]/25 bg-[#020617]/80 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span>{dot}</span>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {detail}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-emerald-400">
                    {active ? "En cours" : "En attente"}
                  </span>
                </div>
              ))}
            </div>

            <div className="relative min-h-[250px] overflow-hidden">
              <Image
                src="/organia-reference/warehouse-trucks-reference.png"
                alt="Entrepôt OrganIA Flow"
                fill
                sizes="600px"
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-transparent to-[#020617]/30" />

              <div className="absolute right-3 top-3 space-y-2">
                {Array.from({ length: totalDocks }).map((_, index) => (
                  <div
                    key={index}
                    className="flex min-w-[90px] items-center justify-between rounded-lg border border-[#008cff]/30 bg-[#020617]/90 px-3 py-2 text-xs text-white"
                  >
                    Quai {index + 1}

                    <span
                      className={`h-2 w-2 rounded-full ${
                        index < occupiedDocks
                          ? "bg-emerald-400"
                          : "bg-slate-600"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>

        {/* ANALYSE IA */}
        <article className="rounded-2xl border border-[#008cff]/55 bg-gradient-to-br from-[#071426] to-[#020617] p-5">
          <h3 className="text-lg font-black text-white">
            Analyse IA
          </h3>
          <p className="text-sm text-slate-500">
            Santé opérationnelle
          </p>

          <div className="mx-auto mt-6 flex h-[150px] w-[150px] items-center justify-center rounded-full border-[12px] border-[#00e5ff]/70 bg-[#020617] shadow-[0_0_35px_rgba(0,229,255,.2)]">
            <div className="text-center">
              <p className="text-4xl font-black text-white">
                {aiScore}
              </p>
              <p className="text-xs text-[#49efff]">
                /100
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {(analysis?.recommendations ?? [
              "Performance en attente",
              "Aucune donnée critique",
              "Optimisation disponible",
            ])
              .slice(0, 4)
              .map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl bg-[#020617]/60 p-3"
                >
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                  <p className="text-sm text-slate-300">
                    {item}
                  </p>
                </div>
              ))}
          </div>
        </article>

        {/* MISSIONS */}
        <article className="rounded-2xl border border-[#008cff]/55 bg-gradient-to-br from-[#071426] to-[#020617] p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-[#49efff]">
              Mission Control
            </h3>

            <span className="text-xs font-bold text-orange-400">
              {missions.length} priorité(s)
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {topMissions.map((mission) => (
              <div
                key={mission.id}
                className={`rounded-xl border p-4 ${priorityClass[mission.priority]}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-black text-white">
                      {mission.title}
                    </h4>

                    <p className="mt-1 line-clamp-2 text-xs text-slate-400">
                      {mission.explanation}
                    </p>
                  </div>

                  <span className="rounded-full bg-black/20 px-2 py-1 text-[10px] font-black">
                    {mission.priority}
                  </span>
                </div>
              </div>
            ))}

            {topMissions.length === 0 && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm text-emerald-300">
                Aucune priorité critique.
              </div>
            )}
          </div>
        </article>

      </section>

      {loading && (
        <p className="text-center text-sm text-[#49efff]">
          Analyse des données en cours...
        </p>
      )}

      {error && (
        <p className="text-center text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
