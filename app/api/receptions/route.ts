import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const receptions = await prisma.reception.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(receptions);
  } catch (error) {
    console.error(error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const reception = await prisma.reception.create({
      data: {
        number: body.number,
        supplier: body.supplier,
        carrier: body.carrier,
        dock: body.dock,
        pallets: Number(body.pallets),
        status: body.status ?? "Planifiée",
        scheduledAt: body.scheduledAt,
      },
    });

    return NextResponse.json(reception);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Enregistrement indisponible en production.",
      },
      {
        status: 503,
      }
    );
  }
}