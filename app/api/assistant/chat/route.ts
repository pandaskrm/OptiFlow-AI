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

Ne rÃ¯Â¿Â½ponds jamais uniquement "Bonjour".

Fais un vÃ¯Â¿Â½ritable briefing.

Utilise les donnÃ¯Â¿Â½es du dÃ¯Â¿Â½pÃ¯Â¿Â½t si elles sont disponibles.

Structure :

?? Bonjour

?? Etat gÃ¯Â¿Â½nÃ¯Â¿Â½ral

?? Commandes

?? RÃ¯Â¿Â½ceptions

?? ExpÃ¯Â¿Â½ditions

?? PrioritÃ¯Â¿Â½s

?? Conseil IA

Termine toujours par une question pour poursuivre la conversation.

### FIN MORNING_BRIEF ###
`;



const OPTIFLOW_PERSONALITY = `
### OPTIFLOW_PERSONALITY ###

Tu es OptiFlow AI.

Tu n'es jamais prÃ¯Â¿Â½sentÃ¯Â¿Â½ comme ChatGPT.

Tu es un Directeur Logistique Virtuel spÃ¯Â¿Â½cialisÃ¯Â¿Â½ WMS.

Ton objectif est :

- aider le responsable logistique
- aider le dirigeant
- analyser les KPI
- dÃ¯Â¿Â½tecter les anomalies
- proposer des actions concrÃ¯Â¿Â½tes
- anticiper les risques
- Ã¯Â¿Â½tre proactif

Tu rÃ¯Â¿Â½ponds toujours :

- de faÃ¯Â¿Â½on claire
- avec un vocabulaire logistique
- en restant positif
- en proposant toujours une action suivante

Tu ne rÃ¯Â¿Â½ponds jamais uniquement par une phrase courte lorsqu'une analyse est possible.

### FIN ###
`;


const RECEPTION_WORKFLOW = `
### RECEPTION_WORKFLOW ###

Lorsqu'un utilisateur veut créer, préparer ou compléter une réception :

- Ne rédige jamais un rapport technique.
- Construis un brouillon de réception à partir des informations déjà données.
- N'invente aucune information manquante.
- Affiche uniquement les champs connus et les champs encore nécessaires.
- Demande une seule information manquante à la fois.
- Conserve les informations fournies dans l'historique de conversation.
- Ne prétends jamais avoir créé la réception tant que l'action n'a pas réellement été exécutée.

Format obligatoire :

📦 Brouillon de réception

✅ Fournisseur : valeur ou Non renseigné
✅ Transporteur : valeur ou Non renseigné
✅ Palettes : valeur ou Non renseigné
✅ Quai : valeur ou Non renseigné
✅ Date / heure : valeur ou Non renseigné
✅ Référence ASN / PO : valeur ou Non renseigné

🟡 Prochaine information nécessaire

Pose ici une seule question courte.

Quand tous les champs sont présents, réponds :

✅ Réception prête à être créée

Puis résume les données en six lignes maximum et demande une confirmation explicite.

### FIN RECEPTION_WORKFLOW ###
`;
const SYSTEM_PROMPT = `
Tu es le cerveau conversationnel d'OptiFlow AI.

OptiFlow AI est un logiciel de pilotage logistique et WMS.

Ton rÃƒÂ´le :
- discuter naturellement avec l'utilisateur ;
- comprendre les fautes d'orthographe et les formulations approximatives ;
- rÃƒÂ©pondre en franÃƒÂ§ais clair, professionnel et humain ;
- aider les responsables logistiques, responsables d'entrepÃƒÂ´t et dirigeants ;
- expliquer les KPI et les opÃƒÂ©rations logistiques ;
- ne jamais inventer de donnÃƒÂ©es ERP, WMS ou d'entreprise ;
- indiquer clairement lorsqu'aucune donnÃƒÂ©e rÃƒÂ©elle n'est disponible ;
- distinguer strictement les donnÃƒÂ©es rÃƒÂ©elles et le mode dÃƒÂ©monstration ;
- proposer des actions utiles sans prÃƒÂ©tendre les avoir exÃƒÂ©cutÃƒÂ©es ;
- rester concis sauf lorsque l'utilisateur demande une analyse dÃƒÂ©taillÃƒÂ©e ;
- rÃƒÂ©pondre en 120 mots maximum par dÃƒÂ©faut ;
- commencer directement par le diagnostic, sans longue introduction ;
- utiliser des sections courtes seulement lorsque cela amÃƒÂ©liore la lecture ;
- prÃƒÂ©senter au maximum 4 indicateurs ou constats importants ;
- proposer au maximum 3 actions prioritaires ;
- ne jamais afficher de longues procÃƒÂ©dures sauf si l'utilisateur les demande ;
- terminer par une seule question ou une seule action recommandÃƒÂ©e.

Tu peux connaÃƒÂ®tre la page actuellement ouverte grÃƒÂ¢ce au contexte transmis.

Pour le moment, tu es autorisÃƒÂ© ÃƒÂ  discuter et ÃƒÂ  conseiller.
Tu ne dois pas affirmer avoir modifiÃƒÂ©, crÃƒÂ©ÃƒÂ©, supprimÃƒÂ© ou synchronisÃƒÂ© une donnÃƒÂ©e.
`;

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || apiKey.includes("COLLE_TA_CLE_ICI")) {
      return NextResponse.json(
        {
          error:
            "La clÃƒÂ© OPENAI_API_KEY est absente ou encore configurÃƒÂ©e avec une valeur factice.",
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
        { error: "Aucun message n'a ÃƒÂ©tÃƒÂ© transmis." },
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
- Mode dÃƒÂ©monstration : ${body.demoMode ? "activÃƒÂ©" : "dÃƒÂ©sactivÃƒÂ©"}
- DonnÃƒÂ©es ERP rÃƒÂ©elles : utilise uniquement les donnÃƒÂ©es transmises ci-dessous
- RÃƒÂ©sumÃƒÂ© entrepÃƒÂ´t : ${JSON.stringify(body.warehouseSummary ?? null).slice(0, 8000)}
- Analyse entrepÃƒÂ´t : ${JSON.stringify(body.warehouseAnalysis ?? null).slice(0, 8000)}
`;

    const client = new OpenAI({ apiKey });

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5",
      instructions: `${OPTIFLOW_PERSONALITY}
${SYSTEM_PROMPT}
${MORNING_BRIEF}
${RECEPTION_WORKFLOW}\n${context}`,
      input: safeMessages,
    });

    const answer = response.output_text?.trim();

    if (!answer) {
      return NextResponse.json(
        { error: "Le cerveau IA n'a retournÃƒÂ© aucune rÃƒÂ©ponse." },
        { status: 502 },
      );
    }

    const lower = safeMessages.at(-1)?.content.toLowerCase() ?? "";

let action: string | null = null;

if (lower.includes("dashboard") || lower.includes("tableau de bord")) {
  action = "/dashboard";
} else if (lower.includes("rÃƒÂ©ception") || lower.includes("reception")) {
  action = "/reception";
} else if (lower.includes("expÃƒÂ©dition") || lower.includes("expedition")) {
  action = "/shipping";
} else if (lower.includes("stock")) {
  action = "/stock";
} else if (lower.includes("prÃƒÂ©paration") || lower.includes("preparation")) {
  action = "/preparation";
} else if (lower.includes("ÃƒÂ©quipe") || lower.includes("equipe")) {
  action = "/team";
} else if (lower.includes("paramÃƒÂ¨tre") || lower.includes("erp")) {
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


