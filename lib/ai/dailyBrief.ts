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

  if (planned > 0) {
    alerts.push(`${planned} réception(s) encore planifiée(s).`);
  }

  if (atDock > 0) {
    alerts.push(`${atDock} camion(s) actuellement à quai.`);
  }

  if (inspection > 0) {
    alerts.push(`${inspection} réception(s) en contrôle qualité.`);
  }

  const recommendation =
    total === 0
      ? "Enregistrez les réceptions prévues pour obtenir un brief automatique."
      : planned > 0
      ? "Priorisez la mise à quai des réceptions planifiées."
      : unloading > 0
      ? "Surveillez les déchargements en cours pour éviter les blocages."
      : inspection > 0
      ? "Clôturez les contrôles qualité dès validation."
      : "La journée est bien maîtrisée. Continuez le suivi opérationnel.";

  const priority = activeReception
    ? `${activeReception.carrier} - ${activeReception.dock}`
    : "Aucune priorité urgente";

  const estimatedEndTime =
    total === 0 ? "Non disponible" : pallets > 200 ? "Fin estimée : après 16h00" : "Fin estimée : avant 15h30";

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
  };
}