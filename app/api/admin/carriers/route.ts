import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../../lib/auth/session";
import { prisma } from "../../../../lib/prisma";

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

export async function GET() {
  const auth = await getCurrentSession();

  if (!auth) {
    return NextResponse.json(
      { error: "Non authentifié." },
      { status: 401 },
    );
  }

  const carriers = await prisma.carrier.findMany({
    where: {
      companyId: auth.company.id,
    },
    orderBy: [
      {
        isActive: "desc",
      },
      {
        name: "asc",
      },
    ],
  });

  return NextResponse.json({
    carriers,
  });
}

export async function POST(request: Request) {
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

  let body: CarrierBody;

  try {
    body = (await request.json()) as CarrierBody;
  } catch {
    return NextResponse.json(
      { error: "Corps de requête invalide." },
      { status: 400 },
    );
  }

  const name = readString(body.name);
  const code = readString(body.code);
  const contactName = readString(body.contactName);
  const email = readString(body.email);
  const secondaryEmail = readString(
    body.secondaryEmail,
  );
  const phone = readString(body.phone);
  const notes = readString(body.notes);

  const averageLeadTimeHours =
    readOptionalInteger(
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

  const existing = await prisma.carrier.findFirst({
    where: {
      companyId: auth.company.id,
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    return NextResponse.json(
      {
        error:
          "Un transporteur portant ce nom existe déjà.",
      },
      { status: 409 },
    );
  }

  const carrier = await prisma.carrier.create({
    data: {
      companyId: auth.company.id,
      name,
      code: code || null,
      contactName: contactName || null,
      email: email || null,
      secondaryEmail:
        secondaryEmail || null,
      phone: phone || null,
      averageLeadTimeHours,
      notes: notes || null,
      supportsPallet: readBoolean(
        body.supportsPallet,
        true,
      ),
      supportsParcel: readBoolean(
        body.supportsParcel,
        false,
      ),
      supportsExpress: readBoolean(
        body.supportsExpress,
        false,
      ),
      supportsNational: readBoolean(
        body.supportsNational,
        true,
      ),
      supportsInternational: readBoolean(
        body.supportsInternational,
        false,
      ),
      isActive: readBoolean(
        body.isActive,
        true,
      ),
    },
  });

  await prisma.auditLog.create({
    data: {
      companyId: auth.company.id,
      actorId: auth.user.id,
      action: "CARRIER_CREATED",
      entityType: "Carrier",
      entityId: carrier.id,
      details: JSON.stringify({
        name: carrier.name,
        email: carrier.email,
      }),
    },
  });

  return NextResponse.json(
    {
      success: true,
      carrier,
    },
    { status: 201 },
  );
}
