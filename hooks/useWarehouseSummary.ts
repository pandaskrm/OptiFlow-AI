"use client";

import { useCallback, useEffect, useState } from "react";

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

export default function useWarehouseSummary(
  refreshInterval = 5000
) {
  const [data, setData] =
    useState<WarehouseSummary>(EMPTY_SUMMARY);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch(
        "/api/warehouse/summary",
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Impossible de charger les données de l'entrepôt."
        );
      }

      const summary: WarehouseSummary =
        await response.json();

      setData(summary);
      setError(null);
    } catch (caughtError) {
      console.error(caughtError);

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Une erreur est survenue."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();

    const intervalId = window.setInterval(
      refresh,
      refreshInterval
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, [refresh, refreshInterval]);

  return {
    data,
    loading,
    error,
    refresh,
  };
}