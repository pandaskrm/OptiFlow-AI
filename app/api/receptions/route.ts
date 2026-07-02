import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const receptions = await prisma.reception.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(receptions);
}

export async function POST(request: Request) {
  const body = await request.json();

  const reception = await prisma.reception.create({
    data: {
      number: body.number,
      supplier: body.supplier,
      carrier: body.carrier,
      dock: body.dock,
      pallets: Number(body.pallets),
      status: body.status,
      scheduledAt: body.scheduledAt,
    },
  });

  return NextResponse.json(reception);
}