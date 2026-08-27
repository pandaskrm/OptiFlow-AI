import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../../lib/auth/session";
import { prisma } from "../../../../lib/prisma";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

type PickupAnalysis = {
  carrier: string | null;
  pickupDate: string | null;
  pickupTime: string | null;
  pallets: number | null;
  packages: number | null;
  weightKg: number | null;
  reference: string | null;
  destination: string | null;
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
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(
      value
        .replace(",", ".")
        .replace(/[^\d.-]/g, ""),
    );

    return Number.isFinite(parsed)
      ? parsed
      : null;
  }

  return null;
}

function safeString(value: unknown) {
  return typeof value === "string" && value.trim()
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
    const formData = await request.formData();
    const file = formData.get("file");

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

    const apiKey = process.env.OPENAI_API_KEY;

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
Tu analyses une photographie d'une demande d'enlèvement transporteur
dans un entrepôt logistique français.

Lis uniquement les informations réellement visibles sur le document.

Retourne STRICTEMENT un objet JSON avec cette structure :

{
  "carrier": string | null,
  "pickupDate": string | null,
  "pickupTime": string | null,
  "pallets": number | null,
  "packages": number | null,
  "weightKg": number | null,
  "reference": string | null,
  "destination": string | null,
  "notes": string | null,
  "confidence": number
}

Règles impératives :
- N'invente aucune information.
- Une donnée absente ou illisible doit être null.
- pickupDate doit être au format YYYY-MM-DD uniquement si la date est certaine.
- pickupTime doit être au format HH:MM uniquement si l'heure est certaine.
- weightKg doit contenir uniquement le poids en kilogrammes.
- pallets correspond au nombre de palettes.
- packages correspond au nombre de colis.
- carrier correspond au transporteur réellement identifié.
- reference correspond à la référence d'enlèvement ou de dossier si elle existe.
- destination correspond à la destination si elle apparaît.
- notes contient seulement une information utile réellement présente qui ne rentre pas dans les autres champs.
- confidence est compris entre 0 et 1.
- Aucun markdown.
- Aucun commentaire hors JSON.
`.trim();

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
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

    const result = await response.json();

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
                }) => item.content ?? [],
              )
              .map((item: { text?: string }) =>
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

    let parsed: Record<string, unknown>;

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

    const analysis: PickupAnalysis = {
      carrier: safeString(parsed.carrier),
      pickupDate:
        safeString(parsed.pickupDate),
      pickupTime:
        safeString(parsed.pickupTime),
      pallets:
        safeNumber(parsed.pallets),
      packages:
        safeNumber(parsed.packages),
      weightKg:
        safeNumber(parsed.weightKg),
      reference:
        safeString(parsed.reference),
      destination:
        safeString(parsed.destination),
      notes:
        safeString(parsed.notes),
      confidence:
        Math.min(
          1,
          Math.max(
            0,
            safeNumber(parsed.confidence) ?? 0,
          ),
        ),
    };

    let matchedCarrier = null;

    if (analysis.carrier) {
      matchedCarrier =
        await prisma.carrier.findFirst({
          where: {
            companyId: auth.company.id,
            isActive: true,
            name: {
              contains: analysis.carrier,
              mode: "insensitive",
            },
          },
          select: {
            id: true,
            name: true,
            email: true,
            secondaryEmail: true,
            contactName: true,
          },
        });
    }

    return NextResponse.json({
      success: true,
      file: {
        name: file.name,
        type: file.type,
        size: file.size,
      },
      analysis,
      carrier: matchedCarrier,
      requiresReview:
        analysis.confidence < 0.8 ||
        !analysis.carrier,
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
