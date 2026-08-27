import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../../../../lib/auth/session";
import { prisma } from "../../../../../../lib/prisma";

export const runtime = "nodejs";

function parseReceptionId(value: string) {
  const id = Number(value);

  return Number.isInteger(id) && id > 0
    ? id
    : null;
}

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      id: string;
      documentId: string;
    }>;
  },
) {
  const auth = await getCurrentSession();

  if (!auth) {
    return NextResponse.json(
      {
        error: "Authentification requise.",
      },
      {
        status: 401,
      },
    );
  }

  const {
    id,
    documentId,
  } = await context.params;

  const receptionId =
    parseReceptionId(id);

  if (!receptionId) {
    return NextResponse.json(
      {
        error:
          "Identifiant de réception invalide.",
      },
      {
        status: 400,
      },
    );
  }

  if (!documentId.trim()) {
    return NextResponse.json(
      {
        error:
          "Identifiant de document invalide.",
      },
      {
        status: 400,
      },
    );
  }

  const document =
    await prisma.receptionDocument.findFirst({
      where: {
        id: documentId,
        receptionId,
        companyId:
          auth.company.id,
      },
      select: {
        id: true,
        name: true,
        contentType: true,
        size: true,
        content: true,
        capturedAt: true,
        reception: {
          select: {
            id: true,
            number: true,
          },
        },
      },
    });

  if (!document) {
    return NextResponse.json(
      {
        error:
          "Bon de livraison introuvable.",
      },
      {
        status: 404,
      },
    );
  }

  const safeName =
    document.name
      .replace(/["\r\n]/g, "")
      .trim() ||
    `BL-${document.reception.number}.jpg`;

  return new Response(
    new Uint8Array(document.content),
    {
      status: 200,
      headers: {
        "Content-Type":
          document.contentType ||
          "application/octet-stream",

        "Content-Length":
          String(document.size),

        "Content-Disposition":
          `inline; filename="${safeName}"`,

        "Cache-Control":
          "private, no-store, max-age=0",

        "X-Content-Type-Options":
          "nosniff",
      },
    },
  );
}
