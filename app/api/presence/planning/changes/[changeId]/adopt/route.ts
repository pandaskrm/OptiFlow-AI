import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getCurrentSession,
} from "../../../../../../../lib/auth/session";

import {
  prisma,
} from "../../../../../../../lib/prisma";

const ALLOWED_ROLES =
  new Set([
    "ADMIN",
    "LOGISTICS_MANAGER",
    "TEAM_LEADER",
  ]);

type ScheduleSnapshot = {
  isWorkingDay?: boolean;
  morningStart?: string | null;
  morningEnd?: string | null;
  afternoonStart?: string | null;
  afternoonEnd?: string | null;
};

function parseSnapshot(
  value: string | null,
): ScheduleSnapshot | null {
  if (!value) {
    return null;
  }

  try {
    const parsed =
      JSON.parse(value) as ScheduleSnapshot;

    return parsed;
  }
  catch {
    return null;
  }
}

function normalizeTime(
  value: string | null | undefined,
) {
  const trimmed =
    value?.trim();

  return trimmed || null;
}

export async function POST(
  _request: NextRequest,
  context: {
    params: Promise<{
      changeId: string;
    }>;
  },
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

  if (
    !ALLOWED_ROLES.has(
      session.membership.role,
    )
  ) {
    return NextResponse.json(
      {
        error: "FORBIDDEN",
      },
      {
        status: 403,
      },
    );
  }

  const {
    changeId,
  } =
    await context.params;

  const change =
    await prisma.presenceScheduleChange.findFirst({
      where: {
        id: changeId,

        workforce: {
          companyId:
            session.company.id,
        },
      },

      include: {
        workforce: {
          select: {
            id: true,
            employeeNumber: true,
            name: true,
            companyId: true,
          },
        },
      },
    });

  if (!change) {
    return NextResponse.json(
      {
        error:
          "CHANGE_NOT_FOUND",
      },
      {
        status: 404,
      },
    );
  }

  if (
    change.status !== "OPEN"
  ) {
    return NextResponse.json(
      {
        error:
          "CHANGE_ALREADY_RESOLVED",
      },
      {
        status: 409,
      },
    );
  }

  if (
    change.kind !==
    "NEW_RECURRING_PATTERN"
  ) {
    return NextResponse.json(
      {
        error:
          "CHANGE_NOT_RECURRING_PATTERN",
      },
      {
        status: 409,
      },
    );
  }

  const snapshot =
    parseSnapshot(
      change.actualSnapshot,
    );

  if (!snapshot) {
    return NextResponse.json(
      {
        error:
          "INVALID_SCHEDULE_SNAPSHOT",
      },
      {
        status: 409,
      },
    );
  }

  const now =
    new Date();

  const result =
    await prisma.$transaction(
      async (transaction) => {
        const previousHabit =
          await transaction.presenceScheduleHabit.findFirst({
            where: {
              workforceId:
                change.workforceId,

              dayOfWeek:
                change.dayOfWeek,

              status: "ACTIVE",
            },

            orderBy: {
              updatedAt: "desc",
            },
          });

        await transaction.presenceScheduleHabit.updateMany({
          where: {
            workforceId:
              change.workforceId,

            dayOfWeek:
              change.dayOfWeek,

            status: "ACTIVE",
          },

          data: {
            status: "SUPERSEDED",
            effectiveUntil: now,
          },
        });

        const newHabit =
          await transaction.presenceScheduleHabit.create({
            data: {
              workforceId:
                change.workforceId,

              dayOfWeek:
                change.dayOfWeek,

              isWorkingDay:
                snapshot.isWorkingDay ??
                true,

              morningStart:
                normalizeTime(
                  snapshot.morningStart,
                ),

              morningEnd:
                normalizeTime(
                  snapshot.morningEnd,
                ),

              afternoonStart:
                normalizeTime(
                  snapshot.afternoonStart,
                ),

              afternoonEnd:
                normalizeTime(
                  snapshot.afternoonEnd,
                ),

              sampleCount: 1,
              confidence: 1,

              firstObservedAt:
                change.detectedAt,

              lastObservedAt:
                now,

              effectiveFrom:
                now,

              status:
                "ACTIVE",
            },
          });

        const resolvedChange =
          await transaction.presenceScheduleChange.update({
            where: {
              id: change.id,
            },

            data: {
              status:
                "ACCEPTED_AS_NEW_PATTERN",

              acknowledgedAt:
                now,

              acknowledgedBy:
                session.user.id,

              resolvedAt:
                now,

              resolvedBy:
                session.user.id,
            },
          });

        await transaction.auditLog.create({
          data: {
            companyId:
              session.company.id,

            actorId:
              session.user.id,

            action:
              "PRESENCE_SCHEDULE_PATTERN_ADOPTED",

            entityType:
              "PresenceScheduleChange",

            entityId:
              change.id,

            details:
              JSON.stringify({
                workforceId:
                  change.workforceId,

                employeeNumber:
                  change.workforce
                    .employeeNumber,

                employeeName:
                  change.workforce.name,

                dayOfWeek:
                  change.dayOfWeek,

                previousHabitId:
                  previousHabit?.id ??
                  null,

                newHabitId:
                  newHabit.id,

                previousHabit:
                  previousHabit
                    ? {
                        isWorkingDay:
                          previousHabit
                            .isWorkingDay,

                        morningStart:
                          previousHabit
                            .morningStart,

                        morningEnd:
                          previousHabit
                            .morningEnd,

                        afternoonStart:
                          previousHabit
                            .afternoonStart,

                        afternoonEnd:
                          previousHabit
                            .afternoonEnd,
                      }
                    : null,

                adoptedPattern:
                  snapshot,

                sourceChangeId:
                  change.id,
              }),
          },
        });

        return {
          newHabit,
          change:
            resolvedChange,
        };
      },
    );

  return NextResponse.json({
    success: true,

    employee: {
      id:
        change.workforce.id,

      name:
        change.workforce.name,

      employeeNumber:
        change.workforce
          .employeeNumber,
    },

    habit:
      result.newHabit,

    change:
      result.change,
  });
}
