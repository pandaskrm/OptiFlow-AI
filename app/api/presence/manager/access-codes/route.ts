import {
  createHash,
  randomBytes,
} from "crypto";

import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getCurrentSession,
} from "../../../../../lib/auth/session";

import {
  prisma,
} from "../../../../../lib/prisma";

const MANAGER_ROLES = new Set([
  "ADMIN",
  "LOGISTICS_MANAGER",
  "TEAM_LEADER",
]);

const ACCESS_TYPES = [
  {
    key: "EMPLOYEES",
    label: "Code Embauch?s",
    contractType: "CDI",
  },
  {
    key: "TEMPORARY",
    label: "Code Int?rimaires",
    contractType: "INTERIM",
  },
] as const;

function normalizeCode(value: string) {
  return value
    .trim()
    .replace(/\s+/g, "")
    .toUpperCase();
}

function hashCode(value: string) {
  return createHash("sha256")
    .update(normalizeCode(value), "utf8")
    .digest("hex");
}

function generateCode(prefix: string) {
  return (
    prefix +
    "-" +
    randomBytes(4)
      .toString("hex")
      .toUpperCase()
  );
}

export async function GET() {
  try {
    const session =
      await getCurrentSession();

    if (!session) {
      return NextResponse.json(
        { error: "Non authentifie." },
        { status: 401 },
      );
    }

    if (
      !MANAGER_ROLES.has(
        session.membership.role,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Acces reserve aux responsables.",
        },
        { status: 403 },
      );
    }

    const companyId =
      session.company.id;

    const results = [];

    for (const type of ACCESS_TYPES) {
      let accessCode =
        await prisma.workforceAccessCode.findFirst({
          where: {
            companyId,
            contractType:
              type.contractType,
            isActive: true,
          },

          orderBy: {
            createdAt: "desc",
          },
        });

      let plainCode: string | null =
        null;

      if (!accessCode) {
        plainCode = generateCode(
          type.key === "TEMPORARY"
            ? "INT"
            : "EMP",
        );

        accessCode =
          await prisma.workforceAccessCode.create({
            data: {
              companyId,
              label: type.label,
              contractType:
                type.contractType,

              // L'agence appartient ? la mission,
              // jamais au code commun int?rimaire.
              agency: null,

              codeHash:
                hashCode(plainCode),

              codeHint:
                plainCode.slice(-4),

              isActive: true,
              requiresApproval: false,
              maxUses: null,
              createdBy:
                session.user.id,
            },
          });
      }

      results.push({
        key: type.key,
        label: type.label,
        contractType:
          type.contractType,
        id: accessCode.id,
        codeHint:
          accessCode.codeHint,
        usedCount:
          accessCode.usedCount,

        // Le code complet n'est disponible
        // qu'au moment de sa cr?ation.
        code: plainCode,
      });
    }

    return NextResponse.json({
      success: true,
      accessCodes: results,
    });
  }
  catch (error) {
    console.error(
      "[Presence manager access-codes]",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Impossible de charger les codes d'acces.",
      },
      { status: 500 },
    );
  }
}

type RegenerateBody = {
  type?: unknown;
};

export async function POST(
  request: NextRequest,
) {
  try {
    const session =
      await getCurrentSession();

    if (!session) {
      return NextResponse.json(
        { error: "Non authentifie." },
        { status: 401 },
      );
    }

    if (
      !MANAGER_ROLES.has(
        session.membership.role,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Acces reserve aux responsables.",
        },
        { status: 403 },
      );
    }

    const body =
      (await request.json()) as RegenerateBody;

    const requestedType =
      typeof body.type === "string"
        ? body.type
            .trim()
            .toUpperCase()
        : "";

    const accessType =
      ACCESS_TYPES.find(
        (item) =>
          item.key === requestedType,
      );

    if (!accessType) {
      return NextResponse.json(
        {
          error:
            "Categorie de code invalide.",
        },
        { status: 400 },
      );
    }

    const companyId =
      session.company.id;

    const plainCode =
      generateCode(
        accessType.key ===
          "TEMPORARY"
          ? "INT"
          : "EMP",
      );

    const accessCode =
      await prisma.$transaction(
        async (tx) => {
          await tx.workforceAccessCode.updateMany({
            where: {
              companyId,
              contractType:
                accessType.contractType,
              isActive: true,
            },
            data: {
              isActive: false,
            },
          });

          return tx.workforceAccessCode.create({
            data: {
              companyId,
              label:
                accessType.label,
              contractType:
                accessType.contractType,
              agency: null,
              codeHash:
                hashCode(plainCode),
              codeHint:
                plainCode.slice(-4),
              isActive: true,
              requiresApproval: false,
              maxUses: null,
              createdBy:
                session.user.id,
            },
          });
        },
      );

    return NextResponse.json({
      success: true,
      accessCode: {
        key: accessType.key,
        label:
          accessType.label,
        contractType:
          accessType.contractType,
        id: accessCode.id,
        codeHint:
          accessCode.codeHint,
        usedCount:
          accessCode.usedCount,

        // Affich? uniquement apr?s
        // g?n?ration/r?g?n?ration.
        code: plainCode,
      },
    });
  }
  catch (error) {
    console.error(
      "[Presence manager access-codes POST]",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Impossible de regenerer ce code d'acces.",
      },
      { status: 500 },
    );
  }
}

