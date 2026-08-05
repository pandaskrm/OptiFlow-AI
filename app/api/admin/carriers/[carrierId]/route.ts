import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../../../lib/auth/session";
import { prisma } from "../../../../../lib/prisma";

type CarrierBody = {
  name?: unknown;
  code?: unknown;
  contactName?: unknown;
  email?: unknown;
  secondaryEmail?: unknown;
  phone?: unknown;
  averageLeadTimeHours?: unknown;
  notes?: unknown;
  supportsPallet?: unknown;
  supportsParcel?: unknown;
  supportsExpress?: unknown;
  supportsNational?: unknown;
  supportsInternational?: unknown;
  isActive?: unknown;
};

function readString(value: unknown) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function readBoolean(
  value: unknown,
  fallback: boolean,
) {
  return typeof value === "boolean"
    ? value
    : fallback;
}

function readOptionalInteger(value: unknown) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number =
    typeof value === "number"
      ? value
      : Number(value);

  if (
    !Number.isInteger(number) ||
    number < 0 ||
    number > 8760
  ) {
    return undefined;
  }

  return number;
}

function canManage(role: string) {
  return (
    role === "ADMIN" ||
    role === "OWNER" ||
    role === "LOGISTICS_MANAGER"
  );
}

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      carrierId: string;
    }>;
  },
) {
  const auth = await getCurrentSession();

  if (!auth) {
    return NextResponse.json(
      { error: "Non authentifié." },
      { status: 401 },
    );
  }

  if (!canManage(auth.membership.role)) {
    return NextResponse.json(
      {
        error:
          "Droits administrateur ou responsable logistique requis.",
      },
      { status: 403 },
    );
  }

  const { carrierId } = await context.params;

  const currentCarrier =
    await prisma.carrier.findFirst({
      where: {
        id: carrierId,
        companyId: auth.company.id,
      },
    });

  if (!currentCarrier) {
    return NextResponse.json(
      {
        error: "Transporteur introuvable.",
      },
      { status: 404 },
    );
  }

  let body: CarrierBody;

  try {
    body = (await request.json()) as CarrierBody;
  } catch {
    return NextResponse.json(
      { error: "Corps de requête invalide." },
      { status: 400 },
    );
  }

  const name =
    body.name === undefined
      ? currentCarrier.name
      : readString(body.name);

  const email =
    body.email === undefined
      ? currentCarrier.email
      : readString(body.email) || null;

  const secondaryEmail =
    body.secondaryEmail === undefined
      ? currentCarrier.secondaryEmail
      : readString(body.secondaryEmail) ||
        null;

  const averageLeadTimeHours =
    body.averageLeadTimeHours === undefined
      ? currentCarrier.averageLeadTimeHours
      : readOptionalInteger(
          body.averageLeadTimeHours,
        );

  if (!name) {
    return NextResponse.json(
      {
        error:
          "Le nom du transporteur est obligatoire.",
      },
      { status: 400 },
    );
  }

  if (
    email &&
    !email.includes("@")
  ) {
    return NextResponse.json(
      {
        error:
          "L'adresse e-mail principale est invalide.",
      },
      { status: 400 },
    );
  }

  if (
    secondaryEmail &&
    !secondaryEmail.includes("@")
  ) {
    return NextResponse.json(
      {
        error:
          "L'adresse e-mail secondaire est invalide.",
      },
      { status: 400 },
    );
  }

  if (averageLeadTimeHours === undefined) {
    return NextResponse.json(
      {
        error:
          "Le délai moyen doit être un nombre entier positif.",
      },
      { status: 400 },
    );
  }

  const duplicate =
    await prisma.carrier.findFirst({
      where: {
        companyId: auth.company.id,
        id: {
          not: currentCarrier.id,
        },
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
      },
    });

  if (duplicate) {
    return NextResponse.json(
      {
        error:
          "Un autre transporteur porte déjà ce nom.",
      },
      { status: 409 },
    );
  }

  const carrier = await prisma.carrier.update({
    where: {
      id: currentCarrier.id,
    },
    data: {
      name,
      code:
        body.code === undefined
          ? currentCarrier.code
          : readString(body.code) || null,
      contactName:
        body.contactName === undefined
          ? currentCarrier.contactName
          : readString(body.contactName) ||
            null,
      email,
      secondaryEmail,
      phone:
        body.phone === undefined
          ? currentCarrier.phone
          : readString(body.phone) || null,
      averageLeadTimeHours,
      notes:
        body.notes === undefined
          ? currentCarrier.notes
          : readString(body.notes) || null,
      supportsPallet: readBoolean(
        body.supportsPallet,
        currentCarrier.supportsPallet,
      ),
      supportsParcel: readBoolean(
        body.supportsParcel,
        currentCarrier.supportsParcel,
      ),
      supportsExpress: readBoolean(
        body.supportsExpress,
        currentCarrier.supportsExpress,
      ),
      supportsNational: readBoolean(
        body.supportsNational,
        currentCarrier.supportsNational,
      ),
      supportsInternational: readBoolean(
        body.supportsInternational,
        currentCarrier.supportsInternational,
      ),
      isActive: readBoolean(
        body.isActive,
        currentCarrier.isActive,
      ),
    },
  });

  await prisma.auditLog.create({
    data: {
      companyId: auth.company.id,
      actorId: auth.user.id,
      action: "CARRIER_UPDATED",
      entityType: "Carrier",
      entityId: carrier.id,
      details: JSON.stringify({
        name: carrier.name,
        isActive: carrier.isActive,
      }),
    },
  });

  return NextResponse.json({
    success: true,
    carrier,
  });
}

export async function DELETE(
  _request: Request,
  context: {
    params: Promise<{
      carrierId: string;
    }>;
  },
) {
  const auth = await getCurrentSession();

  if (!auth) {
    return NextResponse.json(
      { error: "Non authentifié." },
      { status: 401 },
    );
  }

  if (
    auth.membership.role !== "ADMIN" &&
    auth.membership.role !== "OWNER"
  ) {
    return NextResponse.json(
      {
        error:
          "Suppression réservée aux administrateurs.",
      },
      { status: 403 },
    );
  }

  const { carrierId } = await context.params;

  const carrier =
    await prisma.carrier.findFirst({
      where: {
        id: carrierId,
        companyId: auth.company.id,
      },
    });

  if (!carrier) {
    return NextResponse.json(
      {
        error: "Transporteur introuvable.",
      },
      { status: 404 },
    );
  }

  await prisma.carrier.delete({
    where: {
      id: carrier.id,
    },
  });

  await prisma.auditLog.create({
    data: {
      companyId: auth.company.id,
      actorId: auth.user.id,
      action: "CARRIER_DELETED",
      entityType: "Carrier",
      entityId: carrier.id,
      details: JSON.stringify({
        name: carrier.name,
      }),
    },
  });

  return NextResponse.json({
    success: true,
  });
}
