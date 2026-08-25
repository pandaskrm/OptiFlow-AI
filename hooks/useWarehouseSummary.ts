"use client";

import { useCallback, useEffect, useState } from "react";
import { subscribeWarehouseUpdates } from "../lib/warehouse/warehouseLiveStore";

export type WarehouseSummary = {
  receptions: {
    total: number;
    planned: number;
    atDock: number;
    unloading: number;
    inspection: number;
    active: number;
    completed: number;
    occupiedDocks: number;
    totalPallets: number;
    receivedPallets: number;
    scheduledToday: number;
    scheduledTomorrow: number;
    late: number;
    completionRate: number;
  };

  receptionDetails: {
    id: number;
    number: string;
    supplier: string;
    carrier: string;
    dock: string;
    pallets: number;
    status: string;
    scheduledAt: string;
    createdAt: string;
  }[];
  orders: {
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

  orderDetails: {
    id: number;
    number: string;
    customer: string;
    priority: string;
    status: string;
    totalLines: number;
    preparedLines: number;
    scheduledAt: string | null;
  }[];
  shipments: {
    total: number;
    waiting: number;
    ready: number;
    shipped: number;
    totalPallets: number;
    totalPackages: number;
    progress: number;
    serviceRate: number;
  };

  shipmentDetails: {
    id: number;
    number: string;
    orderNumber: string | null;
    customer: string;
    carrier: string;
    dock: string | null;
    status: string;
    pallets: number;
    packages: number;
    scheduledAt: string | null;
    shippedAt: string | null;
  }[];

  inventory: {
    references: number;
    totalQuantity: number;
    reservedQuantity: number;
    availableQuantity: number;
    lowStockReferences: number;
    unavailableReferences: number;
  };

  workforce: {
    total: number;
    present: number;
    absent: number;
    paused: number;
    reinforcement: number;
    workedMinutes: number;
    processedUnits: number;
    productivity: number;
  };

  performance: {
    reception: number;
    preparation: number;
    shipping: number;
    service: number;
    productivity: number;
  };

  healthScore: number;
  alerts: string[];
  priorities: string[];
  dataConnected: boolean;
  updatedAt: string;
};

const EMPTY_SUMMARY: WarehouseSummary = {
  receptions: {
    total: 0,
    planned: 0,
    atDock: 0,
    unloading: 0,
    inspection: 0,
    active: 0,
    completed: 0,
    occupiedDocks: 0,
    totalPallets: 0,
    receivedPallets: 0,
    scheduledToday: 0,
    scheduledTomorrow: 0,
    late: 0,
    completionRate: 0,
  },

  receptionDetails: [],
  orders: {
    total: 0,
    waiting: 0,
    inPreparation: 0,
    completed: 0,
    priority: 0,
    totalLines: 0,
    preparedLines: 0,
    progress: 0,
    serviceRate: 0,
  },

  orderDetails: [],

  shipments: {
    total: 0,
    waiting: 0,
    ready: 0,
    shipped: 0,
    totalPallets: 0,
    totalPackages: 0,
    progress: 0,
    serviceRate: 0,
  },


  shipmentDetails: [],

  inventory: {
    references: 0,
    totalQuantity: 0,
    reservedQuantity: 0,
    availableQuantity: 0,
    lowStockReferences: 0,
    unavailableReferences: 0,
  },

  workforce: {
    total: 0,
    present: 0,
    absent: 0,
    paused: 0,
    reinforcement: 0,
    workedMinutes: 0,
    processedUnits: 0,
    productivity: 0,
  },

  performance: {
    reception: 0,
    preparation: 0,
    shipping: 0,
    service: 0,
    productivity: 0,
  },

  healthScore: 0,
  alerts: [],
  priorities: [],
  dataConnected: false,
  updatedAt: "",
};

type SharedWarehouseState = {
  data: WarehouseSummary;
  error: string | null;
  loading: boolean;
  updatedAt: number;
};

const CACHE_TTL_MS = 4000;

let sharedState: SharedWarehouseState = {
  data: EMPTY_SUMMARY,
  error: null,
  loading: true,
  updatedAt: 0,
};

let inFlightRequest: Promise<WarehouseSummary> | null = null;

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function subscribeSharedState(listener: () => void) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

async function fetchWarehouseSummary(
  force = false
): Promise<WarehouseSummary> {
  const now = Date.now();

  if (
    !force &&
    sharedState.updatedAt > 0 &&
    now - sharedState.updatedAt < CACHE_TTL_MS
  ) {
    return sharedState.data;
  }

  if (inFlightRequest) {
    return inFlightRequest;
  }

  sharedState = {
    ...sharedState,
    loading: sharedState.updatedAt === 0,
  };

  notifyListeners();

  inFlightRequest = fetch("/api/warehouse/summary", {
    cache: "no-store",
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(
          "Impossible de charger les données de l'entrepôt."
        );
      }

      return (await response.json()) as WarehouseSummary;
    })
    .then((summary) => {
      sharedState = {
        data: summary,
        error: null,
        loading: false,
        updatedAt: Date.now(),
      };

      notifyListeners();

      return summary;
    })
    .catch((caughtError) => {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Une erreur est survenue.";

      sharedState = {
        ...sharedState,
        error: message,
        loading: false,
      };

      notifyListeners();

      throw caughtError;
    })
    .finally(() => {
      inFlightRequest = null;
    });

  return inFlightRequest;
}

export default function useWarehouseSummary(
  refreshInterval = 15000
) {
  const [, forceRender] = useState(0);

  useEffect(() => {
    return subscribeSharedState(() => {
      forceRender((value) => value + 1);
    });
  }, []);

  const refresh = useCallback(async () => {
    try {
      await fetchWarehouseSummary(true);
    } catch {
      // L'état d'erreur partagé est déjà mis à jour.
    }
  }, []);

  useEffect(() => {
    void fetchWarehouseSummary(false).catch(() => undefined);

    const intervalId = window.setInterval(() => {
      void fetchWarehouseSummary(false).catch(() => undefined);
    }, refreshInterval);

    const unsubscribeWarehouse =
      subscribeWarehouseUpdates(() => {
        void fetchWarehouseSummary(true).catch(() => undefined);
      });

    return () => {
      window.clearInterval(intervalId);
      unsubscribeWarehouse();
    };
  }, [refreshInterval]);

  return {
    data: sharedState.data,
    loading: sharedState.loading,
    error: sharedState.error,
    refresh,
  };
}
