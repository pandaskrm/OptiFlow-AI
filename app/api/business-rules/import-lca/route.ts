import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../../lib/auth/session";
import { prisma } from "../../../../lib/prisma";

type RuleTemplate = {
  name: string;
  scope: "CLIENT" | "PAYS";
  targetValue: string;
  priority: "NORMALE" | "HAUTE" | "CRITIQUE";
  badge: string;
  workflow: string;
  explanation: string;
  checklist: string[];
  actions: string[];
};

function canManageRules(role: string) {
  return (
    role === "OWNER" ||
    role === "ADMIN" ||
    role === "LOGISTICS_MANAGER"
  );
}

const priorityCustomers = [
  "ALPHA",
  "E-LIQ",
  "HAPPESMOKE",
  "JA2D",
  "JFSVAP",
  "LIQUIDAROM DISTRIBUTION",
  "LVD",
  "MACHOU",
  "MACLOPE",
  "MMR France",
  "MPM",
  "MVM",
  "PALMEO VAPE",
  "R CONCEPT",
  "RAMIVA",
  "TRENDY CONNECT",
  "YOUVAPE / EMC",
];

const wholesaleCustomers = [
  "CLOPINETTE",
  "ECLOPEDISCOUNT",
  "JOSHNOACO",
  "GREENVILLAGE",
  "GROSSISTE FRANCOCHINE",
  "GFC PROVAP",
  "HDDB HOLDING",
  "LEMOTION",
  "KUMULUS VAPE",
  "NHA LOGISTIQUE LVP",
  "OREEGO",
  "PEEXWEB",
  "SAS ACROBAT",
  "SED",
  "VAPOSTORE",
  "ALAV",
  "LE PETIT VAPOTEUR",
  "TAKLOPE",
];

