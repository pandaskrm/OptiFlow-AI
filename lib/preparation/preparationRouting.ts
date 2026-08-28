export const PREPARATION_GROUPS = [
  "GROSSISTE",
  "EXPERT",
  "CONFIRME",
  "STANDARD",
] as const;

export type PreparationGroup =
  (typeof PREPARATION_GROUPS)[number];

export type PreparationObligation =
  | "FACTURE"
  | "QUESTIONNAIRE_DOUANE"
  | "DOCUMENT_DOUANE"
  | "CHRONO_EXPRESS"
  | "ETIQUETTE_N3481";

export type PreparationPriorityReason =
  | "CLIENT_PRIORITAIRE"
  | "CARTE_BANCAIRE"
  | "PRIORITE_ERP"
  | "REGLE_METIER";

export type BusinessRuleLike = {
  id?: string;
  name: string;
  scope: string;
  targetValue: string;
  priority?: string | null;
  badge?: string | null;
  workflow?: string | null;
  explanation?: string | null;
  checklist?: unknown;
  actions?: unknown;
  isActive?: boolean;
};

export type PreparationRoutingInput = {
  customer?: string | null;
  customerCode?: string | null;
  country?: string | null;
  carrier?: string | null;
  paymentMethod?: string | null;
  priority?: string | null;

  totalLines?: number | null;
  totalQuantity?: number | null;
};

export type PreparationRoutingResult = {
  group: PreparationGroup;

  isPriority: boolean;
  priorityReasons: PreparationPriorityReason[];

  obligations: PreparationObligation[];

  checklist: string[];
  actions: string[];
  specialInstructions: string[];

  priorityScore: number;
  reasons: string[];

  requiresManualClassification: boolean;

  matchedRuleIds: string[];
  matchedRuleNames: string[];
};

