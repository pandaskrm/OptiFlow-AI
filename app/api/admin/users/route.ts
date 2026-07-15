import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../../lib/auth/session";
import { hashPassword } from "../../../../lib/auth/password";
import { prisma } from "../../../../lib/prisma";

const ALLOWED_ROLES = [
  "ADMIN",
  "LOGISTICS_MANAGER",
  "TEAM_LEADER",
  "OPERATOR",
  "READ_ONLY",
] as const;

type AllowedRole = (typeof ALLOWED_ROLES)[number];

type CreateUserBody = {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  temporaryPassword?: string;
};

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isAllowedRole(value: string): value is AllowedRole {
  return ALLOWED_ROLES.includes(value as AllowedRole);
}

export async function GET() {
  const auth = await getCurrentSession();

  if (!auth) {
    return NextResponse.json(
      { error: "Authentification requise." },
      { status: 401 }
    );
  }

  if (auth.membership.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Accès réservé aux administrateurs." },
      { status: 403 }
    );
  }

  const memberships = await prisma.membership.findMany({
    where: {
      companyId: auth.company.id,
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return NextResponse.json({
    users: memberships.map((membership) => ({
      membershipId: membership.id,
      userId: membership.user.id,
      firstName: membership.user.firstName,
      lastName: membership.user.lastName,
      email: membership.user.email,
      role: membership.role,
      isActive:
        membership.isActive && membership.user.isActive,
      createdAt: membership.createdAt,
      lastLoginAt: membership.user.lastLoginAt,
    })),
  });
}

export async function POST(request: Request) {
  try {
    const auth = await getCurrentSession();

    if (!auth) {
      return NextResponse.json(
        { error: "Authentification requise." },
        { status: 401 }
      );
    }

    if (auth.membership.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Accès réservé aux administrateurs." },
        { status: 403 }
      );
    }

    const body = (await request.json()) as CreateUserBody;

    const firstName = body.firstName?.trim() ?? "";
    const lastName = body.lastName?.trim() ?? "";
    const email = normalizeEmail(body.email ?? "");
    const role = body.role?.trim() ?? "";
    const temporaryPassword = body.temporaryPassword ?? "";

    if (
      !firstName ||
      !lastName ||
      !email ||
      !role ||
      !temporaryPassword
    ) {
      return NextResponse.json(
        {
          error:
            "Tous les champs doivent être renseignés.",
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "L’adresse e-mail est invalide." },
        { status: 400 }
      );
    }

    if (!isAllowedRole(role)) {
      return NextResponse.json(
        { error: "Le rôle sélectionné est invalide." },
        { status: 400 }
      );
    }

    if (temporaryPassword.length < 10) {
      return NextResponse.json(
        {
          error:
            "Le mot de passe temporaire doit contenir au moins 10 caractères.",
        },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        memberships: {
          where: {
            companyId: auth.company.id,
          },
        },
      },
    });

    if (existingUser?.memberships.length) {
      return NextResponse.json(
        {
          error:
            "Cet utilisateur appartient déjà à votre entreprise.",
        },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(
      temporaryPassword
    );

    const result = await prisma.$transaction(
      async (transaction) => {
        const user =
          existingUser ??
          (await transaction.user.create({
            data: {
              firstName,
              lastName,
              email,
              passwordHash,
              emailVerifiedAt: new Date(),
            },
          }));

        const membership =
          await transaction.membership.create({
            data: {
              userId: user.id,
              companyId: auth.company.id,
              role,
            },
          });

        await transaction.auditLog.create({
          data: {
            companyId: auth.company.id,
            actorId: auth.user.id,
            action: "USER_CREATED",
            entityType: "User",
            entityId: user.id,
            details: JSON.stringify({
              email,
              role,
            }),
          },
        });

        return {
          user,
          membership,
        };
      }
    );

    return NextResponse.json(
      {
        message: "Le collaborateur a été créé.",
        user: {
          id: result.user.id,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          email: result.user.email,
          role: result.membership.role,
          isActive: result.membership.isActive,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create user error:", error);

    return NextResponse.json(
      {
        error:
          "Impossible de créer le collaborateur.",
      },
      { status: 500 }
    );
  }
}