const exportRules: RuleTemplate[] = [
  {
    name: "Export Algérie",
    scope: "PAYS",
    targetValue: "ALGERIE",
    priority: "HAUTE",
    badge: "🌍 Export",
    workflow: "Procédure export Algérie",
    explanation:
      "Commande export nécessitant une procédure et un carton spécifiques.",
    checklist: [
      "Ajouter la facture",
      "Prévoir le carton Algérie",
      "Affecter Patrick ou Joël",
      "Contrôler les documents avant expédition",
    ],
    actions: [
      "ALERTER_RESPONSABLE",
      "GENERER_CHECKLIST_EXPORT",
    ],
  },
  {
    name: "Export Albanie",
    scope: "PAYS",
    targetValue: "ALBANIE",
    priority: "HAUTE",
    badge: "📄 Facture export",
    workflow: "Contrôle export",
    explanation:
      "Facture obligatoire avant validation de l'expédition.",
    checklist: [
      "Ajouter la facture",
      "Contrôler l'adresse",
      "Valider les documents export",
    ],
    actions: ["GENERER_CHECKLIST_EXPORT"],
  },
  {
    name: "Export Andorre",
    scope: "PAYS",
    targetValue: "ANDORRE",
    priority: "HAUTE",
    badge: "📄 Facture export",
    workflow: "Contrôle export",
    explanation:
      "Facture obligatoire avant validation de l'expédition.",
    checklist: [
      "Ajouter la facture",
      "Contrôler les documents export",
    ],
    actions: ["GENERER_CHECKLIST_EXPORT"],
  },
  {
    name: "Export Guyane",
    scope: "PAYS",
    targetValue: "GUYANE",
    priority: "HAUTE",
    badge: "🌍 DOM-TOM",
    workflow: "Expédition DOM-TOM",
    explanation:
      "Facture et contrôle export obligatoires.",
    checklist: [
      "Ajouter la facture",
      "Contrôler le nombre de colis",
      "Contrôler le poids",
    ],
    actions: ["GENERER_CHECKLIST_EXPORT"],
  },
  {
    name: "Export Guadeloupe",
    scope: "PAYS",
    targetValue: "GUADELOUPE",
    priority: "HAUTE",
    badge: "🌍 DOM-TOM",
    workflow: "Validation Joël",
    explanation:
      "Joël doit contrôler le nombre de colis et le poids.",
    checklist: [
      "Ajouter la facture",
      "Renseigner le nombre de colis",
      "Renseigner le poids",
      "Faire valider par Joël",
    ],
    actions: [
      "GENERER_CHECKLIST_EXPORT",
      "ALERTER_RESPONSABLE",
    ],
  },
  {
    name: "Export Madagascar",
    scope: "PAYS",
    targetValue: "MADAGASCAR",
    priority: "HAUTE",
    badge: "📄 Facture export",
    workflow: "Contrôle export",
    explanation:
      "Facture obligatoire avant expédition.",
    checklist: [
      "Ajouter la facture",
      "Contrôler les documents export",
    ],
    actions: ["GENERER_CHECKLIST_EXPORT"],
  },
  {
    name: "Export Maroc",
    scope: "PAYS",
    targetValue: "MAROC",
    priority: "HAUTE",
    badge: "📄 Facture export",
    workflow: "Contrôle export",
    explanation:
      "Facture obligatoire avant expédition.",
    checklist: [
      "Ajouter la facture",
      "Contrôler les documents export",
    ],
    actions: ["GENERER_CHECKLIST_EXPORT"],
  },
  {
    name: "Export Norvège",
    scope: "PAYS",
    targetValue: "NORVEGE",
    priority: "HAUTE",
    badge: "📄 Douane",
    workflow: "Procédure douanière",
    explanation:
      "Documents douaniers et facture obligatoires.",
    checklist: [
      "Ajouter la facture",
      "Ajouter les documents douaniers",
      "Valider avant expédition",
    ],
    actions: ["GENERER_CHECKLIST_EXPORT"],
  },
  {
    name: "Export Nouvelle-Calédonie",
    scope: "PAYS",
    targetValue: "NOUVELLE CALEDONIE",
    priority: "HAUTE",
    badge: "🌍 DOM-TOM",
    workflow: "Expédition DOM-TOM",
    explanation:
      "Facture et contrôle export obligatoires.",
    checklist: [
      "Ajouter la facture",
      "Contrôler les documents export",
    ],
    actions: ["GENERER_CHECKLIST_EXPORT"],
  },
  {
    name: "Export Réunion",
    scope: "PAYS",
    targetValue: "REUNION",
    priority: "HAUTE",
    badge: "🌍 DOM-TOM",
    workflow: "Expédition Réunion",
    explanation:
      "Facture obligatoire avant expédition.",
    checklist: [
      "Ajouter la facture",
      "Contrôler le nombre de colis",
      "Contrôler le poids",
    ],
    actions: ["GENERER_CHECKLIST_EXPORT"],
  },
  {
    name: "Réunion palette",
    scope: "PAYS",
    targetValue: "REUNION PALETTE",
    priority: "CRITIQUE",
    badge: "🔋 N3481",
    workflow: "Chronopost DOM-TOM palette",
    explanation:
      "Procédure palette Réunion avec étiquette spécifique.",
    checklist: [
      "Ajouter la facture",
      "Créer l'étiquette Chronopost DOM-TOM",
      "Ajouter l'étiquette N3481",
      "Contrôler la palette",
    ],
    actions: [
      "GENERER_CHECKLIST_EXPORT",
      "ALERTER_RESPONSABLE",
    ],
  },
  {
    name: "Export Tchéquie",
    scope: "PAYS",
    targetValue: "TCHEQUE",
    priority: "HAUTE",
    badge: "📄 Douane",
    workflow: "Documents douaniers",
    explanation:
      "Les documents douaniers sont obligatoires.",
    checklist: [
      "Ajouter la facture",
      "Ajouter le document douanier",
      "Valider avant expédition",
    ],
    actions: ["GENERER_CHECKLIST_EXPORT"],
  },
  {
    name: "Export Royaume-Uni",
    scope: "PAYS",
    targetValue: "ROYAUME-UNI",
    priority: "HAUTE",
    badge: "📄 Douane",
    workflow: "Procédure Royaume-Uni",
    explanation:
      "Facture et documents douaniers obligatoires.",
    checklist: [
      "Ajouter la facture",
      "Ajouter les documents douaniers",
      "Contrôler l'adresse",
      "Valider avant expédition",
    ],
    actions: ["GENERER_CHECKLIST_EXPORT"],
  },
  {
    name: "Export Saint-Marin",
    scope: "PAYS",
    targetValue: "SAN MARIN",
    priority: "HAUTE",
    badge: "📄 Facture export",
    workflow: "Contrôle export",
    explanation:
      "Facture obligatoire avant expédition.",
    checklist: [
      "Ajouter la facture",
      "Contrôler les documents export",
    ],
    actions: ["GENERER_CHECKLIST_EXPORT"],
  },
  {
    name: "Export Suisse",
    scope: "PAYS",
    targetValue: "SUISSE",
    priority: "CRITIQUE",
    badge: "📄 Douane",
    workflow: "Procédure douanière Suisse",
    explanation:
      "Facture et documents douaniers obligatoires.",
    checklist: [
      "Ajouter la facture",
      "Ajouter les documents douaniers",
      "Contrôler la valeur déclarée",
      "Valider avant expédition",
    ],
    actions: [
      "GENERER_CHECKLIST_EXPORT",
      "ALERTER_RESPONSABLE",
    ],
  },
];

