import {
  NextRequest,
  NextResponse,
} from "next/server";

import { getCurrentSession } from "../../../../../lib/auth/session";
import { prisma } from "../../../../../lib/prisma";
import {
  dateKeyInTimeZone,
  normalizeTimeZone,
} from "../../../../../lib/presence/timezone";

const MANAGER_ROLES = new Set([
  "ADMIN",
  "LOGISTICS_MANAGER",
  "TEAM_LEADER",
]);

type ManagerPeriod =
  | "day"
  | "week"
  | "month";

function parseReferenceDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    return null;
  }

  return date;
}

function buildRange(
  period: ManagerPeriod,
  reference: Date,
) {
  const year = reference.getUTCFullYear();
  const month = reference.getUTCMonth();
  const day = reference.getUTCDate();

  if (period === "day") {
    return {
      start: new Date(Date.UTC(year, month, day)),
      end: new Date(Date.UTC(year, month, day + 1)),
    };
  }

  if (period === "week") {
    const weekday = reference.getUTCDay();
    const mondayOffset =
      weekday === 0 ? -6 : 1 - weekday;

    const start = new Date(
      Date.UTC(year, month, day + mondayOffset),
    );

    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 7);

    return { start, end };
  }

  return {
    start: new Date(Date.UTC(year, month, 1)),
    end: new Date(Date.UTC(year, month + 1, 1)),
  };
}

export async function GET(request: NextRequest) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json(
      { error: "Non authentifie." },
      { status: 401 },
    );
  }

  if (!MANAGER_ROLES.has(session.membership.role)) {
    return NextResponse.json(
      { error: "Acces reserve aux responsables." },
      { status: 403 },
    );
  }

  const warehouse = await prisma.warehouse.findFirst({
    where: {
      companyId: session.company.id,
      isActive: true,
    },
    select: {
      timezone: true,
    },
  });

  const timeZone = normalizeTimeZone(warehouse?.timezone);

  const periodParam =
    request.nextUrl.searchParams.get("period") ?? "week";

  const period: ManagerPeriod =
    periodParam === "day" || periodParam === "month"
      ? periodParam
      : "week";

  const dateParam = request.nextUrl.searchParams.get("date");

  const dateKey =
    dateParam ??
    dateKeyInTimeZone(new Date(), timeZone);

  const reference = parseReferenceDate(dateKey);

  if (!reference) {
    return NextResponse.json(
      { error: "Date invalide." },
      { status: 400 },
    );
  }

  const range = buildRange(period, reference);

  const days = await prisma.presenceDay.findMany({
    where: {
      workforce: {
        companyId: session.company.id,
      },
      workDate: {
        gte: range.start,
        lt: range.end,
      },
    },
    orderBy: {
      workDate: "desc",
    },
    take: 100,
    select: {
      id: true,
      workDate: true,
      dayCode: true,
      plannedMinutes: true,
      calculatedMinutes: true,
      approvedMinutes: true,
      status: true,
      anomaly: true,
      anomalyReason: true,
      managerValidatedAt: true,
      hrValidatedAt: true,
      workforce: {
        select: {
          id: true,
          employeeNumber: true,
          name: true,
          service: true,
          team: true,
        },
      },
    },
  });

  return NextResponse.json({
    success: true,
    days,
  });
}






