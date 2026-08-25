import {
  buildDecisionContext,
  buildSafeDecisionInstruction,
  buildDeterministicDecisionAnswer,
} from "../../../../lib/ai/decisionEngine";
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
  simulationState?: unknown;
  warehouseSummary?: unknown;
warehouseAnalysis?: unknown;
};


const MORNING_BRIEF = `
### MORNING_BRIEF ###

Si le premier message de l'utilisateur est un simple bonjour, salut, hello, bonsoir ou coucou :

Ne r?ponds jamais uniquement "Bonjour".
Fais un v?ritable briefing.
Utilise les donn?es du d?p?t si elles sont disponibles.

Structure courte :
- Bonjour
- Commandes
- R?ceptions
- Exp?ditions
- Priorit?s
- Conseil IA

Ne compl?te jamais une donn?e absente.
Termine par une seule question utile pour poursuivre la conversation.

### FIN MORNING_BRIEF ###
`;



const RECEPTION_WORKFLOW = `
### RECEPTION_WORKFLOW ###

Lorsqu'un utilisateur veut cr?er, pr?parer ou compl?ter une r?ception :

- Ne cr?e jamais imm?diatement la r?ception.
- Construis d'abord un brouillon.
- N'invente aucune information manquante.
- Conserve les informations d?j? donn?es dans la conversation.
- Demande une seule information manquante ? la fois.
- Avant toute cr?ation, demande une confirmation explicite.

Champs n?cessaires :
- fournisseur ;
- nombre de palettes ;
- date et heure pr?vues.

Champs facultatifs :
- transporteur ;
- quai ;
- num?ro de r?ception.

Quand les informations n?cessaires sont pr?sentes, pr?sente un r?capitulatif court puis demande confirmation.

Apr?s confirmation explicite uniquement, tu peux produire :

[[CREATE_RECEPTION:{"number":"REC-2026-001","supplier":"Fournisseur","carrier":"Transporteur","dock":"1","pallets":10,"scheduledAt":"2026-08-25T10:00"}]]

R?gles :
- JSON valide uniquement ;
- pallets doit ?tre un nombre ;
- scheduledAt utilise YYYY-MM-DDTHH:mm ;
- n'invente jamais une valeur obligatoire ;
- ne produis jamais CREATE_RECEPTION avant confirmation.

### FIN RECEPTION_WORKFLOW ###
`;
const OPTIONAL_RECEPTION_FIELDS = `
### OPTIONAL_RECEPTION_FIELDS ###

Pour cr?er une r?ception, les informations obligatoires sont :
- fournisseur ;
- nombre de palettes ;
- date et heure pr?vues.

Les champs suivants sont facultatifs :
- transporteur ;
- quai ;
- num?ro de r?ception.

Si le transporteur manque, utilise :
Non renseign?

Si le quai manque, utilise :
Non attribu?

Le num?ro de r?ception peut ?tre g?n?r? au moment de la cr?ation si n?cessaire.

Ne bloque jamais la cr?ation uniquement parce que le transporteur, le quai ou le num?ro manque.

Avant toute cr?ation, demande toujours une confirmation explicite.

### FIN OPTIONAL_RECEPTION_FIELDS ###
`;

const LIBOT_FAST_CORE = `
### LIBOT FAST CORE ###

ROLE
Tu es Libot, cerveau operationnel d'OrganIA.
Tu reponds en francais clair, professionnel, naturel et concis.

COMPREHENSION
Comprends l'intention reelle meme avec fautes, formulations courtes
ou references au contexte :
"ca donne quoi ?", "pourquoi ?", "et maintenant ?", "tu ferais quoi ?".

SOURCE DE VERITE
1. Si simulationState existe, utilise-la comme source operationnelle prioritaire.
2. Sinon utilise uniquement les donnees ERP, resume et analyse transmises.
3. Une ancienne information de conversation ne remplace jamais
   l'instantane operationnel courant.
4. N'invente jamais une donnee absente.

VERITE METIER
Distingue mentalement :
- FAIT : directement present dans les donnees.
- CALCUL : obtenu uniquement a partir de faits disponibles.
- HYPOTHESE : explication possible non prouvee.
- RECOMMANDATION : action proposee.

Ne presente jamais une hypothese comme un fait.

PRIORITES
Si priorityOrders est explicitement present dans l'instantane courant :
- le nombre de commandes prioritaires est un FAIT ;
- tu peux le citer et recommander de traiter ces commandes ;
- n'invente jamais leur identite, leur client, leur echeance ou la raison de leur priorite ;
- ne dis jamais qu'une commande precise est prioritaire sans donnee explicite.

INTERDIT D'INVENTER
N'invente jamais :
- heure de coupe ou SLA ;
- identite d'une commande ou d'un client prioritaire si elle n'est pas fournie ;
- capacite picking ou packing ;
- collaborateur ou absence ;
- rupture ou reference produit ;
- panne ou blocage ;
- retard ;
- cause racine ;
- delai ou heure de fin.

Si une information manque, mentionne-la uniquement si elle est necessaire.

DIAGNOSTIC
Localise d'abord le probleme visible.
Ne transforme pas un secteur fluide en probleme hypothetique.

Si le backlog preparation est eleve et les autres flux sont stables,
indique que le ralentissement est localise a la preparation.
Ne pretend pas connaitre la cause exacte sans preuve.

CAUSE
Annonce une cause certaine uniquement si les donnees la demontrent.

Si la cause exacte n'est pas presente dans les donnees :
- dis clairement que la cause racine n'est pas identifiable avec l'instantane disponible ;
- ne propose pas spontanement de cause technique specifique ;
- n'invente pas WMS, vagues, missions, allocation, regles de liberation,
  verrous d'emplacements, panne applicative ou incident systeme ;
- propose seulement des controles operationnels generiques fondes sur les faits visibles.

Tu peux formuler une hypothese specifique uniquement si l'utilisateur te demande explicitement
"quelles causes possibles ?" ou "quelles hypotheses ?".
Dans ce cas, marque chaque hypothese comme non prouvee.

PREVISION
Pour confirmer une heure de fin, il faut une echeance et des donnees
suffisantes de cadence et de charge.
Sinon qualifie seulement le risque si les KPI le permettent.

DECISION
Pour "tu ferais quoi ?", "on fait quoi ?", "quelle priorite ?":
1. diagnostic ;
2. action immediate fondee sur les donnees connues ;
3. deuxieme action seulement si elle apporte quelque chose.

Ne base jamais la premiere action sur une donnee absente.

UTILISATION DES PRIORITES
Si priorityOrders est present :
- cite le nombre exact lorsque c'est utile au diagnostic ou a la decision ;
- tu peux recommander de concentrer les ressources disponibles sur ces commandes ;
- ne deduis jamais leur identite, leur client ou leur echeance.

Si priorityOrders est absent :
- ne suppose pas qu'il existe des commandes prioritaires.

DEMO
En mode demonstration, indique qu'il s'agit de la demo
et utilise reellement les chiffres transmis.

REPONSE
Question simple = reponse directe.
Question decisionnelle = diagnostic + action.
Question analytique = analyse structuree.

Par defaut :
- maximum 120 mots ;
- maximum 4 constats importants ;
- maximum 3 actions ;
- pas de longue introduction ;
- ne repete pas inutilement tous les KPI.

ACTIONS
Ne pretend jamais avoir execute une action qui ne l'a pas ete.
Respecte les confirmations obligatoires avant toute action sensible.

### FIN LIBOT FAST CORE ###
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
- Mode demonstration : ${body.demoMode ? "active" : "desactive"}
- Etat simulation courant : ${JSON.stringify(body.simulationState ?? null).slice(0, 12000)}
- Donnees ERP reelles : utilise uniquement les donnees transmises ci-dessous
- Resume entrepot : ${JSON.stringify(body.warehouseSummary ?? null).slice(0, 8000)}
- Analyse entrepot : ${JSON.stringify(body.warehouseAnalysis ?? null).slice(0, 8000)}

### PRIORITE_SOURCE_DE_DONNEES ###

Si "Etat simulation courant" n'est pas null :
- c'est la source de verite operationnelle prioritaire ;
- utilise ses chiffres pour repondre ;
- ne demande jamais une donnee deja presente ;
- ne remplace jamais ses chiffres par ceux du resume ERP ;
- indique qu'il s'agit du scenario de demonstration.

Si "Etat simulation courant" est null :
- utilise uniquement le resume entrepot et l'analyse entrepot disponibles.

Si aucune source ne contient une information :
- dis clairement que cette donnee n'est pas disponible ;
- ne l'invente jamais.

### FIN PRIORITE_SOURCE_DE_DONNEES ###
`;

    const client = new OpenAI({ apiKey });

    // Conserve uniquement les échanges récents pour réduire la latence.
    // La mémoire longue reste côté application, mais le modèle n'a pas
    // besoin de relire toute la conversation à chaque requête.
    const modelMessages = safeMessages.slice(-8);

    const latestQuestion =
      modelMessages.at(-1)?.content.toLowerCase() ?? "";

    const normalizedLatestQuestion = latestQuestion
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const needsReceptionWorkflow =
      normalizedLatestQuestion.includes("reception") &&
      (
        normalizedLatestQuestion.includes("cree") ||
        normalizedLatestQuestion.includes("creer") ||
        normalizedLatestQuestion.includes("ajoute") ||
        normalizedLatestQuestion.includes("ajouter") ||
        normalizedLatestQuestion.includes("planifie") ||
        normalizedLatestQuestion.includes("planifier") ||
        normalizedLatestQuestion.includes("fournisseur") ||
        normalizedLatestQuestion.includes("palette")
      );

    const needsMorningBrief =
      /\b(bonjour|salut|hello|coucou)\b/.test(
        normalizedLatestQuestion,
      );

    const asksForCause =
      /\b(pourquoi|cause|ca coince|ca bloque|origine|raison)\b/.test(
        normalizedLatestQuestion,
      );

    const asksForDecision =
      /\b(tu ferais quoi|que ferais tu|on fait quoi|quoi faire|quelle priorite|tu me conseilles quoi|tu me conseil quoi)\b/.test(
        normalizedLatestQuestion,
      );

    const DECISION_TRUTH = `
### DECISION TRUTH ###

L'utilisateur demande quoi faire.

REGLE ABSOLUE :
Une action technique specifique doit etre fondee sur une cause ou un blocage
explicitement present dans les donnees courantes.

Si les donnees montrent seulement un symptome et que la cause racine
n'est pas connue :
- ne propose AUCUNE procedure WMS ou ERP specifique, meme comme hypothese,
  test, controle conditionnel ou exemple ;
- ne cite pas de vague, allocation, mission, verrou, zone en hold,
  regle de liberation, seuil, unite logistique, journal ou log
  si ces elements ne sont pas presents dans les donnees ;
- recommande d'abord de controler pourquoi le flux concerne n'avance pas ;
- indique quels faits operationnels doivent etre verifies sans inventer
  le mecanisme technique responsable ;
- une fois la cause reellement identifiee, seulement alors propose
  l'action corrective adaptee.

Pour "tu ferais quoi a ma place ?", raisonne ainsi :
1. localiser le probleme prouve ;
2. proteger les autres flux qui fonctionnent ;
3. verifier la cause du dysfonctionnement ;
4. agir uniquement sur la cause constatee ;
5. suivre l'evolution du KPI concerne.

Ne confonds jamais "action utile a investiguer" et "solution technique prouvee".

### FIN DECISION TRUTH ###
`;

    const CAUSE_TRUTH = `
### CAUSE TRUTH ###
L'utilisateur demande la cause du probleme.

Reponds d'abord uniquement avec ce que les donnees prouvent.

Si la cause racine n'est pas explicitement presente dans les donnees :
- dis clairement que la cause exacte n'est pas encore determinee ;
- indique quel secteur ou indicateur montre le symptome ;
- ne genere pas spontanement une liste de causes possibles ;
- ne cite pas de vague WMS, allocation, verrou, emplacement, panne,
  regle WMS ou autre mecanisme technique absent des donnees.

Une hypothese technique peut etre proposee uniquement si l'utilisateur
demande explicitement des hypotheses, des pistes a verifier ou des
actions de diagnostic.

Ne transforme jamais une recommandation de controle en cause probable.
### FIN CAUSE TRUTH ###
`;

    console.log("[LIBOT INTENT]", {
      question: normalizedLatestQuestion,
      asksForCause,
      asksForDecision,
      needsReceptionWorkflow,
      needsMorningBrief,
    });

    const decisionContext = buildDecisionContext(
      body.simulationState,
    );

    const safeDecisionInstruction = buildSafeDecisionInstruction(
      body.simulationState,
      asksForDecision,
    );

    const deterministicDecision =
      asksForDecision
        ? buildDeterministicDecisionAnswer(body.simulationState)
        : null;

    if (deterministicDecision) {
      console.log("[LIBOT DECISION ENGINE]", {
        mode: "deterministic",
        answerChars: deterministicDecision.length,
        simulationChars: JSON.stringify(
          body.simulationState ?? null,
        ).length,
      });

      const payload =
        JSON.stringify({
          type: "delta",
          delta: deterministicDecision,
        }) +
        "\n" +
        JSON.stringify({
          type: "done",
          answer: deterministicDecision,
          action: null,
        }) +
        "\n";

      return new Response(payload, {
        headers: {
          "Content-Type": "application/x-ndjson; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "X-Accel-Buffering": "no",
        },
      });
    }

    const libotStartedAt = Date.now();

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5",
      instructions: [
        LIBOT_FAST_CORE,
        decisionContext,
        safeDecisionInstruction,
        context,
        needsReceptionWorkflow ? RECEPTION_WORKFLOW : "",
        needsReceptionWorkflow ? OPTIONAL_RECEPTION_FIELDS : "",
        needsMorningBrief ? MORNING_BRIEF : "",
        asksForCause ? CAUSE_TRUTH : "",
        asksForDecision ? DECISION_TRUTH : "",
      ].filter(Boolean).join("\n\n"),
      input: modelMessages,
      stream: true,
    });

    const lower = safeMessages.at(-1)?.content.toLowerCase() ?? "";

    let action: string | null = null;

    const normalizedLower = lower
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    const navigationRequested =
      /\b(ouvre|ouvrir|affiche|afficher|montre|montrer|va|aller|emmene|emmener|accede|acceder)\b/.test(
        normalizedLower,
      );

    if (navigationRequested) {
      if (
        normalizedLower.includes("dashboard") ||
        normalizedLower.includes("tableau de bord")
      ) {
        action = "/dashboard";
      } else if (normalizedLower.includes("reception")) {
        action = "/reception";
      } else if (
        normalizedLower.includes("expedition") ||
        normalizedLower.includes("shipping")
      ) {
        action = "/shipping";
      } else if (normalizedLower.includes("stock")) {
        action = "/stock";
      } else if (normalizedLower.includes("preparation")) {
        action = "/preparation";
      } else if (
        normalizedLower.includes("equipe") ||
        normalizedLower.includes("team")
      ) {
        action = "/team";
      } else if (
        normalizedLower.includes("parametre") ||
        normalizedLower.includes("erp")
      ) {
        action = "/parametres";
      } else if (
        normalizedLower.includes("direction") ||
        normalizedLower.includes("dirigeant")
      ) {
        action = "/executive";
      } else if (
        normalizedLower.includes("demo") ||
        normalizedLower.includes("demonstration")
      ) {
        action = "/demo";
      } else if (
        normalizedLower.includes("intelligence artificielle") ||
        normalizedLower === "ouvre ia" ||
        normalizedLower === "affiche ia"
      ) {
        action = "/ai";
      }
    }

    const instructionPayload = [
      LIBOT_FAST_CORE,
      context,
      needsReceptionWorkflow ? RECEPTION_WORKFLOW : "",
      needsReceptionWorkflow ? OPTIONAL_RECEPTION_FIELDS : "",
      needsMorningBrief ? MORNING_BRIEF : "",
    ].filter(Boolean).join("\n\n");

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        let answer = "";
        let firstTokenMs: number | null = null;

        try {
          for await (const event of response) {
            if (event.type === "response.output_text.delta") {
              const delta = event.delta || "";

              if (!delta) {
                continue;
              }

              if (firstTokenMs === null) {
                firstTokenMs = Date.now() - libotStartedAt;

                console.log("[LIBOT STREAM]", {
                  firstTokenMs,
                });
              }

              answer += delta;

              controller.enqueue(
                encoder.encode(
                  JSON.stringify({
                    type: "delta",
                    delta,
                  }) + "\n",
                ),
              );
            }
          }

          const libotOpenAiMs = Date.now() - libotStartedAt;

          console.log("[LIBOT PERF]", {
            openAiMs: libotOpenAiMs,
            firstTokenMs,
            instructionChars: instructionPayload.length,
            messageCount: modelMessages.length,
            simulationChars: JSON.stringify(body.simulationState ?? null).length,
            warehouseSummaryChars: JSON.stringify(body.warehouseSummary ?? null).length,
            warehouseAnalysisChars: JSON.stringify(body.warehouseAnalysis ?? null).length,
          });

          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                type: "done",
                answer: answer.trim(),
                action,
              }) + "\n",
            ),
          );

          controller.close();
        } catch (streamError) {
          console.error("Erreur streaming Libot :", streamError);

          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                type: "error",
                error: "Le streaming Libot a échoué.",
              }) + "\n",
            ),
          );

          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
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


