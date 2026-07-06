export type WarehouseAnalysis = {
  healthScore: number;
  status: "Excellent" | "Stable" | "Sous tension" | "Critique";
  alerts: string[];
  priorities: string[];
  aiAdvice: string;
  productivity: string;
};

export function generateWarehouseAnalysis(): WarehouseAnalysis {
  const pendingReceptions = 18;
  const saturatedDocks = [2, 3];
  const productivityGain = 12;

  let healthScore = 91;

  if (pendingReceptions > 25) healthScore -= 15;
  if (saturatedDocks.length > 2) healthScore -= 10;

  const status =
    healthScore >= 90
      ? "Excellent"
      : healthScore >= 75
      ? "Stable"
      : healthScore >= 60
      ? "Sous tension"
      : "Critique";

  return {
    healthScore,
    status,
    alerts: [
      `Quais ${saturatedDocks.join(" et ")} saturés`,
      `${pendingReceptions} réceptions en attente`,
      "Risque de retard sur les déchargements de l'après-midi",
    ],
    priorities: [
      "Décharger le camion DHL avant 14h",
      "Réaffecter une équipe vers les quais 2 et 3",
      "Contrôler les réceptions urgentes en priorité",
    ],
    aiAdvice:
      "Déplace une équipe du quai 5 vers le quai 2 pendant 45 minutes pour réduire la saturation.",
    productivity: `+${productivityGain}% par rapport à hier`,
  };
}