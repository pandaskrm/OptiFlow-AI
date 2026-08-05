import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../../lib/auth/session";
import { prisma } from "../../../../lib/prisma";

type CreateMessageBody = {
  subject?: unknown;
  senderEmail?: unknown;
  senderName?: unknown;
  receivedAt?: unknown;
  bodyText?: unknown;
  externalId?: unknown;
};

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET() {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json(
      { error: "Non authentifié." },
      { status: 401 },
    );
  }

  const messages = await prisma.mailMessage.findMany({
    where: {
      companyId: session.company.id,
    },
    orderBy: {
      receivedAt: "desc",
    },
    take: 100,
  });

  return NextResponse.json({
    messages,
  });
}

export async function POST(request: Request) {
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

  let body: CreateMessageBody;

  try {
    body = (await request.json()) as CreateMessageBody;
  } catch {
    return NextResponse.json(
      { error: "Corps de requête invalide." },
      { status: 400 },
    );
  }

  const subject = readString(body.subject);
  const senderEmail = readString(body.senderEmail);
  const senderName = readString(body.senderName);
  const bodyText = readString(body.bodyText);

  const externalId =
    readString(body.externalId) ||
    `manual-${crypto.randomUUID()}`;

  const receivedAtValue = readString(body.receivedAt);
  const receivedAt = receivedAtValue
    ? new Date(receivedAtValue)
    : new Date();

  if (!subject) {
    return NextResponse.json(
      { error: "L'objet du mail est obligatoire." },
      { status: 400 },
    );
  }

  if (!senderEmail || !senderEmail.includes("@")) {
    return NextResponse.json(
      { error: "Adresse expéditeur invalide." },
      { status: 400 },
    );
  }

  if (Number.isNaN(receivedAt.getTime())) {
    return NextResponse.json(
      { error: "Date de réception invalide." },
      { status: 400 },
    );
  }

  const message = await prisma.mailMessage.upsert({
    where: {
      companyId_externalId: {
        companyId: session.company.id,
        externalId,
      },
    },
    update: {
      subject,
      senderEmail,
      senderName: senderName || null,
      receivedAt,
      bodyText: bodyText || null,
    },
    create: {
      companyId: session.company.id,
      externalId,
      subject,
      senderEmail,
      senderName: senderName || null,
      receivedAt,
      bodyText: bodyText || null,
      status: "NEW",
    },
  });

  await prisma.auditLog.create({
    data: {
      companyId: session.company.id,
      actorId: session.user.id,
      action: "MAIL_MESSAGE_IMPORTED",
      entityType: "MailMessage",
      entityId: message.id,
      details: JSON.stringify({
        subject: message.subject,
        senderEmail: message.senderEmail,
      }),
    },
  });

  return NextResponse.json(
    {
      success: true,
      message,
    },
    { status: 201 },
  );
}
