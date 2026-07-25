import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../../lib/auth/session";
import { prisma } from "../../../../lib/prisma";

const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;

function parsePositiveInteger(
  value: string | null,
  defaultValue: number
) {
  const parsedValue = Number.parseInt(value ?? "", 10);

  if (!Number.isFinite(parsedValue) || parsedValue < 1) {
    return defaultValue;
  }

  return parsedValue;
}

function parseDetails(details: string | null) {
  if (!details) {
    return null;
  }

  try {
    return JSON.parse(details) as unknown;
  } catch {
    return details;
  }
}

export async function GET(request: Request) {
  try {
    const auth = await getCurrentSession();

    if (!auth) {
      return NextResponse.json(
        { error: "Authentification requise." },
        { status: 401 }
      );
    }

    if (auth.membership.role !== "ADMIN") {
      return NextResponse.json(
        {
          error:
            "Accès réservé aux administrateurs.",
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);

    const page = parsePositiveInteger(
      searchParams.get("page"),
      1
    );

    const requestedPageSize = parsePositiveInteger(
      searchParams.get("pageSize"),
      DEFAULT_PAGE_SIZE
    );

    const pageSize = Math.min(
      requestedPageSize,
      MAX_PAGE_SIZE
    );

    const action = searchParams.get("action")?.trim();
    const entityType =
      searchParams.get("entityType")?.trim();

    const where = {
      companyId: auth.company.id,
      ...(action ? { action } : {}),
      ...(entityType ? { entityType } : {}),
    };

    const [logs, total] = await prisma.$transaction([
      prisma.auditLog.findMany({
        where,
        include: {
          actor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),

      prisma.auditLog.count({
        where,
      }),
    ]);

    return NextResponse.json({
      logs: logs.map((log) => ({
        id: log.id,
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        details: parseDetails(log.details),
        ipAddress: log.ipAddress,
        createdAt: log.createdAt,
        actor: log.actor
          ? {
              id: log.actor.id,
              firstName: log.actor.firstName,
              lastName: log.actor.lastName,
              email: log.actor.email,
            }
          : null,
      })),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(
          1,
          Math.ceil(total / pageSize)
        ),
      },
    });
  } catch (error) {
    console.error("Audit logs error:", error);

    return NextResponse.json(
      {
        error:
          "Impossible de charger le journal d’audit.",
      },
      { status: 500 }
    );
  }
}