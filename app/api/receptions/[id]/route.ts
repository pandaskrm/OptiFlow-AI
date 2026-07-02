import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.reception.delete({
    where: {
      id: Number(id),
    },
  });

  return NextResponse.json({
    message: "Réception supprimée",
  });
}