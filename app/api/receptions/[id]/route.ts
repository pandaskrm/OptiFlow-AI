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
      where: {
        id: Number(id),
      },
      data: {
        status: body.status,
      },
    });

    return NextResponse.json(reception);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Erreur lors de la mise à jour." },
      { status: 500 }
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
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      message: "Réception supprimée",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Erreur lors de la suppression." },
      { status: 500 }
    );
  }
}