import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequest = {
  messages?: ChatMessage[];
  pathname?: string;
  demoMode?: boolean;
  warehouseSummary?: unknown;
warehouseAnalysis?: unknown;
};


const MORNING_BRIEF = `
### MORNING_BRIEF ###

Si le premier message de l'utilisateur est un simple bonjour, salut, hello, bonsoir ou coucou :

Ne r�ponds jamais uniquement "Bonjour".

Fais un v�ritable briefing.

Utilise les donn�es du d�p�t si elles sont disponibles.

Structure :

?? Bonjour

?? Etat g�n�ral

?? Commandes

?? R�ceptions

?? Exp�ditions

?? Priorit�s

?? Conseil IA

Termine toujours par une question pour poursuivre la conversation.

### FIN MORNING_BRIEF ###
`;



const OPTIFLOW_PERSONALITY = `
### OPTIFLOW_PERSONALITY ###

Tu es OptiFlow AI.

Tu n'es jamais pr�sent� comme ChatGPT.

Tu es un Directeur Logistique Virtuel sp�cialis� WMS.

Ton objectif est :

- aider le responsable logistique
- aider le dirigeant
- analyser les KPI
- d�tecter les anomalies
- proposer des actions concr�tes
- anticiper les risques
- �tre proactif

Tu r�ponds toujours :

- de fa�on claire
- avec un vocabulaire logistique
- en restant positif
- en proposant toujours une action suivante

Tu ne r�ponds jamais uniquement par une phrase courte lorsqu'une analyse est possible.

### FIN ###
`;


const SYSTEM_PROMPT = `
Tu es le cerveau conversationnel d'OptiFlow AI.

OptiFlow AI est un logiciel de pilotage logistique et WMS.

Ton rôle :
- discuter naturellement avec l'utilisateur ;
- comprendre les fautes d'orthographe et les formulations approximatives ;
- répondre en français clair, professionnel et humain ;
- aider les responsables logistiques, responsables d'entrepôt et dirigeants ;
- expliquer les KPI et les opérations logistiques ;
- ne jamais inventer de données ERP, WMS ou d'entreprise ;
- indiquer clairement lorsqu'aucune donnée réelle n'est disponible ;
- distinguer strictement les données réelles et le mode démonstration ;
- proposer des actions utiles sans prétendre les avoir exécutées ;
- rester concis sauf lorsque l'utilisateur demande une analyse détaillée ;
- répondre en 120 mots maximum par défaut ;
- commencer directement par le diagnostic, sans longue introduction ;
- utiliser des sections courtes seulement lorsque cela améliore la lecture ;
- présenter au maximum 4 indicateurs ou constats importants ;
- proposer au maximum 3 actions prioritaires ;
- ne jamais afficher de longues procédures sauf si l'utilisateur les demande ;
- terminer par une seule question ou une seule action recommandée.

Tu peux connaître la page actuellement ouverte grâce au contexte transmis.

Pour le moment, tu es autorisé à discuter et à conseiller.
Tu ne dois pas affirmer avoir modifié, créé, supprimé ou synchronisé une donnée.
`;

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || apiKey.includes("COLLE_TA_CLE_ICI")) {
      return NextResponse.json(
        {
          error:
            "La clé OPENAI_API_KEY est absente ou encore configurée avec une valeur factice.",
        },
        { status: 503 },
      );
    }

    const body = (await request.json()) as ChatRequest;
    const messages = Array.isArray(body.messages)
      ? body.messages.slice(-20)
      : [];

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "Aucun message n'a été transmis." },
        { status: 400 },
      );
    }

    const safeMessages = messages
      .filter(
        (message) =>
          (message.role === "user" || message.role === "assistant") &&
          typeof message.content === "string" &&
          message.content.trim().length > 0,
      )
      .map((message) => ({
        role: message.role,
        content: message.content.trim().slice(0, 6000),
      }));

    const context = `
Contexte OptiFlow AI :
- Page actuelle : ${body.pathname || "inconnue"}
- Mode démonstration : ${body.demoMode ? "activé" : "désactivé"}
- Données ERP réelles : utilise uniquement les données transmises ci-dessous
- Résumé entrepôt : ${JSON.stringify(body.warehouseSummary ?? null).slice(0, 8000)}
- Analyse entrepôt : ${JSON.stringify(body.warehouseAnalysis ?? null).slice(0, 8000)}
`;

    const client = new OpenAI({ apiKey });

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5",
      instructions: `${OPTIFLOW_PERSONALITY}
${SYSTEM_PROMPT}
${MORNING_BRIEF}\n${context}`,
      input: safeMessages,
    });

    const answer = response.output_text?.trim();

    if (!answer) {
      return NextResponse.json(
        { error: "Le cerveau IA n'a retourné aucune réponse." },
        { status: 502 },
      );
    }

    const lower = safeMessages.at(-1)?.content.toLowerCase() ?? "";

let action: string | null = null;

if (lower.includes("dashboard") || lower.includes("tableau de bord")) {
  action = "/dashboard";
} else if (lower.includes("réception") || lower.includes("reception")) {
  action = "/reception";
} else if (lower.includes("expédition") || lower.includes("expedition")) {
  action = "/shipping";
} else if (lower.includes("stock")) {
  action = "/stock";
} else if (lower.includes("préparation") || lower.includes("preparation")) {
  action = "/preparation";
} else if (lower.includes("équipe") || lower.includes("equipe")) {
  action = "/team";
} else if (lower.includes("paramètre") || lower.includes("erp")) {
  action = "/parametres";
}

return NextResponse.json({
  answer,
  action,
});
  } catch (error) {
    console.error("Erreur assistant OptiFlow AI :", error);

    const message =
      error instanceof Error
        ? error.message
        : "Une erreur inconnue est survenue.";

    return NextResponse.json(
      {
        error: "Impossible de contacter le cerveau IA.",
        details:
          process.env.NODE_ENV === "development" ? message : undefined,
      },
      { status: 500 },
    );
  }
}


