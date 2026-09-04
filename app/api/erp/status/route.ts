import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../../lib/auth/session";
import { getErpConnector } from "../../../../lib/erp/erpConnectorFactory";
import { prisma } from "../../../../lib/prisma";

const ERP_STATUS_ROLES = new Set([
  "ADMIN",
  "OWNER",
  "LOGISTICS_MANAGER",
]);

export async function GET() {
  const currentSession = await getCurrentSession();

  if (!currentSession) {
    return NextResponse.json(
      { error: "Non authentifié." },
      { status: 401 },
    );
  }

  if (!ERP_STATUS_ROLES.has(currentSession.membership.role)) {
    return NextResponse.json(
      { error: "Accès réservé aux responsables." },
      { status: 403 },
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

  const connector = getErpConnector(connection);
  const dataSource = await connector.getDataSource();

  return NextResponse.json({
    ...dataSource,
    configurationStatus:
      connection?.status ?? "DISCONNECTED",
    enabled: connection?.isEnabled ?? false,
  });
}