import { Reception } from "../../types/reception";
import { RECEPTION_STATUS } from "../../constants/receptionStatus";

export function generateDashboard(receptions: Reception[]) {
  const totalReceptions = receptions.length;

  const occupiedDocks = receptions.filter(
    (r) => r.status !== RECEPTION_STATUS.COMPLETED
  ).length;

  const freeDocks = Math.max(0, 6 - occupiedDocks);

  const totalPallets = receptions.reduce(
    (sum, reception) => sum + reception.pallets,
    0
  );

  const activeAlerts: string[] = [];

  receptions.forEach((reception) => {
    switch (reception.status) {
      case RECEPTION_STATUS.PLANNED:
        activeAlerts.push(
          `${reception.carrier} est encore planifié.`
        );
        break;

      case RECEPTION_STATUS.AT_DOCK:
        activeAlerts.push(
          `${reception.carrier} est actuellement à quai.`
        );
        break;

      case RECEPTION_STATUS.UNLOADING:
        activeAlerts.push(
          `${reception.carrier} est en cours de déchargement.`
        );
        break;

      case RECEPTION_STATUS.INSPECTION:
        activeAlerts.push(
          `${reception.carrier} attend une validation qualité.`
        );
        break;
    }
  });

  const priority =
    receptions.find(
      (r) => r.status !== RECEPTION_STATUS.COMPLETED
    ) || null;

  return {
    totalReceptions,
    occupiedDocks,
    freeDocks,
    totalPallets,
    activeAlerts,
    priority,
  };
}