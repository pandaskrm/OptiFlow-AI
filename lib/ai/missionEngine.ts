export type AiMissionPriority =
  | "CRITICAL"
  | "HIGH"
  | "MEDIUM"
  | "LOW";

export type AiMissionCategory =
  | "RECEPTION"
  | "PREPARATION"
  | "SHIPPING"
  | "STOCK"
  | "WORKFORCE"
  | "GENERAL";

export type AiMission = {
  id: string;
  priority: AiMissionPriority;
  category: AiMissionCategory;
  title: string;
  explanation: string;
  impact: string;
  recommendedAction: string;
  estimatedGain: string;
};

type MissionEngineInput = {
  dataConnected: boolean;
  simulationRunning: boolean;
  healthScore: number;
  occupiedDocks: number;
  totalDocks?: number;
  receptions: {
    planned: number;
    active: number;
    late: number;
    completed: number;
  };
  orders: {
    waiting: number;
    inPreparation: number;
    priority: number;
    progress: number;
  };
  shipments: {
    waiting: number;
    ready: number;
    progress: number;
  };
  inventory: {
    lowStockReferences: number;
    unavailableReferences: number;
  };
  workforce: {
    absent: number;
    present: number;
    productivity: number;
  };
  alerts?: string[];
  recommendations?: string[];
};

