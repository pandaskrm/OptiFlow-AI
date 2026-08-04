"use client";


import useVoiceAssistant from "../hooks/useVoiceAssistant";
import { notifyWarehouseUpdate } from "../lib/warehouse/warehouseLiveStore";
import { FormEvent, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import OptiFlowMascot from "./OptiFlowMascot";
import AssistantQuickActions from "./assistant/AssistantQuickActions";
import ErpSetupWizard from "./ErpSetupWizard";

type Message = {
  id: number;
  author: "assistant" | "user";
  content: string;
};

type PendingAction = "ERP_SYNC" | null;

type AssistantAction = "NONE" | "ERP_SETUP";

type AssistantSession = {
  open: boolean;
  messages: Message[];
  assistantAction: AssistantAction;
};

const ASSISTANT_STORAGE_KEY = "optiflow_ai_assistant_session";

const ASSISTANT_SESSION_DATE_KEY =
  "optiflow_ai_assistant_session_date";

type NavigationCommand = {
  keywords: string[];
  destination: string;
  label: string;
};

const navigationCommands: NavigationCommand[] = [
  {
    keywords: ["dashboard", "tableau de bord", "accueil"],
    destination: "/dashboard",
    label: "le tableau de bord",
  },
  {
    keywords: ["réception", "réceptions"],
    destination: "/reception",
    label: "les réceptions",
  },
  {
    keywords: ["preparation", "preparations"],
    destination: "/preparation",
    label: "la préparation",
  },
  {
    keywords: ["expedition", "expeditions", "shipping"],
    destination: "/shipping",
    label: "les expéditions",
  },
  {
    keywords: ["stock", "inventaire"],
    destination: "/stock",
    label: "le stock",
  },
  {
    keywords: ["equipe", "utilisateur", "utilisateurs"],
    destination: "/team",
    label: "la gestion de l'equipe",
  },
  {
    keywords: ["direction", "dirigeant", "patron", "executive"],
    destination: "/executive",
    label: "la vue Direction",
  },
  {
    keywords: ["parametre", "parametres", "erp"],
    destination: "/parametres",
    label: "les parametres",
  },
  {
    keywords: ["audit", "journal"],
    destination: "/audit",
    label: "le journal d'audit",
  },
  {
    keywords: ["demo", "simulation"],
    destination: "/demo",
    label: "le mode Demo",
  },
];

const pageNames: Record<string, string> = {
  "/dashboard": "Tableau de bord",
  "/reception": "Réceptions",
  "/preparation": "Préparation",
  "/shipping": "Expéditions",
  "/stock": "Stock",
  "/team": "Équipe",
  "/executive": "Direction",
  "/parametres": "Paramètres",
  "/audit": "Journal d'audit",
  "/demo": "Mode Démo",
};

const suggestedQuestions: Record<string, string[]> = {
  "/dashboard": [
    "Analyse mon entrepot",
    "Pourquoi mes KPI sont a zero ?",
    "Ouvre les réceptions",
    "Lance le mode Demo",
  ],
  "/reception": [
    "Analyse les réceptions",
    "Ouvre les expéditions",
    "Montre-moi le stock",
    "Retourne au tableau de bord",
  ],
  "/preparation": [
    "Analyse la préparation",
    "Montre-moi l'équipe",
    "Ouvre le stock",
    "Retourne au tableau de bord",
  ],
  "/shipping": [
    "Analyse les expéditions",
    "Ouvre les réceptions",
    "Montre-moi le stock",
    "Retourne au tableau de bord",
  ],
  "/stock": [
    "Analyse le stock",
    "Ouvre la préparation",
    "Montre-moi les réceptions",
    "Retourne au tableau de bord",
  ],
  "/team": [
    "Comment creer un utilisateur ?",
    "Ouvre les parametres",
    "Montre-moi la préparation",
    "Retourne au tableau de bord",
  ],
  "/executive": [
    "Prepare un resume dirigeant",
    "Analyse mon entrepot",
    "Ouvre le tableau de bord",
    "Montre-moi les expéditions",
  ],
  "/parametres": [
    "Comment connecter mon ERP ?",
    "Lance une synchronisation ERP",
    "Comment creer un utilisateur ?",
    "Ouvre le tableau de bord",
    "Lance le mode Demo",
  ],
  "/demo": [
    "Analyse le scenario actuel",
    "Ouvre le tableau de bord",
    "Montre-moi les réceptions",
    "Montre-moi la vue Direction",
  ],
};


type ContextAction = {
  icon: string;
  label: string;
  prompt: string;
};

type ModuleAssistance = {
  teaser: string;
  introduction: string;
  actions: ContextAction[];
};

const moduleAssistance: Record<string, ModuleAssistance> = {
  "/dashboard": {
    teaser: "Je peux analyser vos priorités du jour",
    introduction:
      "Vous êtes sur le tableau de bord. Je peux analyser vos KPI, expliquer les alertes et ouvrir les modules utiles.",
    actions: [
      { icon: "📊", label: "Analyser les KPI", prompt: "Analyse les KPI du tableau de bord" },
      { icon: "🎯", label: "Priorités", prompt: "Donne-moi les priorités du jour" },
      { icon: "📥", label: "Réceptions", prompt: "Ouvre les réceptions" },
      { icon: "✨", label: "Mode Démo", prompt: "Lance le mode Démo" },
    ],
  },

  "/reception": {
    teaser: "Je peux créer une réception ou analyser les retards",
    introduction:
      "Vous êtes dans Réception. Je peux créer une réception, rechercher un dossier, attribuer un quai et analyser les retards.",
    actions: [
      { icon: "➕", label: "Créer", prompt: "Crée une nouvelle réception" },
      { icon: "🚛", label: "Aujourd’hui", prompt: "Montre-moi les réceptions du jour" },
      { icon: "📍", label: "Quais", prompt: "Analyse l'occupation des quais" },
      { icon: "⚠️", label: "Retards", prompt: "Analyse les réceptions en retard" },
    ],
  },

  "/preparation": {
    teaser: "Je peux afficher les urgences de préparation",
    introduction:
      "Vous êtes dans Préparation. Je peux afficher les urgences, analyser la charge et suivre les performances.",
    actions: [
      { icon: "🚨", label: "Urgences", prompt: "Montre-moi les préparations urgentes" },
      { icon: "📦", label: "Commandes", prompt: "Analyse les commandes en préparation" },
      { icon: "👷", label: "Performance", prompt: "Analyse la performance des préparateurs" },
      { icon: "📊", label: "Charge", prompt: "Analyse la charge de préparation" },
    ],
  },

  "/shipping": {
    teaser: "Je peux analyser les départs et les retards",
    introduction:
      "Vous êtes dans Expédition. Je peux suivre les départs, les transporteurs et les expéditions prioritaires.",
    actions: [
      { icon: "🚚", label: "Départs", prompt: "Montre-moi les départs du jour" },
      { icon: "⚠️", label: "Retards", prompt: "Analyse les expéditions en retard" },
      { icon: "📦", label: "Priorités", prompt: "Affiche les expéditions prioritaires" },
      { icon: "🔎", label: "Transporteurs", prompt: "Analyse les transporteurs" },
    ],
  },

  "/stock": {
    teaser: "Je peux rechercher un article ou détecter les ruptures",
    introduction:
      "Vous êtes dans Stock. Je peux rechercher un article, analyser les ruptures et vous aider à préparer un inventaire.",
    actions: [
      { icon: "🔎", label: "Rechercher", prompt: "Je veux rechercher un article" },
      { icon: "⚠️", label: "Ruptures", prompt: "Analyse les risques de rupture" },
      { icon: "📋", label: "Inventaire", prompt: "Aide-moi à préparer un inventaire" },
      { icon: "📈", label: "Analyse", prompt: "Analyse le stock" },
    ],
  },

  "/team": {
    teaser: "Je peux analyser la charge et les absences",
    introduction:
      "Vous êtes dans Équipe. Je peux afficher les absences, expliquer les horaires et aider à gérer les utilisateurs.",
    actions: [
      { icon: "👥", label: "Équipe", prompt: "Analyse l'équipe aujourd'hui" },
      { icon: "📅", label: "Absences", prompt: "Montre-moi les absences" },
      { icon: "⏱️", label: "Horaires", prompt: "Explique-moi les horaires de l'équipe" },
      { icon: "➕", label: "Utilisateur", prompt: "Comment créer un utilisateur ?" },
    ],
  },

  "/executive": {
    teaser: "Je peux préparer votre synthèse dirigeant",
    introduction:
      "Vous êtes dans Direction. Je peux résumer les KPI, détecter les risques et présenter les priorités dirigeant.",
    actions: [
      { icon: "📊", label: "Synthèse", prompt: "Prépare un résumé dirigeant" },
      { icon: "⚠️", label: "Risques", prompt: "Quels sont les principaux risques ?" },
      { icon: "🎯", label: "Priorités", prompt: "Donne-moi les priorités dirigeant" },
      { icon: "🏭", label: "Santé dépôt", prompt: "Analyse la santé de l'entrepôt" },
    ],
  },

  "/ai": {
    teaser: "Je peux analyser votre entrepôt",
    introduction:
      "Vous êtes dans IA OptiFlow. Je peux analyser l'entrepôt, expliquer les alertes et préparer votre briefing.",
    actions: [
      { icon: "🧠", label: "Analyse", prompt: "Analyse mon entrepôt" },
      { icon: "🎯", label: "Missions", prompt: "Quelles sont mes missions prioritaires ?" },
      { icon: "⚠️", label: "Alertes", prompt: "Analyse les alertes actuelles" },
      { icon: "📋", label: "Briefing", prompt: "Prépare mon briefing opérationnel" },
    ],
  },

  "/parametres": {
    teaser: "Je peux vous guider dans la connexion ERP",
    introduction:
      "Vous êtes dans Paramètres. Je peux vous guider pour connecter l'ERP, synchroniser les données et gérer les utilisateurs.",
    actions: [
      { icon: "🔌", label: "Connecter ERP", prompt: "Comment connecter mon ERP ?" },
      { icon: "🔄", label: "Synchroniser", prompt: "Lance une synchronisation ERP" },
      { icon: "👤", label: "Utilisateur", prompt: "Comment créer un utilisateur ?" },
      { icon: "🛡️", label: "Sécurité", prompt: "Explique-moi les rôles et permissions" },
    ],
  },

  "/demo": {
    teaser: "Je peux lancer et expliquer la démonstration",
    introduction:
      "Vous êtes dans le mode Démo. Je peux lancer le scénario, analyser les événements simulés et ouvrir les vues principales.",
    actions: [
      { icon: "▶️", label: "Démarrer", prompt: "Démarre la démonstration" },
      { icon: "📊", label: "Analyser", prompt: "Analyse le scénario actuel" },
      { icon: "📥", label: "Réceptions", prompt: "Montre-moi les réceptions" },
      { icon: "🏢", label: "Direction", prompt: "Montre-moi la vue Direction" },
    ],
  },
};


function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function findNavigationCommand(question: string) {
  const normalizedQuestion = normalizeText(question);

  const actionWords = [
    "ouvre",
    "ouvrir",
    "montre",
    "affiche",
    "aller",
    "va sur",
    "lance",
    "retourne",
    "emmene",
  ];

  const actionRequested = actionWords.some((word) =>
    normalizedQuestion.includes(word),
  );

  if (!actionRequested) {
    return null;
  }

  return (
    navigationCommands.find((command) =>
      command.keywords.some((keyword) =>
        normalizedQuestion.includes(normalizeText(keyword)),
      ),
    ) ?? null
  );
}

function createAnswer(question: string, currentPage: string) {
  const normalizedQuestion = normalizeText(question);

  if (
    normalizedQuestion.includes("kpi") ||
    normalizedQuestion.includes("zero")
  ) {
    return "Les KPI affichent zéro ou -- lorsque l'ERP n'est pas connecté et que le mode Démo est désactivé. Les données réelles et les données de démonstration restent volontairement séparées.";
  }

  if (
    normalizedQuestion.includes("erp") ||
    normalizedQuestion.includes("connecter")
  ) {
    return "Ouvrez les Parametres puis la section ERP. Vous pourrez enregistrer la configuration, tester la connexion et lancer une premiere synchronisation.";
  }

  if (
    normalizedQuestion.includes("utilisateur") ||
    normalizedQuestion.includes("equipe")
  ) {
    return "La gestion des utilisateurs se trouve dans le module Equipe. Un administrateur peut inviter un collaborateur, attribuer son role et controler ses autorisations.";
  }

  if (
    normalizedQuestion.includes("réception") ||
    normalizedQuestion.includes("quai")
  ) {
    return "Je peux suivre les réceptions planifiées, les opérations à quai, les déchargements, les contrôles et les retards.";
  }

  if (
    normalizedQuestion.includes("expedition") ||
    normalizedQuestion.includes("transporteur")
  ) {
    return "Je peux vous aider à suivre les expéditions en attente, les retards transporteurs et les priorités de départ.";
  }

  if (
    normalizedQuestion.includes("stock") ||
    normalizedQuestion.includes("rupture")
  ) {
    return "Je peux analyser les niveaux de stock, les mouvements et les risques de rupture lorsque les données de l'entreprise sont disponibles.";
  }

  if (
    normalizedQuestion.includes("preparation") ||
    normalizedQuestion.includes("commande")
  ) {
    return "Je peux vous aider à suivre les commandes en préparation, leur priorité, leur avancement et la charge de travail des préparateurs.";
  }

  if (
    normalizedQuestion.includes("direction") ||
    normalizedQuestion.includes("dirigeant") ||
    normalizedQuestion.includes("resume")
  ) {
    return "La vue Direction resume la sante operationnelle, les principaux KPI, les risques detectes et les actions prioritaires.";
  }

  if (
    normalizedQuestion.includes("analyse") ||
    normalizedQuestion.includes("entrepot")
  ) {
    return "Mon analyse contrôle la santé du dépôt, les commandes, les réceptions, les expéditions, le stock, les équipes et les alertes prioritaires.";
  }

  if (
    normalizedQuestion.includes("demo") ||
    normalizedQuestion.includes("simulation")
  ) {
    return "Le mode Démo utilise des données logistiques fictives clairement identifiées et séparées des données réelles.";
  }

  const currentPageName = pageNames[currentPage] ?? "OptiFlow AI";

  return `Vous êtes actuellement dans ${currentPageName}. Je peux répondre à vos questions ou ouvrir directement un autre module.`;
}

export default function OptiFlowAssistant() {
  const router = useRouter();
  const pathname = usePathname();

  const currentPage =
    Object.keys(pageNames).find(
      (page) => pathname === page || pathname.startsWith(`${page}/`),
    ) ?? "/dashboard";

  const pageName = pageNames[currentPage] ?? "OptiFlow AI";

  const questions =
    suggestedQuestions[currentPage] ?? suggestedQuestions["/dashboard"];

  const currentAssistance =
    moduleAssistance[currentPage] ??
    moduleAssistance["/dashboard"];

  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [pendingAction, setPendingAction] =
    useState<PendingAction>(null);
  const [assistantAction, setAssistantAction] =
    useState<AssistantAction>("NONE");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      author: "assistant",
      content:
        "Bonjour, je suis votre copilote OptiFlow AI. Je peux répondre à vos questions et ouvrir directement les modules du logiciel.",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastSpokenMessageIdRef = useRef<number | null>(null);

  const {
    supported: voiceSupported,
    listening,
    speaking,
    voiceEnabled,
    error: voiceError,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    toggleVoice,
  } = useVoiceAssistant();

  useEffect(() => {
    try {
      const currentSessionDate =
        new Date().toISOString().slice(0, 10);

      const storedSessionDate =
        window.sessionStorage.getItem(
          ASSISTANT_SESSION_DATE_KEY,
        );

      if (
        storedSessionDate !== currentSessionDate
      ) {
        window.sessionStorage.removeItem(
          ASSISTANT_STORAGE_KEY,
        );

        window.sessionStorage.removeItem(
          "optiflow_ai_last_spoken_message",
        );

        window.sessionStorage.setItem(
          ASSISTANT_SESSION_DATE_KEY,
          currentSessionDate,
        );
      }
      const savedSession = window.sessionStorage.getItem(
        ASSISTANT_STORAGE_KEY,
      );

      if (savedSession) {
        const session = JSON.parse(
          savedSession,
        ) as Partial<AssistantSession>;

        if (typeof session.open === "boolean") {
          setOpen(session.open);
        }

        if (
          Array.isArray(session.messages) &&
          session.messages.length > 0
        ) {
          const lastAssistantMessage = [...session.messages]
            .reverse()
            .find(
              (message) =>
                message.author === "assistant",
            );

          lastSpokenMessageIdRef.current =
            lastAssistantMessage?.id ?? null;

          setMessages(session.messages);
        }

        if (
          session.assistantAction === "NONE" ||
          session.assistantAction === "ERP_SETUP"
        ) {
          setAssistantAction(session.assistantAction);
        }
      }
    } catch {
      window.sessionStorage.removeItem(ASSISTANT_STORAGE_KEY);
    } finally {
      setSessionLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!sessionLoaded) {
      return;
    }

    const session: AssistantSession = {
      open,
      messages,
      assistantAction,
    };

    window.sessionStorage.setItem(
      ASSISTANT_STORAGE_KEY,
      JSON.stringify(session),
    );

    window.sessionStorage.setItem(
      ASSISTANT_SESSION_DATE_KEY,
      new Date().toISOString().slice(0, 10),
    );
  }, [assistantAction, messages, open, sessionLoaded]);

  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container) {
      return;
    }

    const animationFrame = window.requestAnimationFrame(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [messages]);

  useEffect(() => {
    if (!sessionLoaded) {
      return;
    }

    const lastMessage = messages[messages.length - 1];

    if (
      !voiceEnabled ||
      !lastMessage ||
      lastMessage.author !== "assistant"
    ) {
      return;
    }

    const messageKey =
      `${lastMessage.id}:${lastMessage.content}`;

    const storedMessageKey =
      window.sessionStorage.getItem(
        "optiflow_ai_last_spoken_message",
      );

    if (
      lastMessage.id ===
        lastSpokenMessageIdRef.current ||
      messageKey === storedMessageKey
    ) {
      return;
    }

    lastSpokenMessageIdRef.current =
      lastMessage.id;

    window.sessionStorage.setItem(
      "optiflow_ai_last_spoken_message",
      messageKey,
    );

    speak(lastMessage.content);
  }, [
    messages,
    sessionLoaded,
    speak,
    voiceEnabled,
  ]);

  useEffect(() => {
    const pendingModule =
      window.sessionStorage.getItem(
        "optiflow_ai_pending_module_help",
      );

    if (pendingModule !== currentPage) {
      return;
    }

    if (open) {
      window.sessionStorage.removeItem(
        "optiflow_ai_pending_module_help",
      );
      return;
    }

    const timeout = window.setTimeout(() => {
      if (document.visibilityState !== "visible") {
        return;
      }

      window.sessionStorage.removeItem(
        "optiflow_ai_pending_module_help",
      );

      const moduleHelp =
        currentAssistance.introduction.replace(
          /^Vous êtes[^.]*\.\s*/,
          "",
        );

      speak(
        `Module ${pageName} chargé. ${moduleHelp}`,
      );
    }, 2500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [
    currentAssistance.introduction,
    currentPage,
    open,
    pageName,
    speak,
  ]);

  function closeLibotWithAnimation(
    destination?: string,
  ) {
    setClosing(true);

    window.setTimeout(() => {
      setOpen(false);
      setClosing(false);

      if (destination) {
        window.sessionStorage.setItem(
          "optiflow_ai_pending_module_help",
          destination,
        );

        router.push(destination);
      }
    }, 500);
  }

  async function runErpSynchronization() {
    setPendingAction(null);
    setThinking(true);

    try {
      const response = await fetch("/api/erp/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMessage =
          payload &&
          typeof payload.error === "string"
            ? payload.error
            : "La synchronisation ERP n'a pas pu être lancée.";

        const additionalHelp =
          response.status === 404
            ? " Ouvrez les paramètres ERP pour enregistrer une connexion."
            : response.status === 403
              ? " Cette action nécessite un compte administrateur ou propriétaire."
              : "";

        setMessages((current) => [
          ...current,
          {
            id: Date.now(),
            author: "assistant",
            content: `${errorMessage}${additionalHelp}`,
          },
        ]);

        return;
      }

      setMessages((current) => [
        ...current,
        {
          id: Date.now(),
          author: "assistant",
          content:
            "La synchronisation ERP est terminée avec succès. Les données d'OptiFlow AI peuvent maintenant être actualisées.",
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: Date.now(),
          author: "assistant",
          content:
            "Impossible de contacter le service de synchronisation ERP. Vérifiez votre connexion puis réessayez.",
        },
      ]);
    } finally {
      setThinking(false);
    }
  }

  async function askQuestion(question: string) {
    const cleanQuestion = question.trim();

    if (!cleanQuestion || thinking) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      author: "user",
      content: cleanQuestion,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");

    const normalizedQuestion = normalizeText(cleanQuestion);

    if (pendingAction === "ERP_SYNC") {
      const confirmationWords = [
        "oui",
        "confirme",
        "confirmer",
        "lance",
        "demarre",
        "valide",
      ];

      const cancellationWords = [
        "non",
        "annule",
        "annuler",
        "stop",
      ];

      if (
        confirmationWords.some((word) =>
          normalizedQuestion.includes(word),
        )
      ) {
        void runErpSynchronization();
        return;
      }

      if (
        cancellationWords.some((word) =>
          normalizedQuestion.includes(word),
        )
      ) {
        setPendingAction(null);

        setMessages((current) => [
          ...current,
          {
            id: Date.now() + 1,
            author: "assistant",
            content: "La synchronisation ERP a été annulée.",
          },
        ]);

        return;
      }

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          author: "assistant",
          content:
            "Répondez par « Oui, je confirme » pour lancer la synchronisation ERP, ou par « Annuler ».",
        },
      ]);

      return;
    }

    const requestsErpSetup =
      normalizedQuestion.includes("erp") &&
      (
        normalizedQuestion.includes("connect") ||
        normalizedQuestion.includes("configur")
      );

    if (requestsErpSetup) {
      setAssistantAction("ERP_SETUP");

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          author: "assistant",
          content:
            "Je lance l'assistant de connexion ERP et je vous guide etape par etape.",
        },
      ]);

      return;
    }

    const requestsErpSync =
      normalizedQuestion.includes("erp") &&
      (
        normalizedQuestion.includes("synchron") ||
        normalizedQuestion.includes("actualis") ||
        normalizedQuestion.includes("mettre a jour")
      );

    if (requestsErpSync) {
      setPendingAction("ERP_SYNC");

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          author: "assistant",
          content:
            "La synchronisation va récupérer les dernières données de votre ERP. Confirmez-vous son lancement ?",
        },
      ]);

      return;
    }

    setThinking(true);

const navigationCommand = findNavigationCommand(cleanQuestion);

if (navigationCommand) {
  const assistantMessage: Message = {
    id: Date.now() + 1,
    author: "assistant",
    content: `J'ouvre ${navigationCommand.label}.`,
  };

  setMessages((current) => [...current, assistantMessage]);
  setThinking(false);

  window.setTimeout(() => {
    closeLibotWithAnimation(
      navigationCommand.destination,
    );
  }, 1800);

  return;
}

try {
  const history = [
    ...messages,
    userMessage,
  ].map((message) => ({
    role: message.author,
    content: message.content,
  }));

  const warehouseContextKeywords = [
  "analyse",
  "kpi",
  "entrepot",
  "entrepôt",
  "stock",
  "rupture",
  "retard",
  "reception",
  "réception",
  "expedition",
  "expédition",
  "preparation",
  "préparation",
  "commande",
  "quai",
  "transporteur",
  "priorite",
  "priorité",
  "alerte",
  "briefing",
  "resume",
  "résumé",
  "sante",
  "santé",
  "performance",
  "charge",
];

const needsWarehouseContext =
  warehouseContextKeywords.some((keyword) =>
    normalizedQuestion.includes(
      normalizeText(keyword),
    ),
  );

let warehouseSummary = null;
let warehouseAnalysis = null;

if (needsWarehouseContext) {
  const contextStartedAt = performance.now();

  const [summaryResult, analysisResult] =
    await Promise.allSettled([
      fetch("/api/warehouse/summary", {
        cache: "no-store",
      }).then((response) => response.json()),

      fetch("/api/warehouse/analysis", {
        cache: "no-store",
      }).then((response) => response.json()),
    ]);

  warehouseSummary =
    summaryResult.status === "fulfilled"
      ? summaryResult.value
      : null;

  warehouseAnalysis =
    analysisResult.status === "fulfilled"
      ? analysisResult.value
      : null;

  console.info(
    "[Libot] Contexte entrepôt chargé en",
    Math.round(
      performance.now() - contextStartedAt,
    ),
    "ms",
  );
} else {
  console.info(
    "[Libot] Réponse rapide sans contexte entrepôt",
  );
}

const assistantStartedAt = performance.now();

const response = await fetch("/api/assistant/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: history,
      pathname,
      demoMode: pathname === "/demo",
      warehouseSummary,
      warehouseAnalysis,
    }),
  });

  const payload = await response.json();

  console.info(
    "[Libot] Réponse IA reçue en",
    Math.round(
      performance.now() - assistantStartedAt,
    ),
    "ms",
  );

  const CREATE_RECEPTION_COMMAND =
    /\[\[CREATE_RECEPTION:(\{[\s\S]*?\})\]\]/;

  const rawAnswer =
    typeof payload.answer === "string"
      ? payload.answer
      : "";

  const receptionCommand = rawAnswer.match(
    CREATE_RECEPTION_COMMAND,
  );

  const visibleAnswer = rawAnswer
    .replace(CREATE_RECEPTION_COMMAND, "")
    .trim();

  if (receptionCommand) {
    try {
      const receptionData = JSON.parse(receptionCommand[1]);

      const creationResponse = await fetch("/api/receptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          number:
            receptionData.number ||
            `REC-AI-${Date.now()}`,
          supplier: receptionData.supplier,
          carrier:
            typeof receptionData.carrier === "string" &&
            receptionData.carrier.trim()
              ? receptionData.carrier.trim()
              : "Non renseigné",
          dock:
            typeof receptionData.dock === "string" &&
            receptionData.dock.trim()
              ? receptionData.dock.trim()
              : "À attribuer",
          pallets: Number(receptionData.pallets),
          scheduledAt: receptionData.scheduledAt,
          status: "Planifiée",
        }),
      });

      const creationPayload = await creationResponse
        .json()
        .catch(() => null);

      if (!creationResponse.ok) {
        throw new Error(
          creationPayload?.message ||
            "Impossible de créer la réception.",
        );
      }

      payload.answer = "✅ Réception créée avec succès.";

      notifyWarehouseUpdate();

      window.dispatchEvent(
        new Event("optiflow:receptions-updated"),
      );

      payload.action = "/reception";
    } catch (creationError) {
      payload.answer =
        `${visibleAnswer}\n\n⚠️ La réception n'a pas pu être créée : ${
          creationError instanceof Error
            ? creationError.message
            : "erreur inconnue"
        }`;
    }
  } else {
    payload.answer = visibleAnswer || payload.answer;
  }

  const assistantMessage: Message = {
    id: Date.now() + 1,
    author: "assistant",
    content:
      payload.answer ??
      payload.error ??
      "Je n'ai pas réussi à répondre.",
  };

  setMessages((current) => [...current, assistantMessage]);

  if (
    typeof payload.action === "string" &&
    payload.action.startsWith("/")
  ) {
    window.setTimeout(() => {
      closeLibotWithAnimation(
        payload.action,
      );
    }, 1800);
  }
} catch {
  setMessages((current) => [
    ...current,
    {
      id: Date.now() + 1,
      author: "assistant",
      content:
        "Impossible de contacter le cerveau OptiFlow AI.",
    },
  ]);
} finally {
  setThinking(false);
}

}

function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void askQuestion(input);
  }

  function handleVoiceInput() {
    if (listening) {
      stopListening();
      return;
    }

    startListening((transcript) => {
      setInput(transcript);
      void askQuestion(transcript);
    });
  }

  return (
    <div className="fixed bottom-20 right-3 z-[100] flex flex-col items-end sm:bottom-28 sm:right-6">
      {open && (
        <section
          className={`fixed inset-0 flex h-[100dvh] w-screen flex-col overflow-hidden border border-cyan-400/20 bg-slate-950/98 shadow-2xl shadow-cyan-950/50 backdrop-blur-xl transition-all duration-500 ease-in-out sm:static sm:mb-4 sm:h-[min(700px,calc(100vh-140px))] sm:w-[min(460px,calc(100vw-48px))] sm:rounded-3xl ${
            closing
              ? "scale-90 translate-y-6 opacity-0"
              : "scale-100 translate-y-0 opacity-100"
          }`}
        >
          <header className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-slate-950 px-5 py-4">
            <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-cyan-400/10 blur-2xl" />

            <div className="relative flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <OptiFlowMascot compact />

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-white">
                      OptiFlow AI
                    </h2>

                    <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                      En ligne
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">
                    Copilote logistique intelligent
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => closeLibotWithAnimation()}
                aria-label="Fermer le copilote"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-xl text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                X
              </button>
            </div>

            <div className="relative mt-3 flex items-center gap-2 rounded-xl border border-cyan-400/10 bg-slate-950/40 px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-cyan-300" />

              <p className="text-xs text-slate-300">
                Contexte actuel :
                <span className="ml-1 font-semibold text-cyan-300">
                  {pageName}
                </span>
              </p>
            </div>
          </header>

          <div
            ref={messagesContainerRef}
            className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5"
          >
            {messages.length === 1 && (
              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-300 sm:text-xs">
                  Assistant du module
                </p>

                <h3 className="mt-2 text-lg font-black text-white sm:text-xl">
                  {pageName}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-200 sm:text-base sm:leading-7">
                  {currentAssistance.introduction}
                </p>

                <div className="mt-4">
                  <AssistantQuickActions
                    actions={currentAssistance.actions}
                    onAction={(prompt) => {
                      void askQuestion(prompt);
                    }}
                  />
                </div>
              </div>
            )}

            {messages.map((message) => (

<>

              <div
                key={message.id}
                className={
                  message.author === "user"
                    ? "flex justify-end"
                    : "flex justify-start"
                }
              >
                <div
                  className={
                    message.author === "user"
                      ? "max-w-[84%] rounded-2xl rounded-br-md bg-cyan-500 px-4 py-3 text-sm leading-relaxed text-slate-950"
                      : "max-w-[88%] rounded-2xl rounded-bl-md border border-slate-800 bg-slate-900 px-4 py-3 text-sm leading-relaxed text-slate-200"
                  }
                >
                  {message.content}
                </div>
              </div>
            

</>

))}

            {thinking && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-slate-800 bg-slate-900 px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300 [animation-delay:300ms]" />
                </div>
              </div>
            )}

            {messages.length <= 2 && (
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Actions suggerees
                </p>

                <div className="grid gap-2">
                  {questions.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => askQuestion(question)}
                      className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2.5 text-left text-xs text-slate-300 transition hover:border-cyan-500/40 hover:bg-cyan-500/5 hover:text-cyan-200"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {assistantAction === "ERP_SETUP" && (
              <ErpSetupWizard
                onClose={() => setAssistantAction("NONE")}
              />
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-slate-800 bg-slate-950 p-3"
          >
            <div className="flex items-end gap-2 rounded-2xl border border-slate-700 bg-slate-900 p-2 focus-within:border-cyan-500/60">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    askQuestion(input);
                  }
                }}
                rows={1}
                placeholder="Exemple : ouvre les réceptions"
                className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-slate-500"
              />

              <button
                type="button"
                onClick={handleVoiceInput}
                disabled={!voiceSupported || thinking}
                aria-label="Parler à OptiFlow AI"
                title={
                  voiceSupported
                    ? listening
                      ? "Arrêter l'écoute"
                      : "Parler à OptiFlow AI"
                    : "Reconnaissance vocale indisponible"
                }
                className={
                  listening
                    ? "flex h-10 w-10 shrink-0 animate-pulse items-center justify-center rounded-xl bg-red-500 text-white transition hover:bg-red-400"
                    : "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-30"
                }
              >
                {listening ? "■" : "🎤"}
              </button>

              <button
                type="submit"
                disabled={!input.trim() || thinking}
                aria-label="Envoyer la question"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500 font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Go
              </button>
            </div>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-[10px]">
              <button
                type="button"
                onClick={toggleVoice}
                className={
                  voiceEnabled
                    ? "font-semibold text-emerald-400 transition hover:text-emerald-300"
                    : "font-semibold text-slate-500 transition hover:text-slate-300"
                }
              >
                {voiceEnabled
                  ? "🔊 Réponses vocales activées"
                  : "🔇 Réponses vocales coupées"}
              </button>

              {speaking && (
                <button
                  type="button"
                  onClick={stopSpeaking}
                  className="font-semibold text-orange-400 transition hover:text-orange-300"
                >
                  Arrêter la lecture
                </button>
              )}

              {listening && (
                <span className="font-semibold text-red-400">
                  Écoute en cours…
                </span>
              )}
            </div>

            {voiceError && (
              <p className="mt-2 text-center text-[10px] font-semibold text-red-400">
                {voiceError}
              </p>
            )}

            <p className="mt-2 text-center text-[10px] text-slate-600">
              Le copilote peut répondre, parler et naviguer dans OptiFlow AI.
            </p>
          </form>
        </section>
      )}


      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={
          open
            ? "Fermer le copilote OptiFlow AI"
            : "Ouvrir le copilote OptiFlow AI"
        }
        className="relative flex h-14 w-14 items-center justify-center rounded-2xl sm:h-[84px] sm:w-[84px] sm:rounded-3xl border border-cyan-300/30 bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 shadow-2xl shadow-cyan-500/25 transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-cyan-400/40"
      >
        <span className="absolute inset-0 animate-ping rounded-3xl border border-cyan-300/20 opacity-20" />

        {open ? (
          <span className="relative text-2xl font-semibold text-white">
            X
          </span>
        ) : (
          <OptiFlowMascot />
        )}

        {!open && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-950 bg-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-950" />
          </span>
        )}
      </button>
    </div>
  );
}


