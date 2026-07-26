import type {
  SimulationScenario,
  SimulationStateV2,
} from "./simulationTypesV2";

function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getScenarioPressure(scenario: SimulationScenario): number {
  switch (scenario) {
    case "peak":
      return 2;
    case "black_friday":
      return 4;
    case "transport_issue":
      return 3;
    case "quality_alert":
      return 1;
    case "normal":
    default:
      return 0;
  }
}

export function createInitialSimulationStateV2(): SimulationStateV2 {
  const simulatedAt = new Date().toISOString();

  return {
    running: false,
    tick: 0,
    scenario: "normal",
    simulatedAt,

    receptions: {
      planned: 6,
      atDock: 2,
      unloading: 2,
      inspection: 1,
      completed: 18,
      palletsReceived: 146,
    },

    preparation: {
      waitingOrders: 42,
      activeOrders: 18,
      completedOrders: 486,
      pickingProgress: 74,
      activePickers: 47,
      absentPickers: 3,
    },

    shipping: {
      waitingShipments: 8,
      loadingShipments: 4,
      completedShipments: 32,
      delayedShipments: 1,
    },

    stock: {
      totalReferences: 12480,
      lowStockReferences: 23,
      stockouts: 3,
      inventoryAccuracy: 98.7,
    },

    docks: {
      total: 6,
      occupied: 4,
      available: 2,
      trucksWaiting: 2,
    },

    kpis: {
      orders: 486,
      shipments: 32,
      receptions: 18,
      serviceRate: 97,
      productivity: 91,
      warehouseHealth: 91,
    },

    alerts: [
      {
        id: "alert-initial-docks",
        level: "warning",
        title: "Tension sur les quais",
        message: "Deux camions sont actuellement en attente d'affectation.",
        createdAt: simulatedAt,
      },
    ],

    aiRecommendations: [
      {
        id: "ai-initial-docks",
        priority: "warning",
        title: "Ouvrir un quai supplémentaire",
        message:
          "Le flux entrant augmente. L'ouverture d'un quai disponible réduirait l'attente transporteur.",
        createdAt: simulatedAt,
      },
    ],
  };
}

export function tickSimulationV2(
  currentState: SimulationStateV2
): SimulationStateV2 {
  const pressure = getScenarioPressure(currentState.scenario);
  const completedReception = Math.random() > 0.65 ? 1 : 0;
  const completedOrder = random(2, 8);
  const completedShipment = Math.random() > 0.5 ? 1 : 0;

  const occupiedDocks = clamp(
    currentState.docks.occupied + random(-1, 1) + (pressure > 2 ? 1 : 0),
    0,
    currentState.docks.total
  );

  const trucksWaiting = clamp(
    currentState.docks.trucksWaiting + random(-1, 2) + pressure,
    0,
    20
  );

  const waitingOrders = clamp(
    currentState.preparation.waitingOrders +
      random(-4, 6) +
      pressure * 2 -
      completedOrder,
    0,
    500
  );

  const delayedShipments = clamp(
    currentState.shipping.delayedShipments +
      random(-1, 1) +
      (currentState.scenario === "transport_issue" ? 2 : 0),
    0,
    30
  );

  const warehouseHealth = clamp(
    currentState.kpis.warehouseHealth +
      random(-2, 2) -
      Math.floor(pressure / 2) -
      Math.floor(delayedShipments / 8),
    65,
    100
  );

  const serviceRate = clamp(
    currentState.kpis.serviceRate +
      random(-1, 1) -
      Math.floor(delayedShipments / 10),
    80,
    100
  );

  const productivity = clamp(
    currentState.kpis.productivity +
      random(-2, 2) -
      currentState.preparation.absentPickers,
    60,
    100
  );

  return {
    ...currentState,
    tick: currentState.tick + 1,
    simulatedAt: new Date().toISOString(),

    receptions: {
      ...currentState.receptions,
      planned: clamp(
        currentState.receptions.planned + random(-1, 2) + pressure,
        0,
        40
      ),
      atDock: occupiedDocks,
      unloading: clamp(occupiedDocks - random(0, 2), 0, occupiedDocks),
      inspection: clamp(
        currentState.receptions.inspection + random(-1, 1),
        0,
        10
      ),
      completed: currentState.receptions.completed + completedReception,
      palletsReceived:
        currentState.receptions.palletsReceived +
        completedReception * random(8, 26),
    },

    preparation: {
      ...currentState.preparation,
      waitingOrders,
      activeOrders: clamp(
        currentState.preparation.activeOrders + random(-3, 3),
        0,
        80
      ),
      completedOrders:
        currentState.preparation.completedOrders + completedOrder,
      pickingProgress: clamp(
        currentState.preparation.pickingProgress + random(-3, 4),
        0,
        100
      ),
    },

    shipping: {
      ...currentState.shipping,
      waitingShipments: clamp(
        currentState.shipping.waitingShipments +
          random(-2, 3) +
          Math.floor(pressure / 2),
        0,
        60
      ),
      loadingShipments: clamp(
        currentState.shipping.loadingShipments + random(-1, 1),
        0,
        currentState.docks.total
      ),
      completedShipments:
        currentState.shipping.completedShipments + completedShipment,
      delayedShipments,
    },

    stock: {
      ...currentState.stock,
      lowStockReferences: clamp(
        currentState.stock.lowStockReferences + random(-1, 2),
        0,
        250
      ),
      stockouts: clamp(
        currentState.stock.stockouts + random(-1, 1),
        0,
        50
      ),
      inventoryAccuracy: clamp(
        Number(
          (
            currentState.stock.inventoryAccuracy +
            random(-2, 2) / 10
          ).toFixed(1)
        ),
        90,
        100
      ),
    },

    docks: {
      ...currentState.docks,
      occupied: occupiedDocks,
      available: currentState.docks.total - occupiedDocks,
      trucksWaiting,
    },

    kpis: {
      orders: currentState.preparation.completedOrders + completedOrder,
      shipments:
        currentState.shipping.completedShipments + completedShipment,
      receptions:
        currentState.receptions.completed + completedReception,
      serviceRate,
      productivity,
      warehouseHealth,
    },
  };
}
