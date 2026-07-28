"use client";

import useSimulationV2 from "../../hooks/useSimulationV2";
import useWarehouseAnalysis from "../../hooks/useWarehouseAnalysis";

import AiCommandCenter from "./AiCommandCenter";
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

const emptyOrders = [
  { day: "Lun", commandes: 0 },
  { day: "Mar", commandes: 0 },
  { day: "Mer", commandes: 0 },
  { day: "Jeu", commandes: 0 },
  { day: "Ven", commandes: 0 },
  { day: "Sam", commandes: 0 },
  { day: "Dim", commandes: 0 },
];

function getRiskLabel(
  riskLevel: "LOW" | "MEDIUM" | "HIGH"
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

  const {
    data,
    loading,
    error,
  } = useWarehouseAnalysis();

  const warehouse = data?.summary;
  const analysis = data?.analysis;

  const hasRealData =
    warehouse?.dataConnected ?? false;

  const hasData =
    simulation.running || hasRealData;

  const ordersData = simulation.running
    ? demoOrders
    : emptyOrders;

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
    ? "Répartir les ressources selon la simulation."
    : hasRealData && analysis
      ? `${getRiskLabel(analysis.riskLevel)} — score IA ${analysis.score}/100.`
      : loading
        ? "Analyse opérationnelle en cours..."
        : error ??
          "Connectez votre ERP ou activez le Mode Démo.";

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

      <WarehouseHealth
        health={health}
        sourceLabel={
          simulation.running
            ? "Simulation active"
            : hasRealData
              ? "Données ERP analysées par l'IA"
              : "Aucune donnée"
        }
        hasData={hasData}
      />

      <WarehouseChart
        hasData={hasData}
        simulationRunning={simulation.running}
        data={ordersData}
      />

      <LiveOperations
        trucksWaiting={trucksWaiting}
        occupiedDocks={occupiedDocks}
        activeReceptions={activeReceptions}
        completedToday={completedToday}
      />

      <ProgressCard
        title="Préparation"
        value={preparationProgress}
      />

      <ProgressCard
        title="Expédition"
        value={shippingProgress}
      />

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
            ? "Simulation en cours."
            : hasRealData
              ? analysis?.recommendations[0] ??
                "Aucune action prioritaire détectée."
              : "Connectez votre ERP ou lancez le Mode Démo."
        }
        gain={
          simulation.running
            ? "Suivi actif"
            : hasRealData && analysis
              ? `Score IA : ${analysis.score}/100`
              : "En attente de données"
        }
      />
    </>
  );
}

