import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../../lib/auth/session";
import { encryptErpSecret } from "../../../../lib/erp/crypto";
import { prisma } from "../../../../lib/prisma";

type ErpConfigurationBody = {
  provider?: unknown;
  name?: unknown;
  apiUrl?: unknown;
  apiKey?: unknown;
  companyId?: unknown;
  enabled?: unknown;
};

export async function GET() {
  const currentSession = await getCurrentSession();

  if (!currentSession) {
    return NextResponse.json(
      { error: "Non authentifié." },
      { status: 401 }
    );
  }

  const connection = await prisma.erpConnection.findFirst({
    where: {
      companyId: currentSession.company.id,
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
      name: connection.name,
      apiUrl: connection.apiUrl ?? "",
      companyId: connection.externalCompanyId ?? "",
      enabled: connection.isEnabled,
      status: connection.status,
      hasApiKey: Boolean(connection.apiKeyEncrypted),
      lastTestedAt: connection.lastTestedAt,
      lastSyncedAt: connection.lastSyncedAt,
      lastError: connection.lastError,
      updatedAt: connection.updatedAt,
    },
  });
}

export async function PUT(request: Request) {
  const currentSession = await getCurrentSession();

  if (!currentSession) {
    return NextResponse.json(
      { error: "Non authentifié." },
      { status: 401 }
    );
  }

  if (
    currentSession.membership.role !== "ADMIN" &&
    currentSession.membership.role !== "OWNER"
  ) {
    return NextResponse.json(
      { error: "Droits administrateur requis." },
      { status: 403 }
    );
  }

  let body: ErpConfigurationBody;

  try {
    body = (await request.json()) as ErpConfigurationBody;
  } catch {
    return NextResponse.json(
      { error: "Corps de requête invalide." },
      { status: 400 }
    );
  }

  const provider =
    typeof body.provider === "string" ? body.provider.trim() : "";

  const name =
    typeof body.name === "string" ? body.name.trim() : "";

  const apiUrl =
    typeof body.apiUrl === "string" ? body.apiUrl.trim() : "";

  const apiKey =
    typeof body.apiKey === "string" ? body.apiKey.trim() : "";

  const externalCompanyId =
    typeof body.companyId === "string" ? body.companyId.trim() : "";

  const isEnabled =
    typeof body.enabled === "boolean" ? body.enabled : false;

  if (!provider) {
    return NextResponse.json(
      { error: "Le fournisseur ERP est obligatoire." },
      { status: 400 }
    );
  }

  if (!name) {
    return NextResponse.json(
      { error: "Le nom de la connexion est obligatoire." },
      { status: 400 }
    );
  }

  const existingConnection = await prisma.erpConnection.findFirst({
    where: {
      companyId: currentSession.company.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const apiKeyEncrypted = apiKey
    ? encryptErpSecret(apiKey)
    : existingConnection?.apiKeyEncrypted ?? null;

  const data = {
    provider,
    name,
    apiUrl: apiUrl || null,
    apiKeyEncrypted,
    externalCompanyId: externalCompanyId || null,
    isEnabled,
    status: isEnabled ? "CONFIGURED" : "DISCONNECTED",
    lastError: null,
  };

  const connection = existingConnection
    ? await prisma.erpConnection.update({
        where: {
          id: existingConnection.id,
        },
        data,
      })
    : await prisma.erpConnection.create({
        data: {
          ...data,
          companyId: currentSession.company.id,
        },
      });

  await prisma.auditLog.create({
    data: {
      companyId: currentSession.company.id,
      actorId: currentSession.user.id,
      action: existingConnection
        ? "ERP_CONNECTION_UPDATED"
        : "ERP_CONNECTION_CREATED",
      entityType: "ErpConnection",
      entityId: connection.id,
      details: JSON.stringify({
        provider: connection.provider,
        name: connection.name,
        isEnabled: connection.isEnabled,
      }),
    },
  });

  return NextResponse.json({
    success: true,
    connection: {
      id: connection.id,
      provider: connection.provider,
      name: connection.name,
      apiUrl: connection.apiUrl ?? "",
      companyId: connection.externalCompanyId ?? "",
      enabled: connection.isEnabled,
      status: connection.status,
      hasApiKey: Boolean(connection.apiKeyEncrypted),
      updatedAt: connection.updatedAt,
    },
  });
}