import { NextResponse } from "next/server";

import { hashPassword } from "../../../../lib/auth/password";
import { prisma } from "../../../../lib/prisma";

type BootstrapBody = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  passwordConfirmation?: string;

  companyName?: string;
  siret?: string;
  companyEmail?: string;
  phone?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  country?: string;

  warehouseName?: string;
};

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizeSiret(value: string) {
  return value.replace(/\D/g, "");
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidFrenchPostalCode(value: string) {
  return /^\d{5}$/.test(value);
}

function isValidSiret(value: string) {
  if (!/^\d{14}$/.test(value)) {
    return false;
  }

  let sum = 0;

  for (let index = 0; index < value.length; index += 1) {
    let digit = Number(value[index]);

    if (index % 2 === 0) {
      digit *= 2;

      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
  }

  return sum % 10 === 0;
}

export async function POST(request: Request) {
  try {
    const existingUsers = await prisma.user.count();

    if (existingUsers > 0) {
      return NextResponse.json(
        {
          error: "La configuration initiale a déjà été réalisée.",
        },
        { status: 409 }
      );
    }

    const body = (await request.json()) as BootstrapBody;

    const firstName = body.firstName?.trim() ?? "";
    const lastName = body.lastName?.trim() ?? "";
    const email = normalizeEmail(body.email ?? "");
    const password = body.password ?? "";
    const passwordConfirmation =
      body.passwordConfirmation ?? "";

    const companyName = body.companyName?.trim() ?? "";
    const siret = normalizeSiret(body.siret ?? "");
    const companyEmail = normalizeEmail(
      body.companyEmail ?? email
    );
    const phone = body.phone?.trim() ?? "";
    const address = body.address?.trim() ?? "";
    const postalCode = body.postalCode?.trim() ?? "";
    const city = body.city?.trim() ?? "";
    const country = body.country?.trim() || "France";
    const warehouseName =
      body.warehouseName?.trim() || "Entrepôt principal";

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !passwordConfirmation ||
      !companyName ||
      !siret ||
      !companyEmail ||
      !address ||
      !postalCode ||
      !city ||
      !warehouseName
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
        {
          error:
            "L’adresse e-mail de l’administrateur est invalide.",
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(companyEmail)) {
      return NextResponse.json(
        {
          error:
            "L’adresse e-mail de l’entreprise est invalide.",
        },
        { status: 400 }
      );
    }

    if (!isValidSiret(siret)) {
      return NextResponse.json(
        {
          error:
            "Le numéro SIRET doit contenir 14 chiffres et être valide.",
        },
        { status: 400 }
      );
    }

    if (!isValidFrenchPostalCode(postalCode)) {
      return NextResponse.json(
        {
          error:
            "Le code postal doit contenir exactement 5 chiffres.",
        },
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

    if (password !== passwordConfirmation) {
      return NextResponse.json(
        {
          error:
            "La confirmation du mot de passe ne correspond pas.",
        },
        { status: 400 }
      );
    }

    const existingCompany = await prisma.company.findFirst({
      where: {
        siret,
      },
      select: {
        id: true,
      },
    });

    if (existingCompany) {
      return NextResponse.json(
        {
          error:
            "Une entreprise utilisant ce numéro SIRET existe déjà.",
        },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const result = await prisma.$transaction(
      async (transaction) => {
        const company = await transaction.company.create({
          data: {
            name: companyName,
            legalName: companyName,
            siret,
            email: companyEmail,
            phone: phone || null,
            address,
            postalCode,
            city,
            country,
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

        const warehouse =
          await transaction.warehouse.create({
            data: {
              companyId: company.id,
              name: warehouseName,
              code: "PRINCIPAL",
              address,
              postalCode,
              city,
              country,
            },
          });

        await transaction.auditLog.create({
          data: {
            companyId: company.id,
            actorId: user.id,
            action: "COMPANY_BOOTSTRAPPED",
            entityType: "Company",
            entityId: company.id,
            details: JSON.stringify({
              administratorEmail: email,
              warehouseId: warehouse.id,
            }),
          },
        });

        return {
          company,
          user,
          warehouse,
        };
      }
    );

    return NextResponse.json(
      {
        message:
          "L’entreprise et le compte administrateur ont été créés.",
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
        },
        company: {
          id: result.company.id,
          name: result.company.name,
          siret: result.company.siret,
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
          "Impossible de créer l’entreprise et le premier administrateur.",
      },
      { status: 500 }
    );
  }
}