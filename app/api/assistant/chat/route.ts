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
};

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
- rester concis sauf lorsque l'utilisateur demande une analyse détaillée.

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
- Données ERP réelles : non transmises dans cette première version
`;

    const client = new OpenAI({ apiKey });

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5",
      instructions: `${SYSTEM_PROMPT}\n${context}`,
      input: safeMessages,
    });

    const answer = response.output_text?.trim();

    if (!answer) {
      return NextResponse.json(
        { error: "Le cerveau IA n'a retourné aucune réponse." },
        { status: 502 },
      );
    }

    return NextResponse.json({ answer });
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

