import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const reception = await prisma.reception.update({
      where: { id: Number(id) },
      data: { status: body.status },
    });

    return NextResponse.json(reception);
  } catch {
    return NextResponse.json(
      { message: "Mise à jour indisponible en production pour le moment." },
      { status: 503 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.reception.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Réception supprimée" });
  } catch {
    return NextResponse.json(
      { message: "Suppression indisponible en production pour le moment." },
      { status: 503 }
    );
  }
}