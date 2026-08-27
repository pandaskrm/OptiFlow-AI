import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../../lib/auth/session";
import { prisma } from "../../../../lib/prisma";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

type PickupRequestAnalysis = {
  customer: string | null;
  address: string | null;
  reference: string | null;
  pallets: number | null;
  packages: number | null;
  weightKg: number | null;
  notes: string | null;
  confidence: number;
};

function cleanJsonBlock(value: string) {
  return value
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function safeNumber(value: unknown) {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value;
  }

  if (
    typeof value === "string" &&
    value.trim()
  ) {
    const normalized = value
      .replace(/\s/g, "")
      .replace(",", ".")
      .replace(/[^\d.-]/g, "");

    const parsed = Number(normalized);

    return Number.isFinite(parsed)
      ? parsed
      : null;
  }

  return null;
}

function safeString(value: unknown) {
  return typeof value === "string" &&
    value.trim()
    ? value.trim()
    : null;
}

export async function POST(request: Request) {
  const auth = await getCurrentSession();

  if (!auth) {
    return NextResponse.json(
      { error: "Non authentifié." },
      { status: 401 },
    );
  }

  try {
    const formData =
      await request.formData();

    const file =
      formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error:
            "Aucune photo de demande d'enlèvement reçue.",
        },
        { status: 400 },
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          error:
            "Le fichier doit être une image.",
        },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error:
            "L'image dépasse la taille maximale de 10 Mo.",
        },
        { status: 413 },
      );
    }

    const apiKey =
      process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "OPENAI_API_KEY n'est pas configurée.",
        },
        { status: 500 },
      );
    }

    const bytes = Buffer.from(
      await file.arrayBuffer(),
    );

    const dataUrl =
      `data:${file.type};base64,${bytes.toString("base64")}`;

    const prompt = `
Tu analyses une photographie d'une feuille interne intitulée
"DEMANDE D'ENLEVEMENT DE PALETTES".

Cette feuille est envoyée ensuite à ALL SOLUTIONS.

IMPORTANT :
ALL SOLUTIONS n'est pas une donnée à rechercher dans le document.
C'est le destinataire connu du workflow.

Lis uniquement les informations réellement visibles sur la feuille.

Retourne STRICTEMENT un objet JSON :

{
  "customer": string | null,
  "address": string | null,
  "reference": string | null,
  "pallets": number | null,
  "packages": number | null,
  "weightKg": number | null,
  "notes": string | null,
  "confidence": number
}

Règles impératives :

- N'invente jamais une information.
- Une donnée absente ou illisible doit être null.
- customer = valeur réellement écrite dans le champ Client.
- address = adresse réellement visible sous le client.
- reference = référence commande / référence client visible.
- pallets = nombre de palettes.
- packages = nombre de colis.
- weightKg = poids total exprimé en kilogrammes.
- Si le document indique des tonnes, convertis uniquement si l'unité est parfaitement certaine.
- notes = seulement une information utile réellement visible qui ne correspond pas aux autres champs.
- confidence doit être compris entre 0 et 1.
- Ne cherche PAS un transporteur.
- Ne cherche PAS une date d'enlèvement.
- Ne cherche PAS une heure.
- Ne cherche PAS une destination transport.
- Aucun markdown.
- Aucun texte hors JSON.
`.trim();

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          Authorization:
            `Bearer ${apiKey}`,
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          model:
            process.env.OPENAI_MODEL ||
            "gpt-4.1-mini",
          input: [
            {
              role: "user",
              content: [
                {
                  type: "input_text",
                  text: prompt,
                },
                {
                  type: "input_image",
                  image_url: dataUrl,
                },
              ],
            },
          ],
        }),
      },
    );

    const result =
      await response.json();

    if (!response.ok) {
      console.error(
        "OpenAI pickup scan error:",
        result,
      );

      return NextResponse.json(
        {
          error:
            "L'analyse IA du document a échoué.",
        },
        { status: 502 },
      );
    }

    const outputText =
      typeof result.output_text === "string"
        ? result.output_text
        : Array.isArray(result.output)
          ? result.output
              .flatMap(
                (item: {
                  content?: Array<{
                    type?: string;
                    text?: string;
                  }>;
                }) =>
                  item.content ?? [],
              )
              .map(
                (item: {
                  text?: string;
                }) =>
                  item.text ?? "",
              )
              .join("")
          : "";

    if (!outputText.trim()) {
      return NextResponse.json(
        {
          error:
            "L'IA n'a retourné aucune analyse exploitable.",
        },
        { status: 502 },
      );
    }

    let parsed:
      Record<string, unknown>;

    try {
      parsed = JSON.parse(
        cleanJsonBlock(outputText),
      ) as Record<string, unknown>;
    } catch {
      console.error(
        "Invalid pickup scan JSON:",
        outputText,
      );

      return NextResponse.json(
        {
          error:
            "La réponse IA n'a pas pu être interprétée.",
        },
        { status: 502 },
      );
    }

    const analysis:
      PickupRequestAnalysis = {
        customer:
          safeString(parsed.customer),
        address:
          safeString(parsed.address),
        reference:
          safeString(parsed.reference),
        pallets:
          safeNumber(parsed.pallets),
        packages:
          safeNumber(parsed.packages),
        weightKg:
          safeNumber(parsed.weightKg),
        notes:
          safeString(parsed.notes),
        confidence:
          Math.min(
            1,
            Math.max(
              0,
              safeNumber(
                parsed.confidence,
              ) ?? 0,
            ),
          ),
      };

    const allSolutions =
      await prisma.carrier.findFirst({
        where: {
          companyId: auth.company.id,
          isActive: true,
          OR: [
            {
              name: {
                contains:
                  "ALL SOLUTIONS",
                mode: "insensitive",
              },
            },
            {
              code: {
                contains:
                  "ALL",
                mode: "insensitive",
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          email: true,
          secondaryEmail: true,
          contactName: true,
        },
      });

    const missingRequiredFields = [
      analysis.reference
        ? null
        : "reference",
      analysis.pallets !== null
        ? null
        : "pallets",
      analysis.packages !== null
        ? null
        : "packages",
      analysis.weightKg !== null
        ? null
        : "weightKg",
    ].filter(
      (value): value is string =>
        value !== null,
    );

    return NextResponse.json({
      success: true,

      workflow:
        "ALL_SOLUTIONS_PICKUP_REQUEST",

      recipient: {
        name:
          allSolutions?.name ??
          "ALL SOLUTIONS",
        carrierId:
          allSolutions?.id ?? null,
        email:
          allSolutions?.email ?? null,
        secondaryEmail:
          allSolutions?.secondaryEmail ??
          null,
        contactName:
          allSolutions?.contactName ??
          null,
      },

      file: {
        name: file.name,
        type: file.type,
        size: file.size,
      },

      analysis,

      missingRequiredFields,

      requiresReview:
        analysis.confidence < 0.8 ||
        missingRequiredFields.length > 0,
    });
  } catch (error) {
    console.error(
      "Pickup scan error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Impossible d'analyser la demande d'enlèvement.",
      },
      { status: 500 },
    );
  }
}
