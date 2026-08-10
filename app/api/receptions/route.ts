import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../lib/auth/session";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const auth = await getCurrentSession();

    if (!auth) {
      return NextResponse.json(
        { message: "Authentification requise." },
        { status: 401 },
      );
    }

    const receptions = await prisma.reception.findMany({
      where: {
        companyId: auth.company.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(receptions);
    } catch (error) {
    console.error("Reception create error:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          message:
            "Ce numéro de réception existe déjà. Utilisez un numéro différent.",
          code: "DUPLICATE_RECEPTION_NUMBER",
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      {
        message:
          "La réception n'a pas pu être enregistrée.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getCurrentSession();

    if (!auth) {
      return NextResponse.json(
        { message: "Authentification requise." },
        { status: 401 },
      );
    }

    const body = await request.json();

    const supplier =
      typeof body.supplier === "string"
        ? body.supplier.trim()
        : "";

    const pallets = Number(body.pallets);

    const scheduledAt =
      typeof body.scheduledAt === "string"
        ? body.scheduledAt.trim()
        : "";

    if (!supplier) {
      return NextResponse.json(
        { message: "Le fournisseur est obligatoire." },
        { status: 400 },
      );
    }

    if (!Number.isInteger(pallets) || pallets <= 0) {
      return NextResponse.json(
        {
          message:
            "Le nombre de palettes doit être supérieur à zéro.",
        },
        { status: 400 },
      );
    }

    if (!scheduledAt) {
      return NextResponse.json(
        { message: "La date et l'heure sont obligatoires." },
        { status: 400 },
      );
    }

    const requestedNumber =
      typeof body.number === "string"
        ? body.number.trim()
        : "";

    const carrier =
      typeof body.carrier === "string" &&
      body.carrier.trim()
        ? body.carrier.trim()
        : "Non renseigné";

    const dock =
      typeof body.dock === "string" &&
      body.dock.trim()
        ? body.dock.trim()
        : "À attribuer";

    const reception = await prisma.reception.create({
      data: {
        number:
          requestedNumber ||
          `REC-AI-${Date.now()}`,
        supplier,
        carrier,
        dock,
        pallets,
        status:
          typeof body.status === "string" &&
          body.status.trim()
            ? body.status.trim()
            : "Planifiée",
        scheduledAt,
        companyId: auth.company.id,
      },
    });

    return NextResponse.json(reception, {
      status: 201,
    });
  } catch (error) {
    console.error("Reception POST error:", error);

    return NextResponse.json(
      {
        message:
          "La réception n'a pas pu être enregistrée.",
      },
      { status: 500 },
    );
  }
}
