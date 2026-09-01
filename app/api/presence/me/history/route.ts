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

type HistoryPeriod =
  | "day"
  | "week"
  | "month"
  | "year";

function parseReferenceDate(
  value: string | null,
) {
  if (!value) {
    return null;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const date = new Date(
    `${value}T00:00:00.000Z`,
  );

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  if (
    date.toISOString().slice(0, 10) !== value
  ) {
    return null;
  }

  return date;
}

function buildRange(
  period: HistoryPeriod,
  reference: Date,
) {
  const year = reference.getUTCFullYear();
  const month = reference.getUTCMonth();
  const day = reference.getUTCDate();

  if (period === "day") {
    const start = new Date(
      Date.UTC(year, month, day),
    );

    const end = new Date(
      Date.UTC(year, month, day + 1),
    );

    return { start, end };
  }

  if (period === "week") {
    const weekday = reference.getUTCDay();

    const mondayOffset =
      weekday === 0
        ? -6
        : 1 - weekday;

    const start = new Date(
      Date.UTC(
        year,
        month,
        day + mondayOffset,
      ),
    );

    const end = new Date(start);
    end.setUTCDate(
      end.getUTCDate() + 7,
    );

    return { start, end };
  }

  if (period === "month") {
    return {
      start: new Date(
        Date.UTC(year, month, 1),
      ),
      end: new Date(
        Date.UTC(year, month + 1, 1),
      ),
    };
  }

  return {
    start: new Date(
      Date.UTC(year, 0, 1),
    ),
    end: new Date(
      Date.UTC(year + 1, 0, 1),
    ),
  };
}

function sum(
  values: number[],
) {
  return values.reduce(
    (total, value) => total + value,
    0,
  );
}

export async function GET(
  request: NextRequest,
) {
  const session =
    await getCurrentSession();

  if (!session) {
    return NextResponse.json(
      {
        error: "UNAUTHORIZED",
      },
      {
        status: 401,
      },
    );
  }

  const periodParam =
    request.nextUrl.searchParams.get(
      "period",
    ) ?? "month";

  const allowedPeriods: HistoryPeriod[] = [
    "day",
    "week",
    "month",
    "year",
  ];

  if (
    !allowedPeriods.includes(
      periodParam as HistoryPeriod,
    )
  ) {
    return NextResponse.json(
      {
        error: "INVALID_PERIOD",
      },
      {
        status: 400,
      },
    );
  }

  const warehouse =
    await prisma.warehouse.findFirst({
      where: {
        companyId:
          session.company.id,
        isActive: true,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        timezone: true,
      },
    });

  const timeZone =
    normalizeTimeZone(
      warehouse?.timezone,
    );

  const requestedDate =
    request.nextUrl.searchParams.get(
      "date",
    );

  const effectiveDate =
    requestedDate ??
    dateKeyInTimeZone(
      new Date(),
      timeZone,
    );

  const reference =
    parseReferenceDate(
      effectiveDate,
    );

  if (!reference) {
    return NextResponse.json(
      {
        error: "INVALID_DATE",
      },
      {
        status: 400,
      },
    );
  }

  const workforce =
    await prisma.workforce.findFirst({
      where: {
        membershipId:
          session.membership.id,
        companyId:
          session.company.id,
        isActive: true,
      },
      select: {
        id: true,
        employeeNumber: true,
        name: true,
        service: true,
        jobTitle: true,
        contractType: true,
        agency: true,
      },
    });

  if (!workforce) {
    return NextResponse.json(
      {
        error: "WORKFORCE_NOT_LINKED",
      },
      {
        status: 404,
      },
    );
  }

  const period =
    periodParam as HistoryPeriod;

  const range =
    buildRange(
      period,
      reference,
    );

  const [
    presenceDays,
    performanceDays,
  ] = await Promise.all([
    prisma.presenceDay.findMany({
      where: {
        workforceId: workforce.id,
        workDate: {
          gte: range.start,
          lt: range.end,
        },
      },
      orderBy: {
        workDate: "asc",
      },
      select: {
        workDate: true,
        dayCode: true,
        plannedMinutes: true,
        calculatedMinutes: true,
        approvedMinutes: true,
        status: true,
        anomaly: true,
        anomalyReason: true,
        note: true,
        managerValidatedAt: true,
        hrValidatedAt: true,
      },
    }),

    prisma.workforcePerformanceDay.findMany({
      where: {
        workforceId: workforce.id,
        workDate: {
          gte: range.start,
          lt: range.end,
        },
      },
      orderBy: {
        workDate: "asc",
      },
      select: {
        workDate: true,
        preparedOrders: true,
        preparedLines: true,
        preparedParcels: true,
        preparedQuantity: true,
        workedMinutes: true,
        source: true,
      },
    }),
  ]);

  const performanceByDate =
    new Map(
      performanceDays.map((item) => [
        item.workDate
          .toISOString()
          .slice(0, 10),
        item,
      ]),
    );

  const presenceByDate =
    new Map(
      presenceDays.map((item) => [
        item.workDate
          .toISOString()
          .slice(0, 10),
        item,
      ]),
    );

  const allDates =
    Array.from(
      new Set([
        ...presenceByDate.keys(),
        ...performanceByDate.keys(),
      ]),
    ).sort();

  const days =
    allDates.map((date) => {
      const presence =
        presenceByDate.get(date);

      const performance =
        performanceByDate.get(date);

      return {
        date,

        hours: presence
          ? {
              dayCode:
                presence.dayCode,
              plannedMinutes:
                presence.plannedMinutes,
              calculatedMinutes:
                presence.calculatedMinutes,
              approvedMinutes:
                presence.approvedMinutes,
              retainedMinutes:
                presence.approvedMinutes ??
                presence.calculatedMinutes,
              status:
                presence.status,
              anomaly:
                presence.anomaly,
              anomalyReason:
                presence.anomalyReason,
              note:
                presence.note,
              managerValidated:
                Boolean(
                  presence.managerValidatedAt,
                ),
              hrValidated:
                Boolean(
                  presence.hrValidatedAt,
                ),
            }
          : null,

        stats: performance
          ? {
              preparedOrders:
                performance.preparedOrders,
              preparedLines:
                performance.preparedLines,
              preparedParcels:
                performance.preparedParcels,
              preparedQuantity:
                performance.preparedQuantity,
              workedMinutes:
                performance.workedMinutes,
              source:
                performance.source,
            }
          : null,
      };
    });

  const plannedMinutes =
    sum(
      presenceDays.map(
        (item) => item.plannedMinutes,
      ),
    );

  const calculatedMinutes =
    sum(
      presenceDays.map(
        (item) => item.calculatedMinutes,
      ),
    );

  const retainedMinutes =
    sum(
      presenceDays.map(
        (item) =>
          item.approvedMinutes ??
          item.calculatedMinutes,
      ),
    );

  const preparedOrders =
    sum(
      performanceDays.map(
        (item) => item.preparedOrders,
      ),
    );

  const preparedLines =
    sum(
      performanceDays.map(
        (item) => item.preparedLines,
      ),
    );

  const preparedParcels =
    sum(
      performanceDays.map(
        (item) => item.preparedParcels,
      ),
    );

  const preparedQuantity =
    sum(
      performanceDays.map(
        (item) => item.preparedQuantity,
      ),
    );

  const performanceWorkedMinutes =
    sum(
      performanceDays.map(
        (item) => item.workedMinutes,
      ),
    );

  const linesPerHour =
    performanceWorkedMinutes > 0
      ? Math.round(
          (
            preparedLines /
            (
              performanceWorkedMinutes /
              60
            )
          ) * 10,
        ) / 10
      : null;

  return NextResponse.json({
    employee: workforce,

    period: {
      type: period,
      reference:
        reference
          .toISOString()
          .slice(0, 10),
      start:
        range.start
          .toISOString()
          .slice(0, 10),
      endExclusive:
        range.end
          .toISOString()
          .slice(0, 10),
    },

    hours: {
      plannedMinutes,
      calculatedMinutes,
      retainedMinutes,
      anomalyDays:
        presenceDays.filter(
          (item) => item.anomaly,
        ).length,
      managerValidatedDays:
        presenceDays.filter(
          (item) =>
            item.managerValidatedAt,
        ).length,
      hrValidatedDays:
        presenceDays.filter(
          (item) =>
            item.hrValidatedAt,
        ).length,
    },

    stats: {
      preparedOrders,
      preparedLines,
      preparedParcels,
      preparedQuantity,
      workedMinutes:
        performanceWorkedMinutes,
      linesPerHour,
    },

    days,
  });
}
