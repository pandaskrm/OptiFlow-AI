import {
  createHash,
} from "crypto";

import { headers } from "next/headers";

import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  consumeRateLimit,
  getRequestIp,
} from "../../../../../lib/auth/rate-limit";

import {
  prisma,
} from "../../../../../lib/prisma";

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

const DEFAULT_WORKFORCE_JOBS = [
  {
    code: "MANUTENTIONNAIRE",
    name: "Manutentionnaire",
    service: "LOGISTIQUE",
    sortOrder: 10,
  },
  {
    code: "PREPARATEUR",
    name: "Pr?parateur",
    service: "LOGISTIQUE",
    sortOrder: 20,
  },
  {
    code: "MAGASINIER",
    name: "Magasinier",
    service: "LOGISTIQUE",
    sortOrder: 30,
  },
  {
    code: "AUTRE",
    name: "Autre",
    service: "LOGISTIQUE",
    sortOrder: 40,
  },
] as const;

export async function POST(
  request: NextRequest,
) {
  try {
    const body =
      (await request.json()) as {
        code?: unknown;
      };

    const rawCode =
      typeof body.code === "string"
        ? body.code
        : "";

    const normalizedCode =
      normalizeCode(rawCode);

    const requestHeaders = await headers();
    const ipAddress = getRequestIp(requestHeaders);

    const validationRateLimit = await consumeRateLimit({
      action: "PRESENCE_ONBOARDING_VALIDATE_CODE",
      identifier: ipAddress,
      limit: 20,
      windowMs: 15 * 60 * 1000,
    });

    if (!validationRateLimit.allowed) {
      return NextResponse.json(
        {
          error: "TOO_MANY_ATTEMPTS",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              validationRateLimit.retryAfterSeconds,
            ),
          },
        },
      );
    }

    if (
      normalizedCode.length < 4 ||
      normalizedCode.length > 64
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

    const now =
      new Date();

    const accessCode =
      await prisma.workforceAccessCode.findUnique({
        where: {
          codeHash:
            hashCode(
              normalizedCode,
            ),
        },

        select: {
          id: true,
          companyId: true,
          label: true,
          codeHint: true,
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

    const existingJobsCount =
    await prisma.workforceJob.count({
      where: {
        companyId: accessCode.companyId,
        isActive: true,
      },
    });

  if (existingJobsCount === 0) {
    await prisma.workforceJob.createMany({
      data: DEFAULT_WORKFORCE_JOBS.map(
        (job) => ({
          companyId:
            accessCode.companyId,
          code: job.code,
          name: job.name,
          service: job.service,
          sortOrder:
            job.sortOrder,
          isActive: true,
        }),
      ),
      skipDuplicates: true,
    });
  }

      const jobs =
    await prisma.workforceJob.findMany({
        where: {
          companyId:
            accessCode.companyId,

          isActive: true,
        },

        orderBy: [
          {
            sortOrder: "asc",
          },
          {
            service: "asc",
          },
          {
            name: "asc",
          },
        ],

        select: {
          id: true,
          code: true,
          name: true,
          service: true,
        },
      });

    const contractType =
      normalizeContractType(
        accessCode.contractType,
      );

    const population =
      contractType === "INTERIM"
        ? "TEMPORARY"
        : "EMPLOYEES";

    return NextResponse.json({
      success: true,

      access: {
        id:
          accessCode.id,

        label:
          accessCode.label,

        requiresApproval:
          accessCode
            .requiresApproval,

        population,

        contractType:
          contractType ||
          null,

        agency:
          population ===
          "TEMPORARY"
            ? accessCode.agency
            : null,
      },

      company: {
        id:
          accessCode.company.id,

        name:
          accessCode.company.name,
      },

      jobs,

      remainingUses:
        accessCode.maxUses === null
          ? null
          : Math.max(
              0,
              accessCode.maxUses -
                accessCode.usedCount,
            ),
    });
  }
  catch (error) {
    console.error(
      "[Presence onboarding validate-code]",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Impossible de verifier ce code d'acces.",
      },
      {
        status: 500,
      },
    );
  }
}
