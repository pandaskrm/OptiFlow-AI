import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../../lib/auth/session";
import { encryptMailSecret } from "../../../../lib/mail/crypto";
import { prisma } from "../../../../lib/prisma";

type MailConfigurationBody = {
  provider?: unknown;
  emailAddress?: unknown;
  host?: unknown;
  port?: unknown;
  username?: unknown;
  password?: unknown;
  tenantId?: unknown;
  clientId?: unknown;
  clientSecret?: unknown;
  enabled?: unknown;
};

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

async function requireAdministrator() {
  const session = await getCurrentSession();

  if (!session) {
    return {
      error: NextResponse.json(
        { error: "Non authentifié." },
        { status: 401 },
      ),
    };
  }

  if (
    session.membership.role !== "ADMIN" &&
    session.membership.role !== "OWNER"
  ) {
    return {
      error: NextResponse.json(
        { error: "Droits administrateur requis." },
        { status: 403 },
      ),
    };
  }

  return { session };
}

export async function GET() {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json(
      { error: "Non authentifié." },
      { status: 401 },
    );
  }

  const connection = await prisma.mailConnection.findFirst({
    where: {
      companyId: session.company.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  if (!connection) {
    return NextResponse.json({
      connection: null,
    });
  }

  return NextResponse.json({
    connection: {
      id: connection.id,
      provider: connection.provider,
      emailAddress: connection.emailAddress,
      host: connection.host ?? "",
      port: connection.port ?? 993,
      username: connection.username ?? "",
      tenantId: connection.tenantId ?? "",
      clientId: connection.clientId ?? "",
      enabled: connection.isEnabled,
      status: connection.status,
      hasPassword: Boolean(connection.passwordEncrypted),
      hasClientSecret: Boolean(
        connection.clientSecretEncrypted,
      ),
      lastTestedAt: connection.lastTestedAt,
      lastSyncedAt: connection.lastSyncedAt,
      lastError: connection.lastError,
    },
  });
}

export async function PUT(request: Request) {
  const authorization = await requireAdministrator();

  if ("error" in authorization) {
    return authorization.error;
  }

  let body: MailConfigurationBody;

  try {
    body = (await request.json()) as MailConfigurationBody;
  } catch {
    return NextResponse.json(
      { error: "Corps de requête invalide." },
      { status: 400 },
    );
  }

  const provider = readString(body.provider);
  const emailAddress = readString(body.emailAddress);
  const host = readString(body.host);
  const username = readString(body.username);
  const password = readString(body.password);
  const tenantId = readString(body.tenantId);
  const clientId = readString(body.clientId);
  const clientSecret = readString(body.clientSecret);

  const port =
    typeof body.port === "number" &&
    Number.isInteger(body.port) &&
    body.port > 0 &&
    body.port <= 65535
      ? body.port
      : 993;

  const isEnabled =
    typeof body.enabled === "boolean"
      ? body.enabled
      : false;

  if (
    !["MICROSOFT_365", "GMAIL", "IMAP"].includes(provider)
  ) {
    return NextResponse.json(
      { error: "Fournisseur de messagerie invalide." },
      { status: 400 },
    );
  }

  if (!emailAddress || !emailAddress.includes("@")) {
    return NextResponse.json(
      { error: "Adresse e-mail invalide." },
      { status: 400 },
    );
  }

  if (provider === "IMAP" && !host) {
    return NextResponse.json(
      { error: "Le serveur IMAP est obligatoire." },
      { status: 400 },
    );
  }

  const existingConnection =
    await prisma.mailConnection.findFirst({
      where: {
        companyId: authorization.session.company.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

  const data = {
    provider,
    emailAddress,
    host: host || null,
    port,
    username: username || null,
    passwordEncrypted: password
      ? encryptMailSecret(password)
      : existingConnection?.passwordEncrypted ?? null,
    tenantId: tenantId || null,
    clientId: clientId || null,
    clientSecretEncrypted: clientSecret
      ? encryptMailSecret(clientSecret)
      : existingConnection?.clientSecretEncrypted ?? null,
    isEnabled,
    status: isEnabled ? "CONFIGURED" : "DISCONNECTED",
    lastError: null,
  };

  const connection = existingConnection
    ? await prisma.mailConnection.update({
        where: {
          id: existingConnection.id,
        },
        data,
      })
    : await prisma.mailConnection.create({
        data: {
          ...data,
          companyId: authorization.session.company.id,
        },
      });

  await prisma.auditLog.create({
    data: {
      companyId: authorization.session.company.id,
      actorId: authorization.session.user.id,
      action: existingConnection
        ? "MAIL_CONNECTION_UPDATED"
        : "MAIL_CONNECTION_CREATED",
      entityType: "MailConnection",
      entityId: connection.id,
      details: JSON.stringify({
        provider: connection.provider,
        emailAddress: connection.emailAddress,
        isEnabled: connection.isEnabled,
      }),
    },
  });

  return NextResponse.json({
    success: true,
    connection: {
      id: connection.id,
      provider: connection.provider,
      emailAddress: connection.emailAddress,
      enabled: connection.isEnabled,
      status: connection.status,
      hasPassword: Boolean(connection.passwordEncrypted),
      hasClientSecret: Boolean(
        connection.clientSecretEncrypted,
      ),
    },
  });
}

export async function POST(request: Request) {
  const authorization = await requireAdministrator();

  if ("error" in authorization) {
    return authorization.error;
  }

  let body: MailConfigurationBody;

  try {
    body = (await request.json()) as MailConfigurationBody;
  } catch {
    return NextResponse.json(
      { error: "Corps de requête invalide." },
      { status: 400 },
    );
  }

  const provider = readString(body.provider);
  const emailAddress = readString(body.emailAddress);
  const host = readString(body.host);

  if (!emailAddress || !emailAddress.includes("@")) {
    return NextResponse.json(
      { error: "Adresse e-mail invalide." },
      { status: 400 },
    );
  }

  if (provider === "IMAP" && !host) {
    return NextResponse.json(
      { error: "Le serveur IMAP est obligatoire." },
      { status: 400 },
    );
  }

  return NextResponse.json({
    success: true,
    status: "CONFIGURATION_VALID",
    message:
      "La configuration est cohérente. Le test réseau réel sera activé avec le connecteur du fournisseur.",
  });
}
