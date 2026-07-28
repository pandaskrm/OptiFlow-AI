"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  WarehouseAiAnalysis,
} from "../lib/ai/warehouseAiEngine";
import type {
  WarehouseSummary,
} from "../lib/warehouse/warehouseService";

export type WarehouseAnalysisResponse = {
  summary: WarehouseSummary;
  analysis: WarehouseAiAnalysis;
  updatedAt: string;
};

export default function useWarehouseAnalysis(
  refreshInterval = 15000
) {
  const [data, setData] =
    useState<WarehouseAnalysisResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch(
        "/api/warehouse/analysis",
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Impossible de charger l'analyse de l'entrepôt."
        );
      }

      const result =
        (await response.json()) as WarehouseAnalysisResponse;

      setData(result);
      setError(null);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Une erreur inconnue est survenue."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();

    const interval = window.setInterval(
      () => void refresh(),
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
