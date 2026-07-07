import { RECEPTION_STATUS } from "../../constants/receptionStatus";
import { Reception } from "../../types/reception";

export function generateDailyBrief(receptions: Reception[]) {
  const total = receptions.length;
  const pallets = receptions.reduce((sum, item) => sum + item.pallets, 0);

  const planned = receptions.filter(
    (item) => item.status === RECEPTION_STATUS.PLANNED
  ).length;

  const atDock = receptions.filter(
    (item) => item.status === RECEPTION_STATUS.AT_DOCK
  ).length;

  const unloading = receptions.filter(
    (item) => item.status === RECEPTION_STATUS.UNLOADING
  ).length;

  const inspection = receptions.filter(
    (item) => item.status === RECEPTION_STATUS.INSPECTION
  ).length;

  const completed = receptions.filter(
    (item) => item.status === RECEPTION_STATUS.COMPLETED
  ).length;

  const activeReception = receptions.find(
    (item) => item.status !== RECEPTION_STATUS.COMPLETED
  );

  const alerts: string[] = [];

  if (planned > 0)
    alerts.push(`${planned} réception(s) encore planifiée(s).`);

  if (atDock > 0)
    alerts.push(`${atDock} camion(s) actuellement à quai.`);

  if (inspection > 0)
    alerts.push(`${inspection} contrôle(s) qualité en attente.`);

  let warehouseHealth = 100;

  warehouseHealth -= planned * 4;
  warehouseHealth -= atDock * 5;
  warehouseHealth -= inspection * 3;

  warehouseHealth = Math.max(55, Math.min(100, warehouseHealth));

  let risk: "Faible" | "Moyen" | "Élevé";

  if (warehouseHealth >= 90) {
    risk = "Faible";
  } else if (warehouseHealth >= 75) {
    risk = "Moyen";
  } else {
    risk = "Élevé";
  }

  let recommendation = "";

  if (risk === "Élevé") {
    recommendation =
      "Renforcer immédiatement l'équipe réception et libérer un quai.";
  } else if (planned >= 3) {
    recommendation =
      "Prioriser les camions déjà planifiés afin d'éviter un engorgement.";
  } else if (inspection > 0) {
    recommendation =
      "Finaliser les contrôles qualité avant l'arrivée des prochains camions.";
  } else if (unloading > 0) {
    recommendation =
      "Accélérer le déchargement pour réduire le temps d'occupation des quais.";
  } else {
    recommendation =
      "Activité stable. Vous pouvez anticiper les prochaines réceptions.";
  }

  const priority = activeReception
    ? `${activeReception.carrier} - ${activeReception.dock}`
    : "Aucune priorité urgente";

  const estimatedEndTime =
    warehouseHealth < 75
      ? "Fin estimée : après 17h00"
      : pallets > 200
      ? "Fin estimée : après 16h00"
      : "Fin estimée : avant 15h30";

  const confidence =
    warehouseHealth > 90
      ? 98
      : warehouseHealth > 80
      ? 94
      : warehouseHealth > 70
      ? 88
      : 79;

  return {
    total,
    pallets,
    planned,
    atDock,
    unloading,
    inspection,
    completed,
    alerts,
    recommendation,
    priority,
    estimatedEndTime,
    warehouseHealth,
    risk,
    confidence,
  };
}