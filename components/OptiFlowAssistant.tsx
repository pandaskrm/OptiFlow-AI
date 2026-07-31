"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import OptiFlowMascot from "./OptiFlowMascot";

type Message = {
  id: number;
  author: "assistant" | "user";
  content: string;
};

type PendingAction = "ERP_SYNC" | null;

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
    keywords: ["reception", "receptions"],
    destination: "/reception",
    label: "les receptions",
  },
  {
    keywords: ["preparation", "preparations"],
    destination: "/preparation",
    label: "la préparation",
  },
  {
    keywords: ["expedition", "expeditions", "shipping"],
    destination: "/shipping",
    label: "les expeditions",
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
  "/reception": "Receptions",
  "/preparation": "Préparation",
  "/shipping": "Expeditions",
  "/stock": "Stock",
  "/team": "Equipe",
  "/executive": "Direction",
  "/parametres": "Parametres",
  "/audit": "Journal d'audit",
  "/demo": "Mode Demo",
};

const suggestedQuestions: Record<string, string[]> = {
  "/dashboard": [
    "Analyse mon entrepot",
    "Pourquoi mes KPI sont a zero ?",
    "Ouvre les receptions",
    "Lance le mode Demo",
  ],
  "/reception": [
    "Analyse les receptions",
    "Ouvre les expeditions",
    "Montre-moi le stock",
    "Retourne au tableau de bord",
  ],
  "/preparation": [
    "Analyse la préparation",
    "Montre-moi l'equipe",
    "Ouvre le stock",
    "Retourne au tableau de bord",
  ],
  "/shipping": [
    "Analyse les expeditions",
    "Ouvre les receptions",
    "Montre-moi le stock",
    "Retourne au tableau de bord",
  ],
  "/stock": [
    "Analyse le stock",
    "Ouvre la préparation",
    "Montre-moi les receptions",
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
    "Montre-moi les expeditions",
  ],
  "/parametres": [
    "Comment connecter mon ERP ?",`r`n    "Lance une synchronisation ERP",
    "Comment creer un utilisateur ?",
    "Ouvre le tableau de bord",
    "Lance le mode Demo",
  ],
  "/demo": [
    "Analyse le scenario actuel",
    "Ouvre le tableau de bord",
    "Montre-moi les receptions",
    "Montre-moi la vue Direction",
  ],
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
    return "Les KPI affichent zero ou -- lorsque l'ERP n'est pas connecte et que le mode Demo est desactive. Les donnees reelles et les donnees de demonstration restent volontairement separees.";
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
    normalizedQuestion.includes("reception") ||
    normalizedQuestion.includes("quai")
  ) {
    return "Je peux suivre les receptions planifiees, les operations a quai, les dechargements, les controles et les retards.";
  }

  if (
    normalizedQuestion.includes("expedition") ||
    normalizedQuestion.includes("transporteur")
  ) {
    return "Je peux vous aider a suivre les expeditions en attente, les retards transporteurs et les priorites de depart.";
  }

  if (
    normalizedQuestion.includes("stock") ||
    normalizedQuestion.includes("rupture")
  ) {
    return "Je peux analyser les niveaux de stock, les mouvements et les risques de rupture lorsque les donnees de l'entreprise sont disponibles.";
  }

  if (
    normalizedQuestion.includes("preparation") ||
    normalizedQuestion.includes("commande")
  ) {
    return "Je peux vous aider a suivre les commandes en preparation, leur priorite, leur avancement et la charge de travail des preparateurs.";
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
    return "Mon analyse controle la sante du depot, les commandes, les receptions, les expeditions, le stock, les equipes et les alertes prioritaires.";
  }

  if (
    normalizedQuestion.includes("demo") ||
    normalizedQuestion.includes("simulation")
  ) {
    return "Le mode Demo utilise des donnees logistiques fictives clairement identifiees et separees des donnees reelles.";
  }

  const currentPageName = pageNames[currentPage] ?? "OptiFlow AI";

  return `Vous etes actuellement dans ${currentPageName}. Je peux repondre a vos questions ou ouvrir directement un autre module.`;
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

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [pendingAction, setPendingAction] =
    useState<PendingAction>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      author: "assistant",
      content:
        "Bonjour, je suis votre copilote OptiFlow AI. Je peux repondre a vos questions et ouvrir directement les modules du logiciel.",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, thinking]);

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

  function askQuestion(question: string) {
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

    window.setTimeout(() => {
      if (navigationCommand) {
        const assistantMessage: Message = {
          id: Date.now() + 1,
          author: "assistant",
          content: `J'ouvre ${navigationCommand.label}.`,
        };

        setMessages((current) => [...current, assistantMessage]);
        setThinking(false);

        window.setTimeout(() => {
          router.push(navigationCommand.destination);
        }, 500);

        return;
      }

      const assistantMessage: Message = {
        id: Date.now() + 1,
        author: "assistant",
        content: createAnswer(cleanQuestion, currentPage),
      };

      setMessages((current) => [...current, assistantMessage]);
      setThinking(false);
    }, 650);
  }
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    askQuestion(input);
  }

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col items-end">
      {open && (
        <section className="mb-4 flex h-[min(620px,calc(100vh-120px))] w-[min(390px,calc(100vw-32px))] flex-col overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-950/95 shadow-2xl shadow-cyan-950/50 backdrop-blur-xl">
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
                onClick={() => setOpen(false)}
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

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
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
                placeholder="Exemple : ouvre les receptions"
                className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-slate-500"
              />

              <button
                type="submit"
                disabled={!input.trim() || thinking}
                aria-label="Envoyer la question"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500 font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Go
              </button>
            </div>

            <p className="mt-2 text-center text-[10px] text-slate-600">
              Le copilote peut repondre et naviguer dans OptiFlow AI.
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
        className="relative flex h-[72px] w-[72px] items-center justify-center rounded-3xl border border-cyan-300/30 bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 shadow-2xl shadow-cyan-500/25 transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-cyan-400/40"
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