const clientSpecificRules: RuleTemplate[] = [
  {
    name: "Questionnaire Vapo Premium",
    scope: "CLIENT",
    targetValue: "VAPO PREMIUM",
    priority: "HAUTE",
    badge: "📋 Questionnaire",
    workflow: "Questionnaire obligatoire",
    explanation:
      "Le questionnaire doit être complété avant l'expédition.",
    checklist: [
      "Ajouter la facture",
      "Compléter le questionnaire",
      "Valider les informations",
    ],
    actions: ["GENERER_CHECKLIST_CLIENT"],
  },
  {
    name: "Facture Caza Vape",
    scope: "CLIENT",
    targetValue: "CAZA VAPE",
    priority: "HAUTE",
    badge: "📄 Facture",
    workflow: "Contrôle facture",
    explanation:
      "Une facture doit accompagner cette commande.",
    checklist: [
      "Ajouter la facture",
      "Contrôler les informations client",
    ],
    actions: ["GENERER_CHECKLIST_CLIENT"],
  },
];

function createPriorityRule(
  customer: string,
): RuleTemplate {
  return {
    name: "Client prioritaire",
    scope: "CLIENT",
    targetValue: customer,
    priority: "CRITIQUE",
    badge: "⭐ Prioritaire",
    workflow: "Préparation prioritaire",
    explanation:
      "Client à traiter en priorité dans la file de préparation.",
    checklist: [
      "Contrôler l'heure de commande",
      "Prioriser la préparation",
      "Surveiller l'expédition",
    ],
    actions: [
      "PRIORISER_COMMANDE",
      "ALERTER_LIBOT",
    ],
  };
}

function createWholesaleRule(
  customer: string,
): RuleTemplate {
  return {
    name: "Client grossiste",
    scope: "CLIENT",
    targetValue: customer,
    priority: "HAUTE",
    badge: "📦 Grossiste",
    workflow:
      "Préparation palette et demande d'enlèvement Hall Solutions",
    explanation:
      "Grosse commande sans délai standard nécessitant une préparation palette.",
    checklist: [
      "Contrôler le nombre de palettes",
      "Contrôler le nombre de colis",
      "Contrôler le poids",
      "Préparer la demande d'enlèvement Hall Solutions",
    ],
    actions: [
      "CREER_DEMANDE_ENLEVEMENT",
      "PREPARATION_PALETTE",
    ],
  };
}

export async function POST() {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json(
      { error: "Non authentifié." },
      { status: 401 },
    );
  }

  if (!canManageRules(session.membership.role)) {
    return NextResponse.json(
      { error: "Droits insuffisants." },
      { status: 403 },
    );
  }

  const templates: RuleTemplate[] = [
    ...priorityCustomers.map(createPriorityRule),
    ...wholesaleCustomers.map(createWholesaleRule),
    ...exportRules,
    ...clientSpecificRules,
  ];

  let created = 0;
  let updated = 0;

  for (const template of templates) {
    const existing =
      await prisma.businessRule.findUnique({
        where: {
          companyId_scope_targetValue_name: {
            companyId: session.company.id,
            scope: template.scope,
            targetValue: template.targetValue,
            name: template.name,
          },
        },
      });

    await prisma.businessRule.upsert({
      where: {
        companyId_scope_targetValue_name: {
          companyId: session.company.id,
          scope: template.scope,
          targetValue: template.targetValue,
          name: template.name,
        },
      },
      create: {
        companyId: session.company.id,
        ...template,
        checklist: template.checklist,
        actions: template.actions,
        isActive: true,
      },
      update: {
        priority: template.priority,
        badge: template.badge,
        workflow: template.workflow,
        explanation: template.explanation,
        checklist: template.checklist,
        actions: template.actions,
        isActive: true,
      },
    });

    if (existing) {
      updated += 1;
    } else {
      created += 1;
    }
  }

  await prisma.auditLog.create({
    data: {
      companyId: session.company.id,
      actorId: session.user.id,
      action: "LCA_BUSINESS_RULES_IMPORTED",
      entityType: "BusinessRule",
      details: JSON.stringify({
        total: templates.length,
        created,
        updated,
      }),
    },
  });

  const rules = await prisma.businessRule.findMany({
    where: {
      companyId: session.company.id,
    },
    orderBy: [
      {
        isActive: "desc",
      },
      {
        scope: "asc",
      },
      {
        targetValue: "asc",
      },
    ],
  });

  return NextResponse.json({
    success: true,
    message: `${created} règles créées et ${updated} règles actualisées.`,
    created,
    updated,
    rules,
  });
}
