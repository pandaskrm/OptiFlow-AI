import { prisma } from "../prisma";
import {
  businessDateFromKey,
  dateKeyInTimeZone,
  normalizeTimeZone,
} from "./timezone";

const MIN_SAMPLES = 3;
const MIN_CONFIDENCE = 0.65;
const MAX_SAMPLE_WEEKS = 52;

type ScheduleShape = {
  isWorkingDay: boolean;
  morningStart: string | null;
  morningEnd: string | null;
  afternoonStart: string | null;
  afternoonEnd: string | null;
};

type ScheduleSource = ScheduleShape & {
  id: string;
  dayOfWeek: number;
  validFrom: Date | null;
  validUntil: Date | null;
};

function normalizedTime(
  value: string | null,
) {
  const trimmed = value?.trim();

  return trimmed || null;
}

function normalizeShape(
  schedule: ScheduleShape,
): ScheduleShape {
  return {
    isWorkingDay:
      schedule.isWorkingDay,
    morningStart:
      normalizedTime(
        schedule.morningStart,
      ),
    morningEnd:
      normalizedTime(
        schedule.morningEnd,
      ),
    afternoonStart:
      normalizedTime(
        schedule.afternoonStart,
      ),
    afternoonEnd:
      normalizedTime(
        schedule.afternoonEnd,
      ),
  };
}

function fingerprint(
  schedule: ScheduleShape,
) {
  const shape =
    normalizeShape(schedule);

  return [
    shape.isWorkingDay
      ? "WORK"
      : "OFF",
    shape.morningStart ?? "-",
    shape.morningEnd ?? "-",
    shape.afternoonStart ?? "-",
    shape.afternoonEnd ?? "-",
  ].join("|");
}

function snapshot(
  schedule: ScheduleShape,
) {
  return JSON.stringify(
    normalizeShape(schedule),
  );
}

function describeSchedule(
  schedule: ScheduleShape,
) {
  const shape =
    normalizeShape(schedule);

  if (!shape.isWorkingDay) {
    return "Repos";
  }

  const parts: string[] = [];

  if (
    shape.morningStart &&
    shape.morningEnd
  ) {
    parts.push(
      `${shape.morningStart}-${shape.morningEnd}`,
    );
  }

  if (
    shape.afternoonStart &&
    shape.afternoonEnd
  ) {
    parts.push(
      `${shape.afternoonStart}-${shape.afternoonEnd}`,
    );
  }

  return parts.length
    ? parts.join(" / ")
    : "Jour travaille";
}

function estimateSamples(
  schedule: ScheduleSource,
  now: Date,
) {
  const start =
    schedule.validFrom ?? now;

  const rawEnd =
    schedule.validUntil &&
    schedule.validUntil < now
      ? schedule.validUntil
      : now;

  if (rawEnd <= start) {
    return 1;
  }

  const durationMs =
    rawEnd.getTime() -
    start.getTime();

  const weeks =
    Math.floor(
      durationMs /
        (7 * 24 * 60 * 60 * 1000),
    ) + 1;

  return Math.max(
    1,
    Math.min(
      MAX_SAMPLE_WEEKS,
      weeks,
    ),
  );
}

function activeAt(
  schedule: ScheduleSource,
  now: Date,
) {
  if (
    schedule.validFrom &&
    schedule.validFrom > now
  ) {
    return false;
  }

  if (
    schedule.validUntil &&
    schedule.validUntil < now
  ) {
    return false;
  }

  return true;
}

function latestSchedule(
  schedules: ScheduleSource[],
  now: Date,
) {
  const active =
    schedules
      .filter((item) =>
        activeAt(item, now),
      )
      .sort((a, b) => {
        const aTime =
          a.validFrom?.getTime() ?? 0;

        const bTime =
          b.validFrom?.getTime() ?? 0;

        return bTime - aTime;
      });

  return active[0] ?? null;
}

