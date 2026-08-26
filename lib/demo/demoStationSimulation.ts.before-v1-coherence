import type { DemoStationSnapshot } from "./demoStationMetrics";
import type { SimulationStateV2 } from "../simulation/simulationTypesV2";

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function createDemoSimulationState(
  snapshot: DemoStationSnapshot,
  stepId: number,
): SimulationStateV2 {
  const waitingOrders = Math.max(
    0,
    snapshot.ordersTotal -
      snapshot.ordersCompleted -
      snapshot.ordersInProgress,
  );

  const pickingProgress =
    snapshot.ordersTotal > 0
      ? Math.round(
          (snapshot.ordersCompleted / snapshot.ordersTotal) * 100,
        )
      : 0;

  const waitingShipments = Math.max(
    0,
    snapshot.shipmentsReady - snapshot.shipmentsConfirmed,
  );

  const loadingShipments = Math.max(
    0,
    snapshot.shipmentsConfirmed - snapshot.shipmentsFinished,
  );

  const transportIssue = stepId === 11;
  const preparationRisk = stepId === 7 || stepId === 8;

  const alerts = preparationRisk
    ? [
        {
          id: "demo-preparation-risk",
          level: "warning" as const,
          title: "Risque sur la préparation",
          message:
            "La cadence actuelle expose plusieurs commandes prioritaires.",
          createdAt: new Date().toISOString(),
        },
      ]
    : transportIssue
      ? [
          {
            id: "demo-transport-risk",
            level: "warning" as const,
            title: "Confirmation transporteur attendue",
            message:
              "Un enlèvement reste à sécuriser avant la fin de journée.",
            createdAt: new Date().toISOString(),
          },
        ]
      : [];

  const aiRecommendations = preparationRisk
    ? [
        {
          id: "demo-recommendation-preparation",
          priority: "warning" as const,
          title: "Renforcer la préparation",
          message:
            "Réaffecter temporairement des ressources vers les commandes prioritaires.",
          createdAt: new Date().toISOString(),
        },
      ]
    : transportIssue
      ? [
          {
            id: "demo-recommendation-transport",
            priority: "warning" as const,
            title: "Relancer le transporteur",
            message:
              "Sécuriser immédiatement la confirmation de l'enlèvement.",
          createdAt: new Date().toISOString(),
        },
      ]
    : [];

  const occupiedDocks = clamp(
    snapshot.receptionsActive +
      Math.min(2, loadingShipments) +
      (transportIssue ? 1 : 0),
    0,
    6,
  );

  return {
    running: true,
    tick: stepId,
    scenario: "normal",
    simulatedAt: new Date().toISOString(),

    receptions: {
      planned: Math.max(
        0,
        3 - snapshot.receptionsFinished,
      ),
      atDock: snapshot.receptionsActive,
      unloading: snapshot.receptionsActive,
      inspection: 0,
      completed: snapshot.receptionsFinished,
      palletsReceived: snapshot.stockMovements,
    },

    preparation: {
      waitingOrders,
      activeOrders: snapshot.ordersInProgress,
      completedOrders: snapshot.ordersCompleted,
      pickingProgress,
      activePickers: snapshot.pickersActive,
      absentPickers: Math.max(0, 36 - snapshot.pickersActive),
    },

    shipping: {
      waitingShipments,
      loadingShipments: Math.min(loadingShipments, 6),
      completedShipments: snapshot.shipmentsFinished,
      delayedShipments: transportIssue ? 1 : 0,
    },

    stock: {
      totalReferences: 12480,
      lowStockReferences: 0,
      stockouts: 0,
      inventoryAccuracy: 99.2,
    },

    docks: {
      total: 6,
      occupied: occupiedDocks,
      available: 6 - occupiedDocks,
      trucksWaiting: transportIssue ? 1 : 0,
    },

    kpis: {
      orders: snapshot.ordersCompleted,
      shipments: snapshot.shipmentsFinished,
      receptions: snapshot.receptionsFinished,
      serviceRate: snapshot.projectedService,
      productivity: snapshot.productivity,
      warehouseHealth: snapshot.warehouseHealth,
    },

    alerts,
    aiRecommendations,
  };
}
