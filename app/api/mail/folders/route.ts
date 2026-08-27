import { NextResponse } from "next/server";

import { getCurrentSession } from "../../../../lib/auth/session";
import { decryptMailSecret } from "../../../../lib/mail/crypto";
import { getMicrosoftGraphMailFolderTree } from "../../../../lib/mail/providers/microsoftGraph";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json(
      { error: "Non authentifié." },
      { status: 401 },
    );
  }

  const connection =
    await prisma.mailConnection.findFirst({
      where: {
        companyId: session.company.id,
        provider: "MICROSOFT_365",
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

  if (!connection) {
    return NextResponse.json(
      {
        error:
          "Aucune connexion Microsoft 365 n'est configurée.",
      },
      { status: 404 },
    );
  }

  if (!connection.isEnabled) {
    return NextResponse.json(
      {
        error:
          "La surveillance de la boîte mail n'est pas activée.",
      },
      { status: 409 },
    );
  }

  if (
    !connection.tenantId ||
    !connection.clientId ||
    !connection.clientSecretEncrypted
  ) {
    return NextResponse.json(
      {
        error:
          "La configuration Microsoft 365 est incomplète.",
      },
      { status: 400 },
    );
  }

  try {
    const clientSecret = decryptMailSecret(
      connection.clientSecretEncrypted,
    );

    const folders =
      await getMicrosoftGraphMailFolderTree({
        tenantId: connection.tenantId,
        clientId: connection.clientId,
        clientSecret,
        mailbox: connection.emailAddress,
      });

    return NextResponse.json({
      success: true,
      mailbox: connection.emailAddress,
      count: folders.length,
      folders,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Impossible de récupérer les dossiers Outlook.",
      },
      { status: 502 },
    );
  }
}
