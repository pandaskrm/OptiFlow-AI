"use client";

import useSimulationV2 from "../../hooks/useSimulationV2";
import useWarehouseSummary from "../../hooks/useWarehouseSummary";

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

export default function DashboardLiveContent() {
  const simulation = useSimulationV2();

  const {
    data: warehouse,
    loading,
    error,
  } = useWarehouseSummary();

  const hasRealData = warehouse.dataConnected;

  const ordersData = simulation.running
    ? demoOrders
    : emptyOrders;
    const trucksWaiting = simulation.running
  ? simulation.state.docks.trucksWaiting
  : hasRealData
    ? warehouse.receptions.planned
    : 0;

const occupiedDocks = simulation.running
  ? simulation.state.docks.occupied
  : hasRealData
    ? warehouse.receptions.occupiedDocks
    : 0;

const activeReceptions = simulation.running
  ? simulation.state.receptions.atDock +
    simulation.state.receptions.unloading +
    simulation.state.receptions.inspection
  : hasRealData
    ? warehouse.receptions.active
    : 0;

const completedToday = simulation.running
  ? simulation.state.receptions.completed
  : hasRealData
    ? warehouse.receptions.completed
    : 0;

const alerts =
  simulation.running
    ? ["Surveiller les prochains quais."]
    : hasRealData
      ? warehouse.alerts
      : [];

const mainPriority =
  simulation.running
    ? "Optimiser les flux de réception."
    : hasRealData
      ? warehouse.priorities[0] ?? "Aucune priorité."
      : "Connectez votre ERP.";

const aiAdvice =
  simulation.running
    ? "Répartir les ressources selon la simulation."
    : hasRealData
      ? "Les données ERP sont synchronisées."
      : "Connectez votre ERP ou activez le Mode Démo.";

  const health = simulation.running
    ? simulation.state.kpis.warehouseHealth
    : hasRealData
    ? warehouse.healthScore
    : 0;

  return (
    <>
      <AiCommandCenter
  health={health}
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
        ? "Données ERP"
        : "Aucune donnée"
  }
  hasData={simulation.running || hasRealData}
/>

      <WarehouseChart
        hasData={simulation.running || hasRealData}
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
        value={simulation.running ? 78 : 0}
      />

      <ProgressCard
        title="Expédition"
        value={simulation.running ? 92 : 0}
      />

     <AiRecommendations
  mainPriority={mainPriority}
  aiAdvice={aiAdvice}
  occupiedDocks={occupiedDocks}
  hasData={simulation.running || hasRealData}
/>

      <AIRecommendation
        title="Conseil IA du jour"
        message={
          simulation.running
            ? "Simulation en cours."
            : hasRealData
            ? "Les données ERP sont synchronisées."
            : "Connectez votre ERP ou lancez le Mode Démo."
        }
        gain={
          simulation.running || hasRealData
            ? "Suivi actif"
            : "En attente"
        }
      />
    </>
  );
}