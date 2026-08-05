import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../../../lib/auth/session";
import { prisma } from "../../../../../lib/prisma";

const allowedStatuses = [
  "NEW",
  "NEEDS_REVIEW",
  "IGNORED",
] as const;

type AllowedStatus = (typeof allowedStatuses)[number];

type UpdateMessageBody = {
  status?: unknown;
};

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      messageId: string;
    }>;
  },
) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json(
      { error: "Non authentifié." },
      { status: 401 },
    );
  }

  if (
    session.membership.role !== "ADMIN" &&
    session.membership.role !== "OWNER" &&
    session.membership.role !== "LOGISTICS_MANAGER"
  ) {
    return NextResponse.json(
      { error: "Droits insuffisants." },
      { status: 403 },
    );
  }

  const { messageId } = await context.params;

  let body: UpdateMessageBody;

  try {
    body = (await request.json()) as UpdateMessageBody;
  } catch {
    return NextResponse.json(
      { error: "Corps de requête invalide." },
      { status: 400 },
    );
  }

  const status =
    typeof body.status === "string"
      ? body.status.trim().toUpperCase()
      : "";

  if (!allowedStatuses.includes(status as AllowedStatus)) {
    return NextResponse.json(
      { error: "Statut de traitement invalide." },
      { status: 400 },
    );
  }

  const existingMessage = await prisma.mailMessage.findFirst({
    where: {
      id: messageId,
      companyId: session.company.id,
    },
  });

  if (!existingMessage) {
    return NextResponse.json(
      { error: "E-mail introuvable." },
      { status: 404 },
    );
  }

  const message = await prisma.mailMessage.update({
    where: {
      id: existingMessage.id,
    },
    data: {
      status,
      processingError: null,
    },
  });

  await prisma.auditLog.create({
    data: {
      companyId: session.company.id,
      actorId: session.user.id,
      action: "MAIL_MESSAGE_STATUS_UPDATED",
      entityType: "MailMessage",
      entityId: message.id,
      details: JSON.stringify({
        previousStatus: existingMessage.status,
        status: message.status,
        subject: message.subject,
      }),
    },
  });

  return NextResponse.json({
    success: true,
    message: {
      id: message.id,
      status: message.status,
    },
  });
}
