import { prisma } from "../prisma";

export type PresencePlanningPopulation =
  | "EMPLOYEES"
  | "TEMPORARY";

export type PresencePlanningPeriod = {
  year: number;
  month?: number;
};

function normalizeContractType(
  value: string | null,
) {
  return value?.trim().toUpperCase() ?? "";
}

function buildPeriod(
  period: PresencePlanningPeriod,
) {
  const { year, month } = period;

  if (month) {
    const start = new Date(
      Date.UTC(year, month - 1, 1),
    );

    const end = new Date(
      Date.UTC(year, month, 1),
    );

    return {
      start,
      end,
      year,
      month,
    };
  }

  return {
    start: new Date(
      Date.UTC(year, 0, 1),
    ),
    end: new Date(
      Date.UTC(year + 1, 0, 1),
    ),
    year,
    month: null,
  };
}

export async function getPresencePlanning(
  companyId: string,
  population: PresencePlanningPopulation,
  period: PresencePlanningPeriod,
) {
  const range = buildPeriod(period);

  const workers = await prisma.workforce.findMany({
    where: {
      companyId,
      isActive: true,
    },
    select: {
      id: true,
      employeeNumber: true,
      name: true,
      team: true,
      service: true,
      jobTitle: true,
      contractType: true,
      agency: true,
      onboardingStatus: true,
      zone: true,

      job: {
        select: {
          id: true,
          code: true,
          name: true,
          service: true,
          sortOrder: true,
        },
      },

      presenceSchedules: {
        where: {
          OR: [
            {
              validUntil: null,
            },
            {
              validUntil: {
                gte: range.start,
              },
            },
          ],
          validFrom: {
            lt: range.end,
          },
        },
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

      presenceDays: {
        where: {
          workDate: {
            gte: range.start,
            lt: range.end,
          },
        },
        orderBy: {
          workDate: "asc",
        },
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
          note: true,
          managerValidatedAt: true,
          managerValidatedBy: true,
          hrValidatedAt: true,
          hrValidatedBy: true,
        },
      },

      presenceScheduleHabits: {
        where: {
          status: "ACTIVE",
        },
        orderBy: {
          dayOfWeek: "asc",
        },
        select: {
          id: true,
          dayOfWeek: true,
          isWorkingDay: true,
          morningStart: true,
          morningEnd: true,
          afternoonStart: true,
          afternoonEnd: true,
          sampleCount: true,
          confidence: true,
          firstObservedAt: true,
          lastObservedAt: true,
          effectiveFrom: true,
          effectiveUntil: true,
          status: true,
        },
      },

      presenceScheduleChanges: {
        where: {
          status: "OPEN",
        },
        orderBy: [
          {
            severity: "desc",
          },
          {
            detectedAt: "desc",
          },
        ],
        select: {
          id: true,
          workDate: true,
          dayOfWeek: true,
          kind: true,
          message: true,
          expectedSnapshot: true,
          actualSnapshot: true,
          severity: true,
          status: true,
          detectedAt: true,
          acknowledgedAt: true,
          acknowledgedBy: true,
        },
      },

      absenceRequests: {
        where: {
          status: "PENDING",

          startDate: {
            lt: range.end,
          },

          endDate: {
            gte: range.start,
          },
        },
        orderBy: {
          submittedAt: "asc",
        },
        select: {
          id: true,
          type: true,
          startDate: true,
          endDate: true,
          startPart: true,
          endPart: true,
          employeeComment: true,
          status: true,
          submittedAt: true,

          documents: {
            select: {
              id: true,
              category: true,
              isMedical: true,
            },
          },
        },
      },
    },
  });

  const filteredWorkers = workers.filter(
    (worker) => {
      const contractType =
        normalizeContractType(
          worker.contractType,
        );

      const isTemporary =
        contractType === "INTERIM";

      return population === "TEMPORARY"
        ? isTemporary
        : !isTemporary;
    },
  );

  const sortedWorkers =
    filteredWorkers.sort(
      (a, b) =>
        a.name.localeCompare(
          b.name,
          "fr",
          {
            sensitivity: "base",
          },
        ),
    );

  return {
    population,

    period: {
      year: range.year,
      month: range.month,
      start: range.start,
      end: range.end,
    },

    workers: sortedWorkers,
    total: sortedWorkers.length,
  };
}
