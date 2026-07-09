import { shippingOrders } from "./shippingData";

export function getShippingStats() {
  const total = shippingOrders.length;
  const shipped = shippingOrders.filter((order) => order.status === "Expédiée").length;
  const loading = shippingOrders.filter((order) => order.status === "Chargement").length;
  const urgent = shippingOrders.filter((order) => order.priority === "Haute").length;

  const parcels = shippingOrders.reduce((sum, order) => sum + order.parcels, 0);
  const pallets = shippingOrders.reduce((sum, order) => sum + order.pallets, 0);

  const averageProgress = Math.round(
    shippingOrders.reduce((sum, order) => sum + order.progress, 0) / total
  );

  return {
    total,
    shipped,
    loading,
    urgent,
    parcels,
    pallets,
    averageProgress,
    serviceRate: 97,
  };
}

export function getShippingAiInsight() {
  const stats = getShippingStats();

  return {
    title: "Analyse IA expédition",
    message: `${stats.urgent} expéditions prioritaires sont à surveiller. ${stats.loading} chargements sont actuellement en cours. Le taux de service expédition est de ${stats.serviceRate} %.`,
    recommendation:
      "Prioriser les départs Chronopost et DHL avant midi, puis renforcer le contrôle transport sur les quais 3 et 4.",
  };
}