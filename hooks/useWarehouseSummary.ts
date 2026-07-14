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
  };
  healthScore: number;
  alerts: string[];
  priorities: string[];
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
  },
  healthScore: 0,
  alerts: [],
  priorities: [],
  updatedAt: "",
};

export default function useWarehouseSummary(
  refreshInterval = 5000
) {
  const [data, setData] =
    useState<WarehouseSummary>(EMPTY_SUMMARY);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/warehouse/summary", {
        cache: "no-store",
      });

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

    const interval = window.setInterval(
      refresh,
      refreshInterval
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [refresh, refreshInterval]);

  return {
    data,
    loading,
    error,
    refresh,
  };
}