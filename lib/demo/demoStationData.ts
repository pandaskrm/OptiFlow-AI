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
      "Bonjour. La journée démarre avec 526 commandes à traiter et 49 collaborateurs présents. À cette heure, aucune préparation n'a encore commencé, les indicateurs de production restent donc naturellement à zéro. Je vais suivre toute la journée la charge, la capacité des équipes, les réceptions, les expéditions et les risques opérationnels.",
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
      "Les équipes sont maintenant en prise de poste. Nous avons 49 collaborateurs présents : 36 préparateurs, 10 magasiniers, 1 personne au SAV et 2 personnes au laboratoire. La préparation dispose donc de sa capacité prévue, mais aucune ligne n'est encore produite. La productivité reste logiquement à zéro jusqu'au démarrage réel des préparations.",
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
      "Un nouvel e-mail opérationnel vient d'être détecté. Mail Intelligence identifie automatiquement le sujet et le contexte pour éviter une lecture manuelle inutile. Ici, le message concerne un arrivage. Je vais transmettre cette information au flux Réception afin qu'elle soit traitée au bon endroit.",
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
      "L'arrivage est maintenant identifié dans le module Réception. OptiFlow peut contrôler son statut, anticiper son passage au quai et suivre son traitement. À ce stade, la préparation des commandes n'a toujours pas démarré : les statistiques de production restent donc à zéro.",
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
      "La réception terminée alimente maintenant le stock. Les disponibilités évoluent et deviennent exploitables par les autres modules. OptiFlow relie donc réception, stock et préparation au lieu de présenter trois informations indépendantes. La prochaine étape sera le lancement réel de la préparation.",
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
      "La préparation démarre maintenant. Dix-huit commandes sont prises en charge par l'équipe. Comme aucune ligne n'est encore terminée au moment exact du lancement, la productivité mesurée reste à zéro. À partir de maintenant, je calcule la cadence réelle en lignes par heure et par préparateur pour détecter rapidement toute dérive.",
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
      "Attention. Le rythme de préparation ralentit alors qu'une part importante de la charge reste encore à traiter. Plusieurs commandes prioritaires doivent être sécurisées. Je détecte donc un risque sur la fin de journée. Sans action, certaines commandes pourraient manquer leur objectif d'expédition.",
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
      "J'ai analysé la situation. Je recommande de renforcer temporairement la préparation et de concentrer les ressources disponibles sur les commandes prioritaires. L'objectif est de réduire rapidement le risque sans désorganiser le reste de l'entrepôt. Je vais mesurer immédiatement l'effet de cette décision.",
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
      "L'action corrective fonctionne. La cadence remonte, les commandes prioritaires diminuent et la trajectoire redevient compatible avec l'objectif de la journée. Le risque détecté à midi est en cours d'absorption. Je continue la surveillance pour confirmer que le rattrapage est durable.",
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
      "La préparation a suffisamment progressé pour alimenter les expéditions. Les commandes terminées peuvent maintenant être regroupées, contrôlées et affectées aux départs transporteurs. Je surveille les confirmations et les chargements afin d'éviter qu'une bonne performance en préparation soit perdue au moment de l'expédition.",
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
      "Une anomalie apparaît côté transport : une confirmation attendue n'est toujours pas reçue. La préparation peut être terminée, mais l'expédition reste exposée tant que l'enlèvement n'est pas sécurisé. Je recommande donc une relance immédiate du transporteur plutôt que d'attendre que le retard devienne critique.",
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
      "La confirmation transporteur vient d'être reçue. Le risque d'enlèvement disparaît et le flux redevient normal. Cette étape montre pourquoi OptiFlow ne surveille pas uniquement la préparation : une commande peut être parfaitement préparée mais rester en danger tant que son transport n'est pas sécurisé.",
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
      "La journée est terminée. Le bilan rassemble maintenant les commandes réalisées, les lignes et unités préparées, les expéditions, les réceptions et la performance de l'équipe. Les indicateurs présentés sont issus de la progression de la journée et non de pourcentages décoratifs. Le ralentissement détecté à midi a été identifié, corrigé puis suivi jusqu'au retour dans l'objectif. Aucun risque critique ne reste ouvert.",
    accent: "violet",
  },
];
