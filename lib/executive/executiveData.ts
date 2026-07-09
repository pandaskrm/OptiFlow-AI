export const executiveStats = {
  warehouseHealth: 94,
  serviceRate: 98,
  productivity: 112,
  alerts: 3,
  receptions: 18,
  preparations: 486,
  shipments: 312,
  delayedOrders: 7,
};

export const executiveOperations = [
  {
    module: "Réception",
    status: "Stable",
    score: 91,
    volume: "18 réceptions",
    insight: "Flux réception maîtrisé, aucun retard critique.",
  },
  {
    module: "Préparation",
    status: "Vigilance",
    score: 88,
    volume: "486 commandes",
    insight: "Charge élevée sur les allées 9 à 12.",
  },
  {
    module: "Expédition",
    status: "Stable",
    score: 93,
    volume: "312 expéditions",
    insight: "Départs transporteurs sous contrôle.",
  },
  {
    module: "Équipe",
    status: "Vigilance",
    score: 86,
    volume: "2 absents",
    insight: "Renfort recommandé sur le pic du matin.",
  },
];

export const executiveDecisions = [
  {
    priority: "Haute",
    title: "Renforcer la préparation",
    message: "Affecter 1 personne supplémentaire aux allées 9 à 12 jusqu'à 11h.",
    impact: "Gain estimé : 35 minutes",
  },
  {
    priority: "Moyenne",
    title: "Sécuriser Chronopost",
    message: "Finaliser les commandes transport urgent avant 13h30.",
    impact: "Réduction du risque de retard client",
  },
  {
    priority: "Basse",
    title: "Lisser la charge",
    message: "Reporter les commandes non urgentes après le pic du matin.",
    impact: "Meilleure fluidité opérationnelle",
  },
];