const PRIORITY_WEIGHT: Record<AiMissionPriority, number> = {
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

export function generateAiMissions(
  input: MissionEngineInput,
): AiMission[] {
  if (!input.dataConnected && !input.simulationRunning) {
    return [];
  }

  const missions: AiMission[] = [];
  const totalDocks = Math.max(1, input.totalDocks ?? 6);
  const dockOccupationRate =
    (input.occupiedDocks / totalDocks) * 100;

  if (input.inventory.unavailableReferences > 0) {
    missions.push({
      id: "stock-unavailable",
      priority: "CRITICAL",
      category: "STOCK",
      title: "Références indisponibles",
      explanation:
        `${input.inventory.unavailableReferences} référence(s) ne disposent plus de stock disponible.`,
      impact:
        "Risque immédiat de commandes bloquées et de baisse du taux de service.",
      recommendedAction:
        "Identifier les commandes concernées et lancer une action de réapprovisionnement prioritaire.",
      estimatedGain:
        "Réduction du risque de rupture et des retards clients.",
    });
  }

  if (input.receptions.late > 0) {
    missions.push({
      id: "receptions-late",
      priority:
        input.receptions.late >= 3 ? "CRITICAL" : "HIGH",
      category: "RECEPTION",
      title: "Réceptions en retard",
      explanation:
        `${input.receptions.late} réception(s) dépassent leur horaire planifié.`,
      impact:
        "Risque de saturation des quais et de décalage des opérations suivantes.",
      recommendedAction:
        "Contacter les transporteurs et réorganiser les créneaux de quai.",
      estimatedGain:
        "Jusqu’à 30 minutes économisées sur le planning.",
    });
  }

  if (dockOccupationRate >= 80) {
    missions.push({
      id: "docks-saturation",
      priority:
        dockOccupationRate >= 100 ? "CRITICAL" : "HIGH",
      category: "RECEPTION",
      title: "Saturation prochaine des quais",
      explanation:
        `${input.occupiedDocks}/${totalDocks} quais sont actuellement occupés.`,
      impact:
        "Les prochains camions risquent d’attendre avant leur prise en charge.",
      recommendedAction:
        "Libérer en priorité le quai dont l’opération est la plus proche de la fin.",
      estimatedGain:
        "Réduction du temps d’attente transporteur.",
    });
  }

  if (input.orders.priority > 0) {
    missions.push({
      id: "priority-orders",
      priority:
        input.orders.priority >= 5 ? "HIGH" : "MEDIUM",
      category: "PREPARATION",
      title: "Commandes prioritaires à traiter",
      explanation:
        `${input.orders.priority} commande(s) sont actuellement identifiées comme prioritaires.`,
      impact:
        "Un traitement tardif peut dégrader le taux de service.",
      recommendedAction:
        "Affecter les ressources les plus disponibles aux commandes prioritaires.",
      estimatedGain:
        "Amélioration du respect des délais clients.",
    });
  }

  if (
    input.orders.waiting > 0 &&
    input.orders.progress < 60
  ) {
    missions.push({
      id: "preparation-delay",
      priority:
        input.orders.waiting >= 20 ? "HIGH" : "MEDIUM",
      category: "PREPARATION",
      title: "Retard potentiel en préparation",
      explanation:
        `${input.orders.waiting} commande(s) attendent avec une progression globale de ${input.orders.progress}%.`,
      impact:
        "Les expéditions planifiées peuvent être retardées.",
      recommendedAction:
        "Renforcer temporairement la préparation et traiter les commandes par heure limite.",
      estimatedGain:
        "Accélération du flux de préparation.",
    });
  }

  if (
    input.shipments.waiting > 0 &&
    input.shipments.progress < 70
  ) {
    missions.push({
      id: "shipping-backlog",
      priority:
        input.shipments.waiting >= 10 ? "HIGH" : "MEDIUM",
      category: "SHIPPING",
      title: "Expéditions en attente",
      explanation:
        `${input.shipments.waiting} expédition(s) attendent leur traitement.`,
      impact:
        "Risque de départs transporteurs hors délai.",
      recommendedAction:
        "Prioriser les expéditions selon l’heure de départ du transporteur.",
      estimatedGain:
        "Réduction des départs tardifs.",
    });
  }

  if (input.inventory.lowStockReferences > 0) {
    missions.push({
      id: "stock-low",
      priority:
        input.inventory.lowStockReferences >= 10
          ? "HIGH"
          : "MEDIUM",
      category: "STOCK",
      title: "Stocks sous le seuil minimum",
      explanation:
        `${input.inventory.lowStockReferences} référence(s) sont sous leur seuil minimum.`,
      impact:
        "Risque de rupture dans les prochaines opérations.",
      recommendedAction:
        "Analyser les besoins à venir et préparer les demandes de réapprovisionnement.",
      estimatedGain:
        "Anticipation des ruptures de stock.",
    });
  }

  if (input.workforce.absent > 0) {
    missions.push({
      id: "workforce-absence",
      priority:
        input.workforce.absent >= 3 ? "HIGH" : "MEDIUM",
      category: "WORKFORCE",
      title: "Effectif réduit",
      explanation:
        `${input.workforce.absent} collaborateur(s) sont absents.`,
      impact:
        "La capacité opérationnelle peut être inférieure à la charge prévue.",
      recommendedAction:
        "Rééquilibrer les équipes entre réception, préparation et expédition.",
      estimatedGain:
        "Maintien de la continuité opérationnelle.",
    });
  }

  if (input.healthScore > 0 && input.healthScore < 60) {
    missions.push({
      id: "warehouse-health",
      priority: "HIGH",
      category: "GENERAL",
      title: "Santé opérationnelle dégradée",
      explanation:
        `Le score de santé de l’entrepôt est de ${input.healthScore}%.`,
      impact:
        "Plusieurs indicateurs nécessitent une action coordonnée.",
      recommendedAction:
        input.recommendations?.[0] ??
        "Traiter d’abord la mission critique placée en tête de liste.",
      estimatedGain:
        "Retour progressif à une activité maîtrisée.",
    });
  }

  if (missions.length === 0) {
    missions.push({
      id: "operations-stable",
      priority: "LOW",
      category: "GENERAL",
      title: "Situation opérationnelle stable",
      explanation:
        "Aucun risque important n’est détecté actuellement.",
      impact:
        "Les opérations peuvent continuer selon le planning prévu.",
      recommendedAction:
        input.recommendations?.[0] ??
        "Maintenir la surveillance des indicateurs principaux.",
      estimatedGain:
        "Préservation du niveau de service.",
    });
  }

  return missions
    .sort(
      (a, b) =>
        PRIORITY_WEIGHT[b.priority] -
        PRIORITY_WEIGHT[a.priority],
    )
    .slice(0, 5);
}