function normalize(
  value?: string | null,
) {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("fr-FR")
    .replace(/[’']/g, " ")
    .replace(/[-_/]/g, " ")
    .replace(/\s+/g, " ");
}

function readStringArray(
  value: unknown,
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is string =>
      typeof item === "string",
  );
}

function containsAny(
  value: string,
  terms: string[],
) {
  return terms.some((term) =>
    value.includes(
      normalize(term),
    ),
  );
}

function ruleMatches(
  rule: BusinessRuleLike,
  input: PreparationRoutingInput,
) {
  if (rule.isActive === false) {
    return false;
  }

  const scope =
    normalize(rule.scope);

  const target =
    normalize(rule.targetValue);

  if (!target) {
    return false;
  }

  if (scope === "client") {
    const customer =
      normalize(input.customer);

    const customerCode =
      normalize(input.customerCode);

    return (
      customer === target ||
      customer.includes(target) ||
      customerCode === target
    );
  }

  if (scope === "pays") {
    const country =
      normalize(input.country);

    return (
      country === target ||
      country.includes(target)
    );
  }

  if (scope === "transporteur") {
    const carrier =
      normalize(input.carrier);

    return (
      carrier === target ||
      carrier.includes(target)
    );
  }

  return false;
}

function ruleContains(
  rule: BusinessRuleLike,
  terms: string[],
) {
  const text = normalize(
    [
      rule.name,
      rule.badge,
      rule.workflow,
      rule.explanation,
      ...readStringArray(
        rule.checklist,
      ),
      ...readStringArray(
        rule.actions,
      ),
    ]
      .filter(Boolean)
      .join(" "),
  );

  return containsAny(
    text,
    terms,
  );
}

function addUnique(
  target: string[],
  values: string[],
) {
  for (const value of values) {
    if (!target.includes(value)) {
      target.push(value);
    }
  }
}

export function routePreparationOrder(
  input: PreparationRoutingInput,
  businessRules: BusinessRuleLike[],
): PreparationRoutingResult {
  const activeRules =
    businessRules.filter(
      (rule) =>
        rule.isActive !== false,
    );

  const matchedRules =
    activeRules.filter(
      (rule) =>
        ruleMatches(
          rule,
          input,
        ),
    );

  const obligations:
    PreparationObligation[] = [];

  const checklist: string[] = [];
  const actions: string[] = [];

  const specialInstructions:
    string[] = [];

  const priorityReasons:
    PreparationPriorityReason[] = [];

  const reasons: string[] = [];

  let group:
    PreparationGroup =
    "STANDARD";

  let priorityScore = 0;

  let requiresManualClassification =
    false;

  /*
   * ==========================================================
   * 1. REGLES ORGANIA EXISTANTES
   * ==========================================================
   */

  const wholesaleRule =
    matchedRules.find(
      (rule) =>
        ruleContains(
          rule,
          [
            "client grossiste",
            "grossiste",
            "preparation palette",
          ],
        ),
    );

  const priorityClientRule =
    matchedRules.find(
      (rule) =>
        ruleContains(
          rule,
          [
            "client prioritaire",
            "preparation prioritaire",
            "prioriser commande",
          ],
        ),
    );

  /*
   * ==========================================================
   * 2. GROUPE DE PREPARATION
   *
   * Un grossiste reste grossiste quelle que soit sa taille.
   * Sinon les règles de volume s'appliquent.
   * ==========================================================
   */

  if (wholesaleRule) {
    group = "GROSSISTE";

    priorityScore += 30;

    reasons.push(
      `Règle OrganIA : ${wholesaleRule.name}.`,
    );
  } else {
    const totalLines =
      typeof input.totalLines ===
      "number"
        ? input.totalLines
        : null;

    const totalQuantity =
      typeof input.totalQuantity ===
      "number"
        ? input.totalQuantity
        : null;

    if (
      totalLines !== null &&
      totalQuantity !== null
    ) {
      if (
        totalLines < 100 &&
        totalQuantity < 1000
      ) {
        group = "CONFIRME";

        reasons.push(
          "Commande Confirmée : moins de 100 lignes et moins de 1 000 unités.",
        );
      } else if (
        totalLines > 100 &&
        totalQuantity > 1000
      ) {
        group = "EXPERT";

        priorityScore += 10;

        reasons.push(
          "Commande Expert : plus de 100 lignes et plus de 1 000 unités.",
        );
      } else {
        requiresManualClassification =
          true;

        reasons.push(
          "Volume hors règle Confirmé/Expert : classification à confirmer.",
        );
      }
    } else {
      requiresManualClassification =
        true;

      reasons.push(
        "Lignes ou quantité indisponibles : classification à confirmer.",
      );
    }
  }

  /*
   * ==========================================================
   * 3. CLIENTS PRIORITAIRES
   * ==========================================================
   */

  if (priorityClientRule) {
    priorityReasons.push(
      "CLIENT_PRIORITAIRE",
    );

    priorityScore += 100;

    reasons.push(
      `Priorité OrganIA : ${priorityClientRule.targetValue}.`,
    );
  }

  /*
   * ==========================================================
   * 4. PRIORITE CARTE BANCAIRE
   * ==========================================================
   */

  const paymentMethod =
    normalize(
      input.paymentMethod,
    );

  if (
    containsAny(
      paymentMethod,
      [
        "carte bancaire",
        "cb",
        "credit card",
      ],
    )
  ) {
    priorityReasons.push(
      "CARTE_BANCAIRE",
    );

    priorityScore += 80;

    reasons.push(
      "Paiement carte bancaire : commande prioritaire.",
    );
  }

  /*
   * ==========================================================
   * 5. PRIORITE ERP
   * ==========================================================
   */

  const erpPriority =
    normalize(input.priority);

  if (
    containsAny(
      erpPriority,
      [
        "urgente",
        "urgent",
        "critique",
        "haute",
      ],
    )
  ) {
    priorityReasons.push(
      "PRIORITE_ERP",
    );

    priorityScore += 50;

    reasons.push(
      "Priorité élevée remontée par l'ERP.",
    );
  }

  /*
   * ==========================================================
   * 6. TRANSFORMATION DES BUSINESS RULES EN ALERTES PDA
   * ==========================================================
   */

  for (const rule of matchedRules) {
    const ruleChecklist =
      readStringArray(
        rule.checklist,
      );

    const ruleActions =
      readStringArray(
        rule.actions,
      );

    addUnique(
      checklist,
      ruleChecklist,
    );

    addUnique(
      actions,
      ruleActions,
    );

    const rulePriority =
      normalize(
        rule.priority,
      );

    if (
      rulePriority ===
      "critique"
    ) {
      priorityScore += 40;

      priorityReasons.push(
        "REGLE_METIER",
      );
    } else if (
      rulePriority === "haute"
    ) {
      priorityScore += 20;
    }

    if (
      ruleContains(
        rule,
        ["facture"],
      )
    ) {
      obligations.push(
        "FACTURE",
      );
    }

    if (
      ruleContains(
        rule,
        [
          "questionnaire",
        ],
      )
    ) {
      obligations.push(
        "QUESTIONNAIRE_DOUANE",
      );
    }

    if (
      ruleContains(
        rule,
        [
          "document douanier",
          "documents douaniers",
          "document douane",
        ],
      )
    ) {
      obligations.push(
        "DOCUMENT_DOUANE",
      );
    }

    if (
      ruleContains(
        rule,
        [
          "n3481",
        ],
      )
    ) {
      obligations.push(
        "ETIQUETTE_N3481",
      );
    }

    if (
      ruleContains(
        rule,
        [
          "chrono express",
          "chronopost",
          "chrono dom tom",
        ],
      )
    ) {
      obligations.push(
        "CHRONO_EXPRESS",
      );
    }

    if (
      rule.explanation
    ) {
      specialInstructions.push(
        rule.explanation,
      );
    }
  }

  return {
    group,

    isPriority:
      priorityReasons.length > 0,

    priorityReasons:
      [...new Set(
        priorityReasons,
      )],

    obligations:
      [...new Set(
        obligations,
      )],

    checklist,

    actions,

    specialInstructions:
      [...new Set(
        specialInstructions,
      )],

    priorityScore,

    reasons,

    requiresManualClassification,

    matchedRuleIds:
      matchedRules
        .map((rule) => rule.id)
        .filter(
          (id): id is string =>
            Boolean(id),
        ),

    matchedRuleNames:
      matchedRules.map(
        (rule) => rule.name,
      ),
  };
}
