"use client";

import useSimulationV2 from "../../hooks/useSimulationV2";
import useWarehouseAnalysis from "../../hooks/useWarehouseAnalysis";
import { generateAiMissions } from "../../lib/ai/missionEngine";

import AiCommandCenter from "./AiCommandCenter";
import AiMissionCenter from "./AiMissionCenter";
import WarehouseHealth from "./WarehouseHealth";
import WarehouseChart from "./WarehouseChart";
import LiveOperations from "./LiveOperations";
import AiRecommendations from "./AiRecommendations";

import AIRecommendation from "../ui/AIRecommendation";
import ProgressCard from "../ui/ProgressCard";

const demoOrders = [
  { day: "Lun", commandes: 486 },
  { day: "Mar", commandes: 520 },
  { day: "Mer", commandes: 498 },
  { day: "Jeu", commandes: 610 },
  { day: "Ven", commandes: 575 },
  { day: "Sam", commandes: 320 },
  { day: "Dim", commandes: 210 },
];

function getRiskLabel(
  riskLevel: "LOW" | "MEDIUM" | "HIGH",
) {
  if (riskLevel === "HIGH") {
    return "Risque opérationnel élevé";
  }

  if (riskLevel === "MEDIUM") {
    return "Risque opérationnel modéré";
  }

  return "Risque opérationnel faible";
}

export default function DashboardLiveContent() {
  const simulation = useSimulationV2();
  const { data, loading, error } = useWarehouseAnalysis();

  const warehouse = data?.summary;
  const analysis = data?.analysis;

  const hasRealData = warehouse?.dataConnected ?? false;
  const hasData = simulation.running || hasRealData;

  const trucksWaiting = simulation.running
    ? simulation.state.docks.trucksWaiting
    : warehouse?.receptions.planned ?? 0;

  const occupiedDocks = simulation.running
    ? simulation.state.docks.occupied
    : warehouse?.receptions.occupiedDocks ?? 0;

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

  const health = simulation.running
    ? simulation.state.kpis.warehouseHealth
    : warehouse?.healthScore ?? 0;

  const alerts = simulation.running
    ? ["Surveiller les prochains quais."]
    : hasRealData && analysis?.predictions.length
      ? analysis.predictions
      : warehouse?.alerts ?? [];

  const mainPriority = simulation.running
    ? "Optimiser les flux de réception."
    : hasRealData
      ? analysis?.recommendations[0] ??
        warehouse?.priorities[0] ??
        "Aucune priorité opérationnelle."
      : "Connectez votre ERP.";

  const aiAdvice = simulation.running
    ? "Répartir les ressources selon les volumes simulés."
    : hasRealData && analysis
      ? `${getRiskLabel(analysis.riskLevel)} — score IA ${analysis.score}/100.`
      : loading
        ? "Analyse opérationnelle en cours..."
        : error ??
          "Connectez votre ERP ou activez le Mode Démo.";

  const missions = generateAiMissions({
    dataConnected: hasRealData,
    simulationRunning: simulation.running,
    healthScore: health,
    occupiedDocks,
    totalDocks: simulation.running
      ? simulation.state.docks.total
      : 6,
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

  const executiveSummary = simulation.running
    ? "Le Mode Démo simule actuellement une journée logistique complète. Les indicateurs, les quais et les recommandations évoluent en temps réel."
    : hasRealData && analysis
      ? `${getRiskLabel(analysis.riskLevel)}. ${
          analysis.recommendations[0] ??
          "Aucune action immédiate n'est nécessaire."
        }`
      : "Aucune activité réelle n'est encore disponible. Connectez votre ERP ou lancez le Mode Démo pour découvrir le fonctionnement complet d'Organ•IA Flow.";

  return (
    <>
      <AiCommandCenter
        health={health}
        aiScore={
          simulation.running
            ? health
            : hasRealData && analysis
              ? analysis.score
              : null
        }
        riskLevel={
          simulation.running
            ? "LOW"
            : hasRealData && analysis
              ? analysis.riskLevel
              : null
        }
        dataSource={
          simulation.running
            ? "Mode Démo"
            : hasRealData
              ? "ERP connecté"
              : "Aucune donnée"
        }
        hasData={hasRealData}
        simulationRunning={simulation.running}
        mainPriority={mainPriority}
        aiAdvice={aiAdvice}
        alerts={alerts}
      />

      <AiMissionCenter missions={missions} />

      <section className="mb-4 rounded-2xl border border-[#008cff]/45 bg-slate-900/70 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#00e5ff] drop-shadow-[0_0_7px_rgba(0,229,255,0.55)]">
              Résumé exécutif IA
            </p>

            <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-300">
              {executiveSummary}
            </p>
          </div>

          {!hasData && !loading && (
            <button
              type="button"
              onClick={simulation.start}
              className="inline-flex shrink-0 items-center justify-center rounded-xl border border-[#00e5ff]/55 bg-gradient-to-r from-[#006bff] to-[#008cff] px-5 py-3 text-sm font-black text-white shadow-[0_0_18px_rgba(0,140,255,0.28)] transition hover:from-[#008cff] hover:to-[#00b8ff] hover:shadow-[0_0_28px_rgba(0,229,255,0.38)]"
            >
              Lancer le Mode Démo
            </button>
          )}
        </div>
      </section>

      {!hasData ? (
        <section className="rounded-2xl border border-dashed border-[#006bff]/40 bg-gradient-to-br from-[#071426]/90 to-[#020617] px-5 py-6 text-center shadow-[inset_0_0_30px_rgba(0,107,255,0.05)]">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-blue-800 bg-blue-500/10 text-sm font-black text-blue-300">
            ERP
          </div>

          <h2 className="mt-4 text-xl font-bold text-white">
            Votre cockpit est prêt
          </h2>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Connectez une source de données pour suivre votre activité réelle,
            ou utilisez le Mode Démo pour présenter immédiatement les capacités
            d'Organ•IA Flow.
          </p>

          {loading && (
            <p className="mt-4 text-sm font-semibold text-[#49efff]">
              Vérification des données en cours...
            </p>
          )}

          {error && (
            <p className="mt-4 text-sm font-semibold text-red-400">
              {error}
            </p>
          )}
        </section>
      ) : (
        <>
          <WarehouseHealth
            health={health}
            sourceLabel={
              simulation.running
                ? "Simulation active"
                : "Données ERP analysées par l'IA"
            }
            hasData={hasData}
          />

          <WarehouseChart
            hasData={hasData}
            simulationRunning={simulation.running}
            data={demoOrders}
          />

          <LiveOperations
            trucksWaiting={trucksWaiting}
            occupiedDocks={occupiedDocks}
            activeReceptions={activeReceptions}
            completedToday={completedToday}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <ProgressCard
              title="Préparation"
              value={preparationProgress}
            />

            <ProgressCard
              title="Expédition"
              value={shippingProgress}
            />
          </div>

          <AiRecommendations
            mainPriority={mainPriority}
            aiAdvice={aiAdvice}
            occupiedDocks={occupiedDocks}
            hasData={hasData}
          />

          <AIRecommendation
            title="Conseil IA du jour"
            message={
              simulation.running
                ? "Simulation en cours. Les recommandations sont actualisées selon l'évolution des opérations."
                : analysis?.recommendations[0] ??
                  "Aucune action prioritaire détectée."
            }
            gain={
              simulation.running
                ? "Suivi actif"
                : analysis
                  ? `Score IA : ${analysis.score}/100`
                  : "En attente"
            }
          />
        </>
      )}
    </>
  );
}
