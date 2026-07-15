import { NextResponse } from "next/server";

import { hashPassword } from "../../../../lib/auth/password";
import { prisma } from "../../../../lib/prisma";

type BootstrapBody = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  companyName?: string;
  warehouseName?: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const existingUsers = await prisma.user.count();

    if (existingUsers > 0) {
      return NextResponse.json(
        {
          error:
            "La configuration initiale a déjà été réalisée.",
        },
        { status: 409 }
      );
    }

    const body = (await request.json()) as BootstrapBody;

    const firstName = body.firstName?.trim() ?? "";
    const lastName = body.lastName?.trim() ?? "";
    const email = normalizeEmail(body.email ?? "");
    const password = body.password ?? "";
    const companyName = body.companyName?.trim() ?? "";
    const warehouseName =
      body.warehouseName?.trim() || "Entrepôt principal";

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !companyName
    ) {
      return NextResponse.json(
        {
          error:
            "Tous les champs obligatoires doivent être renseignés.",
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

    if (password.length < 10) {
      return NextResponse.json(
        {
          error:
            "Le mot de passe doit contenir au moins 10 caractères.",
        },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const result = await prisma.$transaction(async (transaction) => {
      const company = await transaction.company.create({
        data: {
          name: companyName,
          email,
        },
      });

      const user = await transaction.user.create({
        data: {
          firstName,
          lastName,
          email,
          passwordHash,
          emailVerifiedAt: new Date(),
        },
      });

      await transaction.membership.create({
        data: {
          userId: user.id,
          companyId: company.id,
          role: "ADMIN",
        },
      });

      const warehouse = await transaction.warehouse.create({
        data: {
          companyId: company.id,
          name: warehouseName,
          code: "PRINCIPAL",
        },
      });

      return {
        user,
        company,
        warehouse,
      };
    });

    return NextResponse.json(
      {
        message:
          "Le compte administrateur et l’entreprise ont été créés.",
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
        },
        company: {
          id: result.company.id,
          name: result.company.name,
        },
        warehouse: {
          id: result.warehouse.id,
          name: result.warehouse.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Bootstrap authentication error:", error);

    return NextResponse.json(
      {
        error:
          "Impossible de créer le premier compte administrateur.",
      },
      { status: 500 }
    );
  }
}