function dominantPattern(
  schedules: ScheduleSource[],
  now: Date,
) {
  const buckets =
    new Map<
      string,
      {
        schedule: ScheduleSource;
        samples: number;
      }
    >();

  let totalSamples = 0;

  for (const schedule of schedules) {
    if (
      schedule.validFrom &&
      schedule.validFrom > now
    ) {
      continue;
    }

    const samples =
      estimateSamples(
        schedule,
        now,
      );

    totalSamples += samples;

    const key =
      fingerprint(schedule);

    const current =
      buckets.get(key);

    if (current) {
      current.samples += samples;
    } else {
      buckets.set(key, {
        schedule,
        samples,
      });
    }
  }

  const ranked =
    Array.from(
      buckets.values(),
    ).sort(
      (a, b) =>
        b.samples - a.samples,
    );

  const winner =
    ranked[0];

  if (!winner || totalSamples === 0) {
    return null;
  }

  return {
    schedule: winner.schedule,
    sampleCount:
      winner.samples,
    confidence:
      winner.samples /
      totalSamples,
  };
}

async function getBusinessDate(
  companyId: string,
  now: Date,
) {
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

  const dateKey =
    dateKeyInTimeZone(
      now,
      timeZone,
    );

  return {
    timeZone,
    workDate:
      businessDateFromKey(
        dateKey,
      ),
  };
}

