import { WarehouseSummary } from "../warehouse/warehouseService";

export type WarehouseAiAnalysis = {
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  score: number;
  predictions: string[];
  recommendations: string[];
};

export function analyzeWarehouse(
  summary: WarehouseSummary
): WarehouseAiAnalysis {
  const predictions: string[] = [];
  const recommendations: string[] = [];

  let score = 100;

  if (summary.receptions.late > 0) {
    score -= summary.receptions.late * 5;

    predictions.push(
      "Des réceptions risquent de générer un retard d'exploitation."
    );

    recommendations.push(
      "Traiter immédiatement les réceptions en retard."
    );
  }

  if (summary.receptions.occupiedDocks >= 5) {
    score -= 15;

    predictions.push(
      "Risque de saturation des quais."
    );

    recommendations.push(
      "Libérer un quai dès que possible."
    );
  }

  if (summary.inventory.lowStockReferences > 0) {
    score -= 10;

    predictions.push(
      "Risque de rupture de stock."
    );

    recommendations.push(
      "Lancer un réapprovisionnement."
    );
  }

  if (summary.workforce.absent > 0) {
    score -= summary.workforce.absent * 2;

    predictions.push(
      "Les absences peuvent ralentir la préparation."
    );

    recommendations.push(
      "Rééquilibrer les équipes."
    );
  }

  score = Math.max(0, Math.min(100, score));

  const riskLevel =
    score >= 80
      ? "LOW"
      : score >= 60
      ? "MEDIUM"
      : "HIGH";

  return {
    riskLevel,
    score,
    predictions,
    recommendations,
  };
}
