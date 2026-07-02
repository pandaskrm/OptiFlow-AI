export function getWarehouseHealth() {
  return {
    status: "Excellent",
    score: 97,
    message:
      "L'activité est bien maîtrisée aujourd'hui. Les expéditions sont en avance et la préparation reste stable.",
  };
}

export function getPriorityAlert() {
  return {
    level: "Priorité haute",
    title: "Renfort recommandé en allée 12",
    message:
      "Le volume de commandes Chronopost est élevé. Je recommande d'ajouter 2 préparateurs en allée 12 avant 14h.",
    estimatedGain: "1 h 18",
  };
}