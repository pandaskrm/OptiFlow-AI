import { calculateHealthScore } from "./healthScore";

export type WarehouseState = {
  health: {
    score: number;
    status: string;
  };
  alerts: string[];
  priorities: string[];
  aiAdvice: string;
  productivity: number;
};

export function getWarehouseState(): WarehouseState {
  // Données simulées (elles seront remplacées plus tard
  // par les vraies données SQLite)
  const pendingReceptions = 18;
  const saturatedDocks = 1;
  const productivity = 91;
  const criticalAlerts = 1;

  const health = calculateHealthScore({
    pendingReceptions,
    saturatedDocks,
    productivity,
    criticalAlerts,
  });

  return {
    health,

    alerts: [
      "Quai 2 proche de la saturation",
      "18 réceptions en attente",
    ],

    priorities: [
      "Décharger le camion DHL avant 14h",
      "Réaffecter une équipe au quai 2",
    ],

    aiAdvice:
      "Déplacer un collaborateur pendant 45 minutes permettrait de réduire le retard estimé.",

    productivity,
  };
}