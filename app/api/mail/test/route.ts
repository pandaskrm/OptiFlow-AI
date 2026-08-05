import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../../lib/auth/session";
import { decryptMailSecret } from "../../../../lib/mail/crypto";
import { testMicrosoftGraphConnection } from "../../../../lib/mail/providers/microsoftGraph";
import { prisma } from "../../../../lib/prisma";

type TestMailConnectionBody = {
  provider?: unknown;
  emailAddress?: unknown;
  tenantId?: unknown;
  clientId?: unknown;
  clientSecret?: unknown;
};

function readString(value: unknown) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

export async function POST(request: Request) {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json(
      { error: "Non authentifié." },
      { status: 401 },
    );
  }

  if (
    session.membership.role !== "ADMIN" &&
    session.membership.role !== "OWNER"
  ) {
    return NextResponse.json(
      { error: "Droits administrateur requis." },
      { status: 403 },
    );
  }

  let body: TestMailConnectionBody;

  try {
    body =
      (await request.json()) as TestMailConnectionBody;
  } catch {
    return NextResponse.json(
      { error: "Corps de requête invalide." },
      { status: 400 },
    );
  }

  const provider = readString(body.provider);

  const existingConnection =
    await prisma.mailConnection.findFirst({
      where: {
        companyId: session.company.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

  const emailAddress =
    readString(body.emailAddress) ||
    existingConnection?.emailAddress ||
    "";

  const tenantId =
    readString(body.tenantId) ||
    existingConnection?.tenantId ||
    "";

  const clientId =
    readString(body.clientId) ||
    existingConnection?.clientId ||
    "";

  const submittedClientSecret =
    readString(body.clientSecret);

  let clientSecret = submittedClientSecret;

  if (
    !clientSecret &&
    existingConnection?.clientSecretEncrypted
  ) {
    try {
      clientSecret = decryptMailSecret(
        existingConnection.clientSecretEncrypted,
      );
    } catch {
      return NextResponse.json(
        {
          error:
            "Le secret Microsoft enregistré est illisible. Saisissez-le de nouveau.",
        },
        { status: 400 },
      );
    }
  }

  if (provider !== "MICROSOFT_365") {
    return NextResponse.json(
      {
        error:
          "Le test réel est actuellement disponible pour Microsoft 365. Gmail et IMAP seront branchés ensuite.",
      },
      { status: 501 },
    );
  }

  if (!emailAddress || !emailAddress.includes("@")) {
    return NextResponse.json(
      { error: "Adresse e-mail invalide." },
      { status: 400 },
    );
  }

  if (!tenantId) {
    return NextResponse.json(
      { error: "Le Tenant ID est obligatoire." },
      { status: 400 },
    );
  }

  if (!clientId) {
    return NextResponse.json(
      { error: "Le Client ID est obligatoire." },
      { status: 400 },
    );
  }

  if (!clientSecret) {
    return NextResponse.json(
      { error: "Le secret client est obligatoire." },
      { status: 400 },
    );
  }

  try {
    const result =
      await testMicrosoftGraphConnection({
        tenantId,
        clientId,
        clientSecret,
        mailbox: emailAddress,
      });

    if (existingConnection) {
      await prisma.mailConnection.update({
        where: {
          id: existingConnection.id,
        },
        data: {
          status: "CONNECTED",
          lastTestedAt: new Date(),
          lastError: null,
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        companyId: session.company.id,
        actorId: session.user.id,
        action: "MAIL_CONNECTION_TEST_SUCCEEDED",
        entityType: "MailConnection",
        entityId:
          existingConnection?.id ?? emailAddress,
        details: JSON.stringify({
          provider,
          emailAddress,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      status: "CONNECTED",
      message:
        "Connexion Microsoft 365 réussie. OptiFlow AI peut accéder à la boîte de réception.",
      result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Connexion Microsoft 365 impossible.";

    if (existingConnection) {
      await prisma.mailConnection.update({
        where: {
          id: existingConnection.id,
        },
        data: {
          status: "ERROR",
          lastTestedAt: new Date(),
          lastError: errorMessage,
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        companyId: session.company.id,
        actorId: session.user.id,
        action: "MAIL_CONNECTION_TEST_FAILED",
        entityType: "MailConnection",
        entityId:
          existingConnection?.id ?? emailAddress,
        details: JSON.stringify({
          provider,
          emailAddress,
          error: errorMessage,
        }),
      },
    });

    return NextResponse.json(
      { error: errorMessage },
      { status: 502 },
    );
  }
}
