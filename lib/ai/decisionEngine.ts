import type { SimulationStateV2 } from "../simulation/simulationTypesV2";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function isSimulationStateV2(value: unknown): value is SimulationStateV2 {
  if (!isRecord(value)) return false;

  return (
    typeof value.running === "boolean" &&
    typeof value.scenario === "string" &&
    isRecord(value.preparation) &&
    isRecord(value.receptions) &&
    isRecord(value.shipping) &&
    isRecord(value.stock) &&
    isRecord(value.docks) &&
    isRecord(value.kpis) &&
    Array.isArray(value.alerts) &&
    Array.isArray(value.aiRecommendations)
  );
}

export function buildDecisionContext(
  simulationState: unknown,
): string {
  if (!isSimulationStateV2(simulationState)) {
    return "";
  }

  const {
    preparation,
    receptions,
    shipping,
    stock,
    docks,
    kpis,
    alerts,
    aiRecommendations,
  } = simulationState;

  const facts = [
    `Preparation: ${preparation.waitingOrders} en attente, ${preparation.activeOrders} actives, ${preparation.completedOrders} terminees, progression ${preparation.pickingProgress} %, ${preparation.activePickers} preparateurs actifs, ${preparation.absentPickers} absents.`,
    `Receptions: ${receptions.planned} planifiees, ${receptions.atDock} a quai, ${receptions.unloading} en dechargement, ${receptions.completed} terminees, ${receptions.palletsReceived} palettes recues.`,
    `Expeditions: ${shipping.waitingShipments} en attente, ${shipping.loadingShipments} en chargement, ${shipping.completedShipments} terminees, ${shipping.delayedShipments} en retard.`,
    `Stock: ${stock.stockouts} ruptures, ${stock.lowStockReferences} references basses, precision ${stock.inventoryAccuracy} %.`,
    `Quais: ${docks.occupied}/${docks.total} occupes, ${docks.available} disponibles, ${docks.trucksWaiting} camions en attente.`,
    `KPI: taux service ${kpis.serviceRate} %, productivite ${kpis.productivity}, sante entrepot ${kpis.warehouseHealth}/100.`,
  ];

  const explicitAlerts = alerts.map(
    (alert) =>
      `[${alert.level}] ${alert.title}: ${alert.message}`,
  );

  const explicitRecommendations = aiRecommendations.map(
    (recommendation) =>
      `[${recommendation.priority}] ${recommendation.title}: ${recommendation.message}`,
  );

  return `
### DECISION ENGINE V1 ###

Les informations suivantes sont extraites directement de l'instantane courant.

FAITS COURANTS
${facts.map((fact) => `- ${fact}`).join("\n")}

ALERTES EXPLICITES
${
  explicitAlerts.length > 0
    ? explicitAlerts.map((alert) => `- ${alert}`).join("\n")
    : "- Aucune alerte explicite."
}

RECOMMANDATIONS EXPLICITES
${
  explicitRecommendations.length > 0
    ? explicitRecommendations
        .map((recommendation) => `- ${recommendation}`)
        .join("\n")
    : "- Aucune recommandation explicite."
}

REGLES DE DECISION
- Les FAITS ci-dessus peuvent etre affirmes.
- Une ALERTE explicite peut etre citee comme alerte du systeme.
- Une RECOMMANDATION explicite peut etre proposee comme action.
- L'absence de recommandation explicite n'autorise pas a inventer une procedure technique.
- Une anomalie visible peut etre localisee a partir des KPI.
- Une cause racine ne peut etre affirmee que si elle est explicitement fournie.
- Si la cause n'est pas connue, recommander une verification operationnelle generale.
- Ne jamais inventer de procedure WMS, ERP, RF, allocation, vague, mission, verrou, hold ou logs.

### FIN DECISION ENGINE V1 ###
`.trim();
}

export function buildSafeDecisionInstruction(
  simulationState: unknown,
  asksForDecision: boolean,
): string {
  if (!asksForDecision || !isSimulationStateV2(simulationState)) {
    return "";
  }

  const state = simulationState;

  const explicitRecommendations = state.aiRecommendations
    .map((recommendation) => recommendation.message?.trim())
    .filter((message): message is string => Boolean(message));

  const recommendationBlock =
    explicitRecommendations.length > 0
      ? `
RECOMMANDATIONS EXPLICITES AUTORISEES
${explicitRecommendations.map((message) => `- ${message}`).join("\n")}
`
      : `
AUCUNE RECOMMANDATION TECHNIQUE EXPLICITE N'EST DISPONIBLE.
`;

  return `
### DECISION GUARD V1 ###

L'utilisateur demande quoi faire.

Tu dois fonder ta reponse uniquement sur :
1. les faits de l'instantane courant ;
2. les recommandations explicitement presentes dans cet instantane.

${recommendationBlock}

REGLE ABSOLUE

Si la cause racine n'est pas explicitement presente dans les donnees :
- dis que la cause n'est pas encore connue ;
- recommande une verification operationnelle generale du blocage ;
- recommande ensuite de suivre les KPI concernes pour mesurer l'effet.

INTERDICTIONS

Sans preuve explicite dans les donnees, ne mentionne PAS :
- allocation WMS ;
- vague ou mini-vague ;
- lignes allouees ;
- RF ;
- missions ou taches WMS ;
- zones ou emplacements en hold ;
- regles de liberation ;
- UM ;
- logs ou journaux d'allocation ;
- reapprovisionnement ;
- manipulation ERP/WMS specifique.

Une hypothese technique n'est PAS une action autorisee.

Ne transforme jamais une possibilite technique en procedure de diagnostic.

Si aucune action technique precise n'est prouvee, reste volontairement general :
"verifier sur le terrain ce qui bloque la preparation"
est correct.

### FIN DECISION GUARD V1 ###
`.trim();
}

export function buildDeterministicDecisionAnswer(
  simulationState: unknown,
): string | null {
  if (!isSimulationStateV2(simulationState)) {
    return null;
  }

  const {
    preparation,
    receptions,
    shipping,
    stock,
    docks,
  } = simulationState;

  if (
    preparation.waitingOrders > 0 &&
    preparation.pickingProgress === 0
  ) {
    return [
      `Démonstration - la préparation est le point à traiter : ${preparation.waitingOrders} commandes en attente, ${preparation.activeOrders} actives et ${preparation.pickingProgress}% de progression avec ${preparation.activePickers} préparateurs actifs.`,
      `La cause racine n'est pas déterminée par les données disponibles.`,
      `À ta place, je vérifierais d'abord sur le terrain ce qui empêche les commandes actives d'avancer. Une fois le blocage identifié, j'agirais sur la cause réellement constatée, puis je suivrais la progression du picking et la baisse du backlog.`
    ].join("\n\n");
  }

  if (shipping.delayedShipments > 0) {
    return [
      `Démonstration - l'expédition demande l'attention : ${shipping.delayedShipments} expédition(s) en retard et ${shipping.waitingShipments} en attente.`,
      `À ta place, je sécuriserais d'abord les expéditions réellement en retard, puis je vérifierais leur cause opérationnelle avant toute action technique.`,
      `Je suivrais ensuite la diminution des retards et de la file d'attente.`
    ].join("\n\n");
  }

  if (stock.stockouts > 0) {
    return [
      `Démonstration - le stock présente ${stock.stockouts} rupture(s) et ${stock.lowStockReferences} référence(s) en stock faible.`,
      `À ta place, je traiterais d'abord les ruptures réellement constatées et j'identifierais les références concernées avant de décider de l'action corrective.`,
      `Je surveillerais ensuite le retour à disponibilité.`
    ].join("\n\n");
  }

  if (docks.trucksWaiting > 0) {
    return [
      `Démonstration - ${docks.trucksWaiting} camion(s) attendent et ${docks.available} quai(s) sont disponibles sur ${docks.total}.`,
      `À ta place, je vérifierais la raison opérationnelle de cette attente et j'utiliserais les quais disponibles lorsque les contraintes réelles le permettent.`,
      `Je suivrais ensuite la baisse de la file d'attente.`
    ].join("\n\n");
  }

  if (receptions.unloading > 0) {
    return [
      `Démonstration - ${receptions.unloading} réception(s) sont en déchargement et ${receptions.completed} sont terminées.`,
      `Je laisserais le flux réception poursuivre son traitement et je surveillerais les éventuels écarts avant d'intervenir.`,
      `Aucune action technique spécifique n'est justifiée par les données actuelles.`
    ].join("\n\n");
  }

  return [
    `Démonstration - aucun blocage majeur ne ressort des indicateurs disponibles.`,
    `À ta place, je maintiendrais l'organisation actuelle et je surveillerais l'évolution des principaux KPI.`,
    `Je n'engagerais pas d'action corrective sans anomalie réellement constatée.`
  ].join("\n\n");
}
