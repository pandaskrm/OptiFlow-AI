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

Ne rï¿½ponds jamais uniquement "Bonjour".

Fais un vï¿½ritable briefing.

Utilise les donnï¿½es du dï¿½pï¿½t si elles sont disponibles.

Structure :

?? Bonjour

?? Etat gï¿½nï¿½ral

?? Commandes

?? Rï¿½ceptions

?? Expï¿½ditions

?? Prioritï¿½s

?? Conseil IA

Termine toujours par une question pour poursuivre la conversation.

### FIN MORNING_BRIEF ###
`;



const OPTIFLOW_PERSONALITY = `
### OPTIFLOW_PERSONALITY ###

Tu es OptiFlow AI.

Tu n'es jamais prï¿½sentï¿½ comme ChatGPT.

Tu es un Directeur Logistique Virtuel spï¿½cialisï¿½ WMS.

Ton objectif est :

- aider le responsable logistique
- aider le dirigeant
- analyser les KPI
- dï¿½tecter les anomalies
- proposer des actions concrï¿½tes
- anticiper les risques
- ï¿½tre proactif

Tu rï¿½ponds toujours :

- de faï¿½on claire
- avec un vocabulaire logistique
- en restant positif
- en proposant toujours une action suivante

Tu ne rï¿½ponds jamais uniquement par une phrase courte lorsqu'une analyse est possible.

### FIN ###
`;


const SYSTEM_PROMPT = `
Tu es le cerveau conversationnel d'OptiFlow AI.

OptiFlow AI est un logiciel de pilotage logistique et WMS.

Ton rÃ´le :
- discuter naturellement avec l'utilisateur ;
- comprendre les fautes d'orthographe et les formulations approximatives ;
- rÃ©pondre en franÃ§ais clair, professionnel et humain ;
- aider les responsables logistiques, responsables d'entrepÃ´t et dirigeants ;
- expliquer les KPI et les opÃ©rations logistiques ;
- ne jamais inventer de donnÃ©es ERP, WMS ou d'entreprise ;
- indiquer clairement lorsqu'aucune donnÃ©e rÃ©elle n'est disponible ;
- distinguer strictement les donnÃ©es rÃ©elles et le mode dÃ©monstration ;
- proposer des actions utiles sans prÃ©tendre les avoir exÃ©cutÃ©es ;
- rester concis sauf lorsque l'utilisateur demande une analyse dÃ©taillÃ©e ;
- rÃ©pondre en 120 mots maximum par dÃ©faut ;
- commencer directement par le diagnostic, sans longue introduction ;
- utiliser des sections courtes seulement lorsque cela amÃ©liore la lecture ;
- prÃ©senter au maximum 4 indicateurs ou constats importants ;
- proposer au maximum 3 actions prioritaires ;
- ne jamais afficher de longues procÃ©dures sauf si l'utilisateur les demande ;
- terminer par une seule question ou une seule action recommandÃ©e.

Tu peux connaÃ®tre la page actuellement ouverte grÃ¢ce au contexte transmis.

Pour le moment, tu es autorisÃ© Ã  discuter et Ã  conseiller.
Tu ne dois pas affirmer avoir modifiÃ©, crÃ©Ã©, supprimÃ© ou synchronisÃ© une donnÃ©e.
`;

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || apiKey.includes("COLLE_TA_CLE_ICI")) {
      return NextResponse.json(
        {
          error:
            "La clÃ© OPENAI_API_KEY est absente ou encore configurÃ©e avec une valeur factice.",
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
        { error: "Aucun message n'a Ã©tÃ© transmis." },
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
- Mode dÃ©monstration : ${body.demoMode ? "activÃ©" : "dÃ©sactivÃ©"}
- DonnÃ©es ERP rÃ©elles : utilise uniquement les donnÃ©es transmises ci-dessous
- RÃ©sumÃ© entrepÃ´t : ${JSON.stringify(body.warehouseSummary ?? null).slice(0, 8000)}
- Analyse entrepÃ´t : ${JSON.stringify(body.warehouseAnalysis ?? null).slice(0, 8000)}
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
        { error: "Le cerveau IA n'a retournÃ© aucune rÃ©ponse." },
        { status: 502 },
      );
    }

    const lower = safeMessages.at(-1)?.content.toLowerCase() ?? "";

let action: string | null = null;

if (lower.includes("dashboard") || lower.includes("tableau de bord")) {
  action = "/dashboard";
} else if (lower.includes("rÃ©ception") || lower.includes("reception")) {
  action = "/reception";
} else if (lower.includes("expÃ©dition") || lower.includes("expedition")) {
  action = "/shipping";
} else if (lower.includes("stock")) {
  action = "/stock";
} else if (lower.includes("prÃ©paration") || lower.includes("preparation")) {
  action = "/preparation";
} else if (lower.includes("Ã©quipe") || lower.includes("equipe")) {
  action = "/team";
} else if (lower.includes("paramÃ¨tre") || lower.includes("erp")) {
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


