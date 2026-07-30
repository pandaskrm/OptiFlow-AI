import { NextRequest, NextResponse } from "next/server";

import { synchronizeErpConnection } from "../../../../lib/erp/erpSyncService";
import { prisma } from "../../../../lib/prisma";

export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return false;
  }

  return (
    request.headers.get("authorization") ===
    `Bearer ${cronSecret}`
  );
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Accès automatique non autorisé." },
      { status: 401 }
    );
  }

  const connections = await prisma.erpConnection.findMany({
    where: {
      isEnabled: true,
    },
    orderBy: {
      updatedAt: "asc",
    },
  });

  if (connections.length === 0) {
    return NextResponse.json({
      success: true,
      message: "Aucune connexion ERP active à synchroniser.",
      processed: 0,
      succeeded: 0,
      failed: 0,
      results: [],
    });
  }

  const results = [];

  for (const connection of connections) {
    try {
      const result = await synchronizeErpConnection({
        connectionId: connection.id,
        companyId: connection.companyId,
        actorId: null,
        triggeredBy: "CRON",
      });

      results.push({
        connectionId: connection.id,
        companyId: connection.companyId,
        provider: connection.provider,
        name: connection.name,
        success: true,
        message: result.message,
        summary: result.summary,
        syncedAt: result.syncedAt.toISOString(),
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erreur inconnue pendant la synchronisation automatique.";

      results.push({
        connectionId: connection.id,
        companyId: connection.companyId,
        provider: connection.provider,
        name: connection.name,
        success: false,
        message: errorMessage,
      });
    }
  }

  const succeeded = results.filter(
    (result) => result.success
  ).length;

  const failed = results.length - succeeded;

  return NextResponse.json({
    success: failed === 0,
    message: `${succeeded} synchronisation(s) réussie(s), ${failed} échec(s).`,
    processed: results.length,
    succeeded,
    failed,
    results,
  });
}