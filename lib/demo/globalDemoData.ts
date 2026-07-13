import type { DemoScenario } from "../scenarios/scenarioStore";

export type GlobalDemoData = {
  label: string;
  status: string;

  dashboard: {
    commandes: number;
    expeditions: number;
    receptions: number;
    service: number;
    productivite: number;
    health: number;

    trucksWaiting: number;
    occupiedDocks: number;
    activeReceptions: number;
    completedToday: number;

    preparationProgress: number;
    shippingProgress: number;
    receptionProgress: number;

    alertLevel: string;
    alertTitle: string;
    alertMessage: string;
    recommendation: string;
    estimatedGain: string;

    orders: {
      day: string;
      commandes: number;
    }[];
  };

  executive: {
    warehouseHealth: number;
    serviceRate: number;
    productivity: number;
    alerts: number;
    receptions: number;
    preparations: number;
    shipments: number;
    delayedOrders: number;

    receptionScore: number;
    preparationScore: number;
    shippingScore: number;

    summary: string;
    priority: string;
  };
};

const globalDemoData: Record<DemoScenario, GlobalDemoData> = {
  normal: {
    label: "Journée normale",
    status: "Activité maîtrisée",

    dashboard: {
      commandes: 486,
      expeditions: 32,
      receptions: 18,
      service: 97,
      productivite: 91,
      health: 94,

      trucksWaiting: 2,
      occupiedDocks: 3,
      activeReceptions: 4,
      completedToday: 18,

      preparationProgress: 78,
      shippingProgress: 92,
      receptionProgress: 65,

      alertLevel: "PRIORITÉ NORMALE",
      alertTitle: "Anticiper les prochaines arrivées",
      alertMessage:
        "L'activité reste stable. Préparez un quai avant la prochaine arrivée transporteur.",
      recommendation:
        "Maintenir la répartition actuelle des équipes et surveiller les quais.",
      estimatedGain: "45 min",

      orders: [
        { day: "Lun", commandes: 486 },
        { day: "Mar", commandes: 520 },
        { day: "Mer", commandes: 498 },
        { day: "Jeu", commandes: 610 },
        { day: "Ven", commandes: 575 },
        { day: "Sam", commandes: 320 },
        { day: "Dim", commandes: 210 },
      ],
    },

    executive: {
      warehouseHealth: 94,
      serviceRate: 97,
      productivity: 91,
      alerts: 2,
      receptions: 18,
      preparations: 486,
      shipments: 32,
      delayedOrders: 4,

      receptionScore: 91,
      preparationScore: 88,
      shippingScore: 93,

      summary:
        "L'exploitation est stable avec un bon niveau de service et une activité maîtrisée.",
      priority:
        "Anticiper les prochaines arrivées et maintenir la disponibilité des quais.",
    },
  },

  peak: {
    label: "Pic d'activité",
    status: "Activité élevée",

    dashboard: {
      commandes: 820,
      expeditions: 68,
      receptions: 35,
      service: 91,
      productivite: 86,
      health: 82,

      trucksWaiting: 4,
      occupiedDocks: 5,
      activeReceptions: 12,
      completedToday: 29,

      preparationProgress: 66,
      shippingProgress: 79,
      receptionProgress: 72,

      alertLevel: "PRIORITÉ HAUTE",
      alertTitle: "Renforcer les zones sous tension",
      alertMessage:
        "Le volume augmente rapidement et cinq quais sont déjà occupés.",
      recommendation:
        "Déplacer deux collaborateurs vers la préparation et réserver un quai prioritaire.",
      estimatedGain: "1 h 10",

      orders: [
        { day: "Lun", commandes: 620 },
        { day: "Mar", commandes: 710 },
        { day: "Mer", commandes: 760 },
        { day: "Jeu", commandes: 820 },
        { day: "Ven", commandes: 790 },
        { day: "Sam", commandes: 490 },
        { day: "Dim", commandes: 280 },
      ],
    },

    executive: {
      warehouseHealth: 82,
      serviceRate: 91,
      productivity: 86,
      alerts: 5,
      receptions: 35,
      preparations: 820,
      shipments: 68,
      delayedOrders: 17,

      receptionScore: 78,
      preparationScore: 74,
      shippingScore: 81,

      summary:
        "Le dépôt subit un pic d'activité avec une pression croissante sur la préparation et les quais.",
      priority:
        "Renforcer immédiatement la préparation et prioriser les flux transport urgents.",
    },
  },

  black_friday: {
    label: "Black Friday",
    status: "Capacité maximale",

    dashboard: {
      commandes: 1380,
      expeditions: 121,
      receptions: 74,
      service: 84,
      productivite: 79,
      health: 68,

      trucksWaiting: 8,
      occupiedDocks: 6,
      activeReceptions: 26,
      completedToday: 48,

      preparationProgress: 54,
      shippingProgress: 63,
      receptionProgress: 88,

      alertLevel: "ALERTE CRITIQUE",
      alertTitle: "Saturation imminente de l'entrepôt",
      alertMessage:
        "Tous les quais sont occupés et le volume de commandes dépasse la capacité normale.",
      recommendation:
        "Activer les renforts, ouvrir une zone temporaire et prioriser les commandes urgentes.",
      estimatedGain: "2 h 35",

      orders: [
        { day: "Lun", commandes: 890 },
        { day: "Mar", commandes: 1040 },
        { day: "Mer", commandes: 1180 },
        { day: "Jeu", commandes: 1380 },
        { day: "Ven", commandes: 1320 },
        { day: "Sam", commandes: 910 },
        { day: "Dim", commandes: 540 },
      ],
    },

    executive: {
      warehouseHealth: 68,
      serviceRate: 84,
      productivity: 79,
      alerts: 11,
      receptions: 74,
      preparations: 1380,
      shipments: 121,
      delayedOrders: 46,

      receptionScore: 67,
      preparationScore: 58,
      shippingScore: 64,

      summary:
        "L'exploitation fonctionne à capacité maximale avec un risque élevé de saturation.",
      priority:
        "Déclencher le plan Black Friday, renforcer les équipes et sécuriser les flux prioritaires.",
    },
  },

  transport_issue: {
    label: "Incident transport",
    status: "Flux transport perturbé",

    dashboard: {
      commandes: 510,
      expeditions: 14,
      receptions: 24,
      service: 76,
      productivite: 83,
      health: 72,

      trucksWaiting: 7,
      occupiedDocks: 4,
      activeReceptions: 9,
      completedToday: 12,

      preparationProgress: 82,
      shippingProgress: 34,
      receptionProgress: 58,

      alertLevel: "ALERTE TRANSPORT",
      alertTitle: "Retards transporteurs importants",
      alertMessage:
        "Plusieurs départs et arrivées sont retardés, ce qui perturbe le planning des quais.",
      recommendation:
        "Replanifier les créneaux, libérer un quai tampon et contacter les transporteurs concernés.",
      estimatedGain: "1 h 50",

      orders: [
        { day: "Lun", commandes: 470 },
        { day: "Mar", commandes: 505 },
        { day: "Mer", commandes: 530 },
        { day: "Jeu", commandes: 510 },
        { day: "Ven", commandes: 495 },
        { day: "Sam", commandes: 290 },
        { day: "Dim", commandes: 175 },
      ],
    },

    executive: {
      warehouseHealth: 72,
      serviceRate: 76,
      productivity: 83,
      alerts: 8,
      receptions: 24,
      preparations: 510,
      shipments: 14,
      delayedOrders: 39,

      receptionScore: 69,
      preparationScore: 86,
      shippingScore: 42,

      summary:
        "Un incident transport dégrade fortement les expéditions et la ponctualité des flux.",
      priority:
        "Replanifier les transporteurs et sécuriser en priorité les commandes avec engagement client.",
    },
  },

  quality_alert: {
    label: "Contrôle qualité",
    status: "Qualité sous surveillance",

    dashboard: {
      commandes: 430,
      expeditions: 25,
      receptions: 31,
      service: 88,
      productivite: 81,
      health: 74,

      trucksWaiting: 3,
      occupiedDocks: 4,
      activeReceptions: 11,
      completedToday: 15,

      preparationProgress: 69,
      shippingProgress: 73,
      receptionProgress: 48,

      alertLevel: "ALERTE QUALITÉ",
      alertTitle: "Contrôles qualité renforcés",
      alertMessage:
        "Plusieurs réceptions sont bloquées pour vérification avant mise en stock.",
      recommendation:
        "Affecter un contrôleur supplémentaire et isoler immédiatement les lots concernés.",
      estimatedGain: "1 h 25",

      orders: [
        { day: "Lun", commandes: 420 },
        { day: "Mar", commandes: 455 },
        { day: "Mer", commandes: 438 },
        { day: "Jeu", commandes: 430 },
        { day: "Ven", commandes: 410 },
        { day: "Sam", commandes: 250 },
        { day: "Dim", commandes: 140 },
      ],
    },

    executive: {
      warehouseHealth: 74,
      serviceRate: 88,
      productivity: 81,
      alerts: 7,
      receptions: 31,
      preparations: 430,
      shipments: 25,
      delayedOrders: 21,

      receptionScore: 51,
      preparationScore: 77,
      shippingScore: 82,

      summary:
        "Des anomalies qualité ralentissent les réceptions et créent un risque sur la disponibilité des stocks.",
      priority:
        "Renforcer les contrôles, isoler les lots suspects et protéger les commandes prioritaires.",
    },
  },
};

export function getGlobalDemoData(
  scenario: DemoScenario
): GlobalDemoData {
  return globalDemoData[scenario];
}