import {
  createHash,
  randomBytes,
} from "crypto";

import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  hashPassword,
} from "../../../../../lib/auth/password";

import {
  prisma,
} from "../../../../../lib/prisma";

type RegisterBody = {
  code?: unknown;
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  password?: unknown;
  phone?: unknown;
  jobId?: unknown;
  agency?: unknown;
  missionDuration?: unknown;
};

function normalizeCode(
  value: string,
) {
  return value
    .trim()
    .replace(/\s+/g, "")
    .toUpperCase();
}

function hashCode(
  value: string,
) {
  return createHash("sha256")
    .update(
      normalizeCode(value),
      "utf8",
    )
    .digest("hex");
}

function readString(
  value: unknown,
) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function normalizeEmail(
  value: string,
) {
  return value
    .trim()
    .toLowerCase();
}

function normalizeContractType(
  value: string | null,
) {
  return (
    value
      ?.trim()
      .toUpperCase() ??
    ""
  );
}

function createEmployeeNumber() {
  return (
    "ORG-" +
    randomBytes(6)
      .toString("hex")
      .toUpperCase()
  );
}

const TEMPORARY_MISSION_DURATIONS = new Set([
  "1_DAY",
  "2_DAYS",
  "3_DAYS",
  "4_DAYS",
  "1_WEEK",
  "1_MONTH",
]);

function calculateMissionEndDate(
  startDate: Date,
  duration: string,
) {
  const endDate =
    new Date(startDate);

  switch (duration) {
    case "1_DAY":
      break;

    case "2_DAYS":
      endDate.setDate(
        endDate.getDate() + 1,
      );
      break;

    case "3_DAYS":
      endDate.setDate(
        endDate.getDate() + 2,
      );
      break;

    case "4_DAYS":
      endDate.setDate(
        endDate.getDate() + 3,
      );
      break;

    case "1_WEEK":
      endDate.setDate(
        endDate.getDate() + 6,
      );
      break;

    case "1_MONTH":
      endDate.setMonth(
        endDate.getMonth() + 1,
      );
      endDate.setDate(
        endDate.getDate() - 1,
      );
      break;
  }

  return endDate;
}

export async function POST(
  request: NextRequest,
) {
  try {
    let body: RegisterBody;

    try {
      body =
        (await request.json()) as RegisterBody;
    }
    catch {
      return NextResponse.json(
        {
          error:
            "REQUEST_INVALID",
        },
        {
          status: 400,
        },
      );
    }

    const code =
      normalizeCode(
        readString(body.code),
      );

    const firstName =
      readString(
        body.firstName,
      );

    const lastName =
      readString(
        body.lastName,
      );

    const email =
      normalizeEmail(
        readString(body.email),
      );

    const password =
      readString(
        body.password,
      );

    const phone =
      readString(
        body.phone,
      );

    const jobId =
      readString(
        body.jobId,
      );

    const submittedAgency =
      readString(
        body.agency,
      );

    const missionDuration =
      readString(
        body.missionDuration,
      )
        .toUpperCase();

    if (
      code.length < 4 ||
      code.length > 64
    ) {
      return NextResponse.json(
        {
          error:
            "CODE_INVALID",
        },
        {
          status: 400,
        },
      );
    }

    if (
      firstName.length < 2 ||
      firstName.length > 80 ||
      lastName.length < 2 ||
      lastName.length > 80
    ) {
      return NextResponse.json(
        {
          error:
            "IDENTITY_INVALID",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "EMAIL_INVALID",
        },
        {
          status: 400,
        },
      );
    }

    if (
      password.length < 8 ||
      password.length > 200
    ) {
      return NextResponse.json(
        {
          error:
            "PASSWORD_INVALID",
        },
        {
          status: 400,
        },
      );
    }

    if (!jobId) {
      return NextResponse.json(
        {
          error:
            "JOB_REQUIRED",
        },
        {
          status: 400,
        },
      );
    }

    const codeHash =
      hashCode(code);

    const now =
      new Date();

    const accessCode =
      await prisma.workforceAccessCode.findUnique({
        where: {
          codeHash,
        },

        select: {
          id: true,
          companyId: true,
          label: true,
          agency: true,
          contractType: true,
          isActive: true,
          requiresApproval: true,
          maxUses: true,
          usedCount: true,
          expiresAt: true,

          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

    const isLcaCompany =
      accessCode?.company.name
        .trim()
        .toLowerCase()
        .startsWith("lca");

    const agency =
      isLcaCompany
        ? "Actual"
        : submittedAgency;

    if (
      !accessCode ||
      !accessCode.isActive
    ) {
      return NextResponse.json(
        {
          error:
            "CODE_INVALID",
        },
        {
          status: 404,
        },
      );
    }

    if (
      accessCode.expiresAt &&
      accessCode.expiresAt <= now
    ) {
      return NextResponse.json(
        {
          error:
            "CODE_EXPIRED",
        },
        {
          status: 410,
        },
      );
    }

    if (
      accessCode.maxUses !== null &&
      accessCode.usedCount >=
        accessCode.maxUses
    ) {
      return NextResponse.json(
        {
          error:
            "CODE_USAGE_LIMIT_REACHED",
        },
        {
          status: 410,
        },
      );
    }

    const job =
      await prisma.workforceJob.findFirst({
        where: {
          id: jobId,
          companyId:
            accessCode.companyId,
          isActive: true,
        },

        select: {
          id: true,
          name: true,
          service: true,
        },
      });

    if (!job) {
      return NextResponse.json(
        {
          error:
            "JOB_INVALID",
        },
        {
          status: 400,
        },
      );
    }

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },

        select: {
          id: true,
        },
      });

    if (existingUser) {
      return NextResponse.json(
        {
          error:
            "EMAIL_ALREADY_USED",
        },
        {
          status: 409,
        },
      );
    }

    const passwordHash =
      await hashPassword(
        password,
      );

    const contractType =
      normalizeContractType(
        accessCode.contractType,
      );

    const population =
      contractType === "INTERIM"
        ? "TEMPORARY"
        : "EMPLOYEES";

    if (
      population === "TEMPORARY" &&
      (
        agency.length < 2 ||
        agency.length > 120
      )
    ) {
      return NextResponse.json(
        {
          error:
            "AGENCY_REQUIRED",
        },
        {
          status: 400,
        },
      );
    }

    if (
      population === "TEMPORARY" &&
      !TEMPORARY_MISSION_DURATIONS.has(
        missionDuration,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "MISSION_DURATION_INVALID",
        },
        {
          status: 400,
        },
      );
    }

    const missionStartDate =
      population === "TEMPORARY"
        ? new Date(now)
        : null;

    const missionEndDate =
      missionStartDate
        ? calculateMissionEndDate(
            missionStartDate,
            missionDuration,
          )
        : null;

    const onboardingStatus =
      accessCode.requiresApproval
        ? "PENDING"
        : "ACTIVE";

    const fullName =
      `${firstName} ${lastName}`
        .replace(/\s+/g, " ")
        .trim();

    const result =
      await prisma.$transaction(
        async (transaction) => {
          /*
           * Re-consume the access code atomically inside
           * the same transaction.
           *
           * If the limit has been reached between the
           * initial validation and this transaction,
           * count === 0 and nothing is created.
           */
          const consumeWhere = {
            id:
              accessCode.id,

            isActive:
              true,

            ...(accessCode.expiresAt
              ? {
                  expiresAt: {
                    gt: now,
                  },
                }
              : {}),
          };

          const consumed =
            accessCode.maxUses === null
              ? await transaction
                  .workforceAccessCode
                  .updateMany({
                    where:
                      consumeWhere,

                    data: {
                      usedCount: {
                        increment: 1,
                      },
                    },
                  })
              : await transaction
                  .workforceAccessCode
                  .updateMany({
                    where: {
                      ...consumeWhere,

                      usedCount: {
                        lt:
                          accessCode.maxUses,
                      },
                    },

                    data: {
                      usedCount: {
                        increment: 1,
                      },
                    },
                  });

          if (
            consumed.count !== 1
          ) {
            throw new Error(
              "ACCESS_CODE_CONSUMPTION_FAILED",
            );
          }

          const user =
            await transaction.user.create({
              data: {
                email,
                passwordHash,
                firstName,
                lastName,

                phone:
                  phone ||
                  null,

                isActive:
                  true,
              },
            });

          const membership =
            await transaction.membership.create({
              data: {
                userId:
                  user.id,

                companyId:
                  accessCode.companyId,

                role:
                  "OPERATOR",

                isActive:
                  true,
              },
            });

          const workforce =
            await transaction.workforce.create({
              data: {
                employeeNumber:
                  createEmployeeNumber(),

                name:
                  fullName,

                companyId:
                  accessCode.companyId,

                membershipId:
                  membership.id,

                jobId:
                  job.id,

                service:
                  job.service,

                jobTitle:
                  job.name,

                contractType:
                  contractType ||
                  null,

                agency:
                  population ===
                  "TEMPORARY"
                    ? agency
                    : null,

                onboardingStatus,

                onboardingSource:
                  "ACCESS_CODE",

                isActive:
                  true,
              },
            });

          const mission =
            population === "TEMPORARY" &&
            missionStartDate &&
            missionEndDate
              ? await transaction
                  .workforceMission
                  .create({
                    data: {
                      workforceId:
                        workforce.id,

                      companyId:
                        accessCode.companyId,

                      agency,

                      contractType:
                        contractType ||
                        "INTERIM",

                      startDate:
                        missionStartDate,

                      endDate:
                        missionEndDate,

                      status:
                        onboardingStatus ===
                        "ACTIVE"
                          ? "ACTIVE"
                          : "PENDING",
                    },
                  })
              : null;

          await transaction.auditLog.create({
            data: {
              companyId:
                accessCode.companyId,

              actorId:
                user.id,

              action:
                "PRESENCE_EMPLOYEE_ONBOARDED",

              entityType:
                "Workforce",

              entityId:
                String(
                  workforce.id,
                ),

              details:
                JSON.stringify({
                  workforceId:
                    workforce.id,

                  membershipId:
                    membership.id,

                  accessCodeId:
                    accessCode.id,

                  accessCodeLabel:
                    accessCode.label,

                  population,

                  contractType:
                    contractType ||
                    null,

                  agency:
                    population ===
                    "TEMPORARY"
                      ? agency
                      : null,

                  missionId:
                    mission?.id ??
                    null,

                  missionDuration:
                    population ===
                    "TEMPORARY"
                      ? missionDuration
                      : null,

                  missionStartDate:
                    mission?.startDate ??
                    null,

                  missionEndDate:
                    mission?.endDate ??
                    null,

                  jobId:
                    job.id,

                  job:
                    job.name,

                  service:
                    job.service,

                  onboardingStatus,
                }),
            },
          });

          return {
            success: true as const,

            user: {
              id:
                user.id,

              email:
                user.email,

              firstName:
                user.firstName,

              lastName:
                user.lastName,
            },

            membership: {
              id:
                membership.id,

              role:
                membership.role,
            },

            workforce: {
              id:
                workforce.id,

              employeeNumber:
                workforce.employeeNumber,

              name:
                workforce.name,

              contractType:
                workforce.contractType,

              agency:
                workforce.agency,

              service:
                workforce.service,

              jobTitle:
                workforce.jobTitle,

              onboardingStatus:
                workforce.onboardingStatus,
            },
          };
        },
      );

    return NextResponse.json(
      {
        success: true,

        company: {
          id:
            accessCode.company.id,

          name:
            accessCode.company.name,
        },

        population,

        requiresApproval:
          accessCode
            .requiresApproval,

        user:
          result.user,

        membership:
          result.membership,

        workforce:
          result.workforce,

        next:
          accessCode
            .requiresApproval
            ? "WAIT_FOR_APPROVAL"
            : "LOGIN",
      },
      {
        status: 201,
      },
    );
  }
  catch (error) {
    console.error(
      "[Presence onboarding register]",
      error,
    );

    if (
      error instanceof Error &&
      error.message ===
        "ACCESS_CODE_CONSUMPTION_FAILED"
    ) {
      return NextResponse.json(
        {
          error:
            "CODE_USAGE_LIMIT_REACHED",
        },
        {
          status: 410,
        },
      );
    }

    const errorCode =
      typeof error === "object" &&
      error !== null &&
      "code" in error
        ? String(
            (
              error as {
                code?: unknown;
              }
            ).code,
          )
        : "";

    if (
      errorCode ===
      "P2002"
    ) {
      return NextResponse.json(
        {
          error:
            "CONFLICT",
        },
        {
          status: 409,
        },
      );
    }

    return NextResponse.json(
      {
        error:
          "Impossible de creer ce compte salarie.",
      },
      {
        status: 500,
      },
    );
  }
}
