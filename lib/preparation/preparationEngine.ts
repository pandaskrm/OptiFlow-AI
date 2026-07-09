import { preparationOrders } from "./preparationData";

export function getPreparationStats() {
  const total = preparationOrders.length;
  const completed = preparationOrders.filter((order) => order.status === "Terminée").length;
  const inProgress = preparationOrders.filter((order) => order.status === "En préparation").length;
  const urgent = preparationOrders.filter((order) => order.priority === "Haute").length;

  const averageProgress = Math.round(
    preparationOrders.reduce((sum, order) => sum + order.progress, 0) / total
  );

  return {
    total,
    completed,
    inProgress,
    urgent,
    averageProgress,
    serviceRate: 98,
    productivity: 112,
  };
}

export function getPreparationAiInsight() {
  const stats = getPreparationStats();

  return {
    title: "Analyse IA préparation",
    message: `${stats.urgent} commandes prioritaires sont à surveiller. ${stats.inProgress} commandes sont actuellement en préparation. Le taux de service reste stable à ${stats.serviceRate} %.`,
    recommendation:
      "Prioriser les commandes haute priorité avant 11h00 et renforcer le contrôle sur les commandes à fort volume.",
  };
}