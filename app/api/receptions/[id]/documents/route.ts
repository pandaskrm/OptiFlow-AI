import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../../../lib/auth/session";
import { prisma } from "../../../../../lib/prisma";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 12 * 1024 * 1024;

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

  const { id } = await context.params;

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

  const reception =
    await prisma.reception.findFirst({
      where: {
        id: receptionId,
        companyId: auth.company.id,
      },
      select: {
        id: true,
        number: true,
      },
    });

  if (!reception) {
    return NextResponse.json(
      {
        error:
          "Réception introuvable.",
      },
      {
        status: 404,
      },
    );
  }

  const documents =
    await prisma.receptionDocument.findMany({
      where: {
        receptionId,
        companyId: auth.company.id,
      },
      orderBy: {
        capturedAt: "desc",
      },
      select: {
        id: true,
        type: true,
        name: true,
        contentType: true,
        size: true,
        capturedAt: true,
        createdAt: true,
      },
    });

  return NextResponse.json({
    success: true,
    reception: {
      id: reception.id,
      number: reception.number,
    },
    documents,
  });
}

export async function POST(
  request: Request,
  context: {
    params: Promise<{
      id: string;
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

  if (![
    "OWNER",
    "ADMIN",
    "LOGISTICS_MANAGER",
    "TEAM_LEADER",
  ].includes(auth.membership.role)) {
    return NextResponse.json(
      { error: "Accès opérationnel non autorisé." },
      { status: 403 },
    );
  }

  const { id } = await context.params;

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

  const reception =
    await prisma.reception.findFirst({
      where: {
        id: receptionId,
        companyId: auth.company.id,
      },
      select: {
        id: true,
        number: true,
        supplier: true,
        carrier: true,
        dock: true,
        status: true,
      },
    });

  if (!reception) {
    return NextResponse.json(
      {
        error:
          "Réception introuvable.",
      },
      {
        status: 404,
      },
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
            "Aucun bon de livraison reçu.",
        },
        {
          status: 400,
        },
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          error:
            "Le bon de livraison doit être une image.",
        },
        {
          status: 400,
        },
      );
    }

    if (file.size <= 0) {
      return NextResponse.json(
        {
          error:
            "Le fichier est vide.",
        },
        {
          status: 400,
        },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error:
            "Le fichier dépasse la taille maximale de 12 Mo.",
        },
        {
          status: 413,
        },
      );
    }

    const content =
      Buffer.from(
        await file.arrayBuffer(),
      );

    const document =
      await prisma.receptionDocument.create({
        data: {
          companyId:
            auth.company.id,
          receptionId,
          type:
            "DELIVERY_NOTE",
          name:
            file.name ||
            `BL-${reception.number}.jpg`,
          contentType:
            file.type ||
            "image/jpeg",
          size:
            file.size,
          content,
        },
        select: {
          id: true,
          type: true,
          name: true,
          contentType: true,
          size: true,
          capturedAt: true,
          createdAt: true,
        },
      });

    await prisma.auditLog.create({
      data: {
        companyId:
          auth.company.id,
        actorId:
          auth.user.id,
        action:
          "RECEPTION_DOCUMENT_CREATED",
        entityType:
          "ReceptionDocument",
        entityId:
          document.id,
        details:
          JSON.stringify({
            receptionId,
            receptionNumber:
              reception.number,
            documentType:
              document.type,
            documentName:
              document.name,
          }),
      },
    });

    return NextResponse.json(
      {
        success: true,
        reception: {
          id: reception.id,
          number:
            reception.number,
          supplier:
            reception.supplier,
          carrier:
            reception.carrier,
          dock:
            reception.dock,
          status:
            reception.status,
        },
        document,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Reception document upload error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Impossible d'enregistrer le bon de livraison.",
      },
      {
        status: 500,
      },
    );
  }
}
