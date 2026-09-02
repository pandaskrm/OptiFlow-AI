import { PrismaClient } from "../../app/generated/prisma/client";
import {
  businessDateFromKey,
  dateKeyInTimeZone,
  normalizeTimeZone,
  zonedDateTimeToUtc,
} from "./timezone";

type CalculatePresenceDayInput = {
  prisma: PrismaClient;
  workforceId: number;
  companyId: string;
  workDateKey: string;
};

type Interval = {
  start: Date;
  end: Date;
};

export function overlapMinutes(
  punchStart: Date,
  punchEnd: Date,
  plannedStart: Date,
  plannedEnd: Date,
) {
  const start =
    punchStart > plannedStart
      ? punchStart
      : plannedStart;

  const end =
    punchEnd < plannedEnd
      ? punchEnd
      : plannedEnd;

  if (end <= start) {
    return 0;
  }

  return Math.round(
    (end.getTime() - start.getTime()) /
      60000,
  );
}

function parseScheduleIntervals(
  workDateKey: string,
  timeZone: string,
  schedule: {
    morningStart: string | null;
    morningEnd: string | null;
    afternoonStart: string | null;
    afternoonEnd: string | null;
  },
): Interval[] {
  const intervals: Interval[] = [];

  if (
    schedule.morningStart &&
    schedule.morningEnd
  ) {
    intervals.push({
      start: zonedDateTimeToUtc(
        workDateKey,
        schedule.morningStart,
        timeZone,
      ),
      end: zonedDateTimeToUtc(
        workDateKey,
        schedule.morningEnd,
        timeZone,
      ),
    });
  }

  if (
    schedule.afternoonStart &&
    schedule.afternoonEnd
  ) {
    intervals.push({
      start: zonedDateTimeToUtc(
        workDateKey,
        schedule.afternoonStart,
        timeZone,
      ),
      end: zonedDateTimeToUtc(
        workDateKey,
        schedule.afternoonEnd,
        timeZone,
      ),
    });
  }

  return intervals;
}

export async function calculatePresenceDay({
  prisma,
  workforceId,
  companyId,
  workDateKey,
}: CalculatePresenceDayInput) {
  const workforce =
    await prisma.workforce.findFirst({
      where: {
        id: workforceId,
        companyId,
        isActive: true,
      },
      select: {
        id: true,
      },
    });

  if (!workforce) {
    throw new Error(
      "WORKFORCE_NOT_FOUND",
    );
  }

  const warehouse =
    await prisma.warehouse.findFirst({
      where: {
        companyId,
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

  const workDate =
    businessDateFromKey(
      workDateKey,
    );

  const dayOfWeek =
    new Date(
      `${workDateKey}T12:00:00.000Z`,
    ).getUTCDay();

  const schedule =
    await prisma.presenceSchedule.findFirst({
      where: {
        workforceId,
        dayOfWeek,
        isWorkingDay: true,

        AND: [
          {
            OR: [
              {
                validFrom: null,
              },
              {
                validFrom: {
                  lte: workDate,
                },
              },
            ],
          },
          {
            OR: [
              {
                validUntil: null,
              },
              {
                validUntil: {
                  gte: workDate,
                },
              },
            ],
          },
        ],
      },
      orderBy: [
        {
          validFrom: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      select: {
        morningStart: true,
        morningEnd: true,
        afternoonStart: true,
        afternoonEnd: true,
      },
    });

  if (!schedule) {
    return prisma.presenceDay.upsert({
      where: {
        workforceId_workDate: {
          workforceId,
          workDate,
        },
      },
      update: {
        plannedMinutes: 0,
        calculatedMinutes: 0,
        anomaly: true,
        anomalyReason:
          "Aucun planning trouvé pour cette journée.",
      },
      create: {
        workforceId,
        workDate,
        plannedMinutes: 0,
        calculatedMinutes: 0,
        anomaly: true,
        anomalyReason:
          "Aucun planning trouvé pour cette journée.",
      },
    });
  }

  const intervals =
    parseScheduleIntervals(
      workDateKey,
      timeZone,
      schedule,
    );

  const plannedMinutes =
    intervals.reduce(
      (total, interval) =>
        total +
        Math.round(
          (interval.end.getTime() -
            interval.start.getTime()) /
            60000,
        ),
      0,
    );

  const dayStart =
    zonedDateTimeToUtc(
      workDateKey,
      "00:00:00",
      timeZone,
    );

  const dayEnd =
    zonedDateTimeToUtc(
      workDateKey,
      "23:59:59",
      timeZone,
    );

  const punches =
    await prisma.presencePunch.findMany({
      where: {
        workforceId,
        punchedAt: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
      orderBy: {
        punchedAt: "asc",
      },
      select: {
        id: true,
        type: true,
        punchedAt: true,
      },
    });

  const arrival =
    punches.find(
      (punch) =>
        punch.type === "IN",
    );

  const departure =
    [...punches]
      .reverse()
      .find(
        (punch) =>
          punch.type === "OUT",
      );

  let calculatedMinutes = 0;
  let anomaly = false;
  let anomalyReason: string | null =
    null;

  if (!arrival && !departure) {
    anomaly = true;
    anomalyReason =
      "Aucun pointage enregistré.";
  }
  else if (!arrival) {
    anomaly = true;
    anomalyReason =
      "Pointage de départ présent sans arrivée.";
  }
  else if (!departure) {
    anomaly = true;
    anomalyReason =
      "Pointage d'arrivée présent sans départ.";
  }
  else if (
    departure.punchedAt <=
    arrival.punchedAt
  ) {
    anomaly = true;
    anomalyReason =
      "Le départ est antérieur ou égal à l'arrivée.";
  }
  else {
    calculatedMinutes =
      intervals.reduce(
        (total, interval) =>
          total +
          overlapMinutes(
            arrival.punchedAt,
            departure.punchedAt,
            interval.start,
            interval.end,
          ),
        0,
      );

    if (
      calculatedMinutes <
      plannedMinutes
    ) {
      anomaly = true;
      anomalyReason =
        "Temps travaillé inférieur au temps planifié.";
    }
  }

  return prisma.presenceDay.upsert({
    where: {
      workforceId_workDate: {
        workforceId,
        workDate,
      },
    },
    update: {
      plannedMinutes,
      calculatedMinutes,
      anomaly,
      anomalyReason,
      status: anomaly
        ? "DRAFT"
        : "CALCULATED",
    },
    create: {
      workforceId,
      workDate,
      plannedMinutes,
      calculatedMinutes,
      anomaly,
      anomalyReason,
      status: anomaly
        ? "DRAFT"
        : "CALCULATED",
    },
  });
}