async function syncHabit(
  workforceId: number,
  dayOfWeek: number,
  schedules: ScheduleSource[],
  now: Date,
) {
  const dominant =
    dominantPattern(
      schedules,
      now,
    );

  if (
    !dominant ||
    dominant.sampleCount <
      MIN_SAMPLES ||
    dominant.confidence <
      MIN_CONFIDENCE
  ) {
    return {
      learned: false,
      reason:
        "INSUFFICIENT_HISTORY",
    };
  }

  const existing =
    await prisma.presenceScheduleHabit.findFirst({
      where: {
        workforceId,
        dayOfWeek,
        status: "ACTIVE",
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

  const dominantFingerprint =
    fingerprint(
      dominant.schedule,
    );

  if (!existing) {
    const created =
      await prisma.presenceScheduleHabit.create({
        data: {
          workforceId,
          dayOfWeek,
          isWorkingDay:
            dominant.schedule
              .isWorkingDay,
          morningStart:
            dominant.schedule
              .morningStart,
          morningEnd:
            dominant.schedule
              .morningEnd,
          afternoonStart:
            dominant.schedule
              .afternoonStart,
          afternoonEnd:
            dominant.schedule
              .afternoonEnd,
          sampleCount:
            dominant.sampleCount,
          confidence:
            dominant.confidence,
          firstObservedAt:
            dominant.schedule
              .validFrom ??
            now,
          lastObservedAt: now,
          effectiveFrom:
            dominant.schedule
              .validFrom ??
            now,
        },
      });

    return {
      learned: true,
      created: true,
      habit: created,
    };
  }

  const existingFingerprint =
    fingerprint(existing);

  if (
    existingFingerprint ===
    dominantFingerprint
  ) {
    const updated =
      await prisma.presenceScheduleHabit.update({
        where: {
          id: existing.id,
        },
        data: {
          sampleCount:
            dominant.sampleCount,
          confidence:
            dominant.confidence,
          lastObservedAt: now,
        },
      });

    return {
      learned: true,
      created: false,
      habit: updated,
    };
  }

  return {
    learned: true,
    created: false,
    habit: existing,
    dominantCandidate: {
      schedule:
        dominant.schedule,
      sampleCount:
        dominant.sampleCount,
      confidence:
        dominant.confidence,
    },
  };
}

async function detectChange(
  workforceId: number,
  dayOfWeek: number,
  schedules: ScheduleSource[],
  workDate: Date,
  now: Date,
) {
  const habit =
    await prisma.presenceScheduleHabit.findFirst({
      where: {
        workforceId,
        dayOfWeek,
        status: "ACTIVE",
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

  if (!habit) {
    return null;
  }

  const current =
    latestSchedule(
      schedules,
      now,
    );

  if (!current) {
    return null;
  }

  const expected =
    fingerprint(habit);

  const actual =
    fingerprint(current);

  if (expected === actual) {
    await prisma.presenceScheduleChange.updateMany({
      where: {
        workforceId,
        dayOfWeek,
        status: "OPEN",
      },
      data: {
        status: "RESOLVED",
        resolvedAt: now,
      },
    });

    return null;
  }

  const dominant =
    dominantPattern(
      schedules,
      now,
    );

  const candidateIsCurrent =
    dominant &&
    fingerprint(
      dominant.schedule,
    ) === actual;

  const recurringCandidate =
    Boolean(
      candidateIsCurrent &&
      dominant &&
      dominant.sampleCount >=
        MIN_SAMPLES &&
      dominant.confidence >=
        MIN_CONFIDENCE,
    );

  const kind =
    recurringCandidate
      ? "NEW_RECURRING_PATTERN"
      : "SCHEDULE_CHANGE";

  const expectedText =
    describeSchedule(habit);

  const actualText =
    describeSchedule(current);

  const message =
    recurringCandidate
      ? `Nouveau rythme recurrent detecte : habituellement ${expectedText}, planning observe ${actualText}. Validation manager requise avant adoption.`
      : `Changement detecte : habituellement ${expectedText}, planning actuel ${actualText}.`;

  const openChange =
    await prisma.presenceScheduleChange.findFirst({
      where: {
        workforceId,
        dayOfWeek,
        kind,
        status: "OPEN",
      },
      orderBy: {
        detectedAt: "desc",
      },
    });

  if (openChange) {
    return prisma.presenceScheduleChange.update({
      where: {
        id: openChange.id,
      },
      data: {
        workDate,
        message,
        expectedSnapshot:
          snapshot(habit),
        actualSnapshot:
          snapshot(current),
        severity:
          recurringCandidate
            ? "SUGGESTION"
            : "INFO",
      },
    });
  }

  return prisma.presenceScheduleChange.create({
    data: {
      workforceId,
      workDate,
      dayOfWeek,
      kind,
      message,
      expectedSnapshot:
        snapshot(habit),
      actualSnapshot:
        snapshot(current),
      severity:
        recurringCandidate
          ? "SUGGESTION"
          : "INFO",
      status: "OPEN",
      detectedAt: now,
    },
  });
}

export async function refreshPresenceScheduleLearning(
  companyId: string,
) {
  const now = new Date();

  const {
    timeZone,
    workDate,
  } =
    await getBusinessDate(
      companyId,
      now,
    );

  const workers =
    await prisma.workforce.findMany({
      where: {
        companyId,
        isActive: true,
        onboardingStatus: "ACTIVE",
      },
      select: {
        id: true,
        employeeNumber: true,
        name: true,
        contractType: true,
        agency: true,
        presenceSchedules: {
          orderBy: [
            {
              dayOfWeek: "asc",
            },
            {
              validFrom: "asc",
            },
          ],
          select: {
            id: true,
            dayOfWeek: true,
            morningStart: true,
            morningEnd: true,
            afternoonStart: true,
            afternoonEnd: true,
            isWorkingDay: true,
            validFrom: true,
            validUntil: true,
          },
        },
      },
    });

  let habitsCreated = 0;
  let habitsUpdated = 0;
  let changesDetected = 0;

  const results = [];

  for (const worker of workers) {
    const workerResult = {
      workforceId: worker.id,
      name: worker.name,
      contractType:
        worker.contractType,
      agency: worker.agency,
      days: [] as Array<{
        dayOfWeek: number;
        learned: boolean;
        changeDetected: boolean;
      }>,
    };

    for (
      let dayOfWeek = 1;
      dayOfWeek <= 7;
      dayOfWeek += 1
    ) {
      const schedules =
        worker.presenceSchedules.filter(
          (schedule) =>
            schedule.dayOfWeek ===
            dayOfWeek,
        );

      if (!schedules.length) {
        continue;
      }

      const learning =
        await syncHabit(
          worker.id,
          dayOfWeek,
          schedules,
          now,
        );

      if (
        "habit" in learning &&
        learning.habit
      ) {
        if (
          "created" in learning &&
          learning.created
        ) {
          habitsCreated += 1;
        } else {
          habitsUpdated += 1;
        }
      }

      const change =
        await detectChange(
          worker.id,
          dayOfWeek,
          schedules,
          workDate,
          now,
        );

      if (change) {
        changesDetected += 1;
      }

      workerResult.days.push({
        dayOfWeek,
        learned:
          learning.learned,
        changeDetected:
          Boolean(change),
      });
    }

    results.push(workerResult);
  }

  return {
    success: true,
    companyId,
    timeZone,
    thresholds: {
      minimumSamples:
        MIN_SAMPLES,
      minimumConfidence:
        MIN_CONFIDENCE,
    },
    summary: {
      workers:
        workers.length,
      habitsCreated,
      habitsUpdated,
      changesDetected,
    },
    workers: results,
  };
}
