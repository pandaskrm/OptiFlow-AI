import { decryptMailSecret } from "./crypto";
import { listMicrosoftGraphMessages } from "./providers/microsoftGraph";
import { prisma } from "../prisma";

type SynchronizeMailInput = {
  companyId: string;
  actorId: string;
};

function normalizeReceivedAt(value?: string | null) {
  if (!value) {
    return new Date();
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? new Date()
    : date;
}

export async function synchronizeMicrosoftMailbox({
  companyId,
  actorId,
}: SynchronizeMailInput) {
  const connection =
    await prisma.mailConnection.findFirst({
      where: {
        companyId,
        provider: "MICROSOFT_365",
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

  if (!connection) {
    throw new Error(
      "Aucune connexion Microsoft 365 n'est configurée.",
    );
  }

  if (!connection.isEnabled) {
    throw new Error(
      "La surveillance de la boîte mail n'est pas activée.",
    );
  }

  if (
    !connection.tenantId ||
    !connection.clientId ||
    !connection.clientSecretEncrypted
  ) {
    throw new Error(
      "La configuration Microsoft 365 est incomplète.",
    );
  }

  const clientSecret = decryptMailSecret(
    connection.clientSecretEncrypted,
  );

  try {
    const graphMessages =
      await listMicrosoftGraphMessages({
        tenantId: connection.tenantId,
        clientId: connection.clientId,
        clientSecret,
        mailbox: connection.emailAddress,
      });

    let imported = 0;
    let duplicates = 0;
    let ignored = 0;

    for (const graphMessage of graphMessages) {
      const senderEmail =
        graphMessage.from?.emailAddress?.address?.trim() ??
        "";

      if (!graphMessage.id || !senderEmail) {
        ignored += 1;
        continue;
      }

      const existing =
        await prisma.mailMessage.findUnique({
          where: {
            companyId_externalId: {
              companyId,
              externalId: graphMessage.id,
            },
          },
          select: {
            id: true,
          },
        });

      if (existing) {
        duplicates += 1;
        continue;
      }

      const bodyContent =
        graphMessage.body?.content?.trim() || null;

      const contentType =
        graphMessage.body?.contentType?.toLowerCase();

      await prisma.mailMessage.create({
        data: {
          companyId,
          connectionId: connection.id,
          externalId: graphMessage.id,
          internetMessageId:
            graphMessage.internetMessageId ?? null,
          subject:
            graphMessage.subject?.trim() ||
            "Sans objet",
          senderEmail,
          senderName:
            graphMessage.from?.emailAddress?.name?.trim() ||
            null,
          receivedAt: normalizeReceivedAt(
            graphMessage.receivedDateTime,
          ),
          bodyHtml:
            contentType === "html"
              ? bodyContent
              : null,
          bodyText:
            contentType === "html"
              ? null
              : bodyContent,
          status: "NEW",
        },
      });

      imported += 1;
    }

    const synchronizedAt = new Date();

    await prisma.mailConnection.update({
      where: {
        id: connection.id,
      },
      data: {
        status: "CONNECTED",
        lastSyncedAt: synchronizedAt,
        lastError: null,
      },
    });

    await prisma.auditLog.create({
      data: {
        companyId,
        actorId,
        action: "MAIL_SYNCHRONIZATION_COMPLETED",
        entityType: "MailConnection",
        entityId: connection.id,
        details: JSON.stringify({
          mailbox: connection.emailAddress,
          scanned: graphMessages.length,
          imported,
          duplicates,
          ignored,
        }),
      },
    });

    return {
      mailbox: connection.emailAddress,
      scanned: graphMessages.length,
      imported,
      duplicates,
      ignored,
      synchronizedAt,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Synchronisation Microsoft 365 impossible.";

    await prisma.mailConnection.update({
      where: {
        id: connection.id,
      },
      data: {
        status: "ERROR",
        lastError: errorMessage,
      },
    });

    await prisma.auditLog.create({
      data: {
        companyId,
        actorId,
        action: "MAIL_SYNCHRONIZATION_FAILED",
        entityType: "MailConnection",
        entityId: connection.id,
        details: JSON.stringify({
          mailbox: connection.emailAddress,
          error: errorMessage,
        }),
      },
    });

    throw new Error(errorMessage);
  }
}
