export type DemoStationModule =
  | "briefing"
  | "team"
  | "mail"
  | "reception"
  | "stock"
  | "preparation"
  | "ai"
  | "shipping"
  | "executive";

export interface DemoStationStep {
  id: number;
  time: string;
  module: DemoStationModule;
  icon: string;
  title: string;
  explanation: string;
  libot: string;
  accent: "cyan" | "violet" | "emerald" | "amber" | "rose";
}

export const demoStationSteps: DemoStationStep[] = [
  {
    id: 1,
    time: "08:00",
    module: "briefing",
    icon: "🌅",
    title: "Briefing opérationnel",
    explanation:
      "OptiFlow AI commence la journée avec une vision immédiate des effectifs, de la charge et des priorités.",
    libot:
      "Bonjour. 49 collaborateurs sont planifiés : 10 magasiniers, 1 SAV, 2 au laboratoire et 36 préparateurs. Je vais suivre la capacité opérationnelle pendant toute la journée.",
    accent: "cyan",
  },
  {
    id: 2,
    time: "08:10",
    module: "team",
    icon: "👥",
    title: "Module Équipe",
    explanation:
      "Le module Équipe suit les présences, les absences, les affectations et la capacité disponible par service.",
    libot:
      "Les équipes sont opérationnelles. La préparation dispose actuellement de la capacité nécessaire pour absorber la charge prévue.",
    accent: "violet",
  },
  {
    id: 3,
    time: "08:24",
    module: "mail",
    icon: "📧",
    title: "Mail Intelligence",
    explanation:
      "OptiFlow analyse les e-mails opérationnels, identifie les arrivages et exploite automatiquement les informations utiles.",
    libot:
      "Un nouvel e-mail contenant le mot-clé Arrivage vient d'être détecté. J'analyse maintenant son contenu et les informations associées.",
    accent: "cyan",
  },
  {
    id: 4,
    time: "08:31",
    module: "reception",
    icon: "📥",
    title: "Module Réception",
    explanation:
      "La Réception centralise les arrivages, les quais, les contrôles et le suivi jusqu'à la clôture.",
    libot:
      "L'arrivage est identifié. La réception peut être planifiée et affectée au quai disponible le plus adapté.",
    accent: "emerald",
  },
  {
    id: 5,
    time: "09:05",
    module: "stock",
    icon: "📦",
    title: "Module Stock",
    explanation:
      "Le Stock donne une vision des références, disponibilités, mouvements, ruptures et emplacements.",
    libot:
      "La réception terminée alimente le stock. Les nouvelles disponibilités peuvent maintenant être prises en compte dans les opérations.",
    accent: "emerald",
  },
  {
    id: 6,
    time: "09:20",
    module: "preparation",
    icon: "📋",
    title: "Module Préparation",
    explanation:
      "La Préparation pilote les commandes, leurs priorités et la performance opérationnelle des préparateurs.",
    libot:
      "Les préparations sont lancées. Je surveille leur progression afin d'anticiper tout risque sur l'objectif d'expédition.",
    accent: "violet",
  },
  {
    id: 7,
    time: "12:15",
    module: "ai",
    icon: "⚠️",
    title: "Libot détecte un risque",
    explanation:
      "Libot compare en permanence la charge restante, la capacité disponible et le rythme réel de préparation.",
    libot:
      "Attention. Le rythme de préparation est inférieur au rythme nécessaire. Sans correction, une partie des commandes prioritaires risque de manquer l'objectif.",
    accent: "rose",
  },
  {
    id: 8,
    time: "12:17",
    module: "ai",
    icon: "🤖",
    title: "Recommandation opérationnelle",
    explanation:
      "Libot transforme l'alerte en recommandations concrètes pour aider le responsable à agir immédiatement.",
    libot:
      "Je recommande de renforcer temporairement la préparation et de concentrer la capacité disponible sur les commandes prioritaires.",
    accent: "amber",
  },
  {
    id: 9,
    time: "13:05",
    module: "preparation",
    icon: "📈",
    title: "Retour dans l'objectif",
    explanation:
      "Après l'action du responsable, OptiFlow mesure immédiatement l'effet sur la trajectoire de la journée.",
    libot:
      "Le rythme s'améliore. La trajectoire redevient compatible avec l'objectif opérationnel.",
    accent: "emerald",
  },
  {
    id: 10,
    time: "14:35",
    module: "shipping",
    icon: "🚚",
    title: "Module Expédition",
    explanation:
      "L'Expédition suit les demandes transporteurs, confirmations, chargements, départs et anomalies.",
    libot:
      "Les premières commandes terminées sont prêtes à partir. Je surveille les confirmations transporteurs et les chargements.",
    accent: "cyan",
  },
  {
    id: 11,
    time: "15:40",
    module: "shipping",
    icon: "⏳",
    title: "Transporteur sans réponse",
    explanation:
      "OptiFlow peut détecter une demande restée sans réponse et attirer l'attention du responsable.",
    libot:
      "Une demande transporteur reste sans réponse depuis deux heures. Je recommande une relance afin de sécuriser l'enlèvement.",
    accent: "amber",
  },
  {
    id: 12,
    time: "16:05",
    module: "shipping",
    icon: "✅",
    title: "Enlèvement confirmé",
    explanation:
      "La confirmation reçue permet de sécuriser la suite du flux et de mettre à jour le suivi opérationnel.",
    libot:
      "Confirmation reçue. L'enlèvement est sécurisé et le chargement peut suivre son déroulement normal.",
    accent: "emerald",
  },
  {
    id: 13,
    time: "17:30",
    module: "executive",
    icon: "📊",
    title: "Bilan de fin de journée",
    explanation:
      "La Direction retrouve les performances essentielles, les événements importants et les priorités restantes.",
    libot:
      "La journée est terminée. Je rassemble maintenant les performances des équipes, les flux réalisés, les alertes et les priorités du prochain jour.",
    accent: "violet",
  },
];
