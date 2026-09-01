import { prisma } from "../prisma";

export type PresencePlanningPopulation =
  | "EMPLOYEES"
  | "TEMPORARY";

function normalizeContractType(
  value: string | null,
) {
  return value?.trim().toUpperCase() ?? "";
}

export async function getPresencePlanning(
  companyId: string,
  population: PresencePlanningPopulation,
) {
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
        orderBy: {
          workDate: "desc",
        },
        take: 62,
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

      absenceRequests: {
        where: {
          status: "PENDING",
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

  const filteredWorkers = workers.filter((worker) => {
    const contractType =
      normalizeContractType(worker.contractType);

    const isTemporary =
      contractType === "INTERIM";

    return population === "TEMPORARY"
      ? isTemporary
      : !isTemporary;
  });

  const sortedWorkers = filteredWorkers.sort(
    (a, b) =>
      a.name.localeCompare(b.name, "fr", {
        sensitivity: "base",
      }),
  );

  return {
    population,
    workers: sortedWorkers,
    total: sortedWorkers.length,
  };
}
