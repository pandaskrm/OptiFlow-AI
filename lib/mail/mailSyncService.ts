import { decryptMailSecret } from "./crypto";
import {
  listMicrosoftGraphFileAttachments,
  listMicrosoftGraphMessages,
} from "./providers/microsoftGraph";
import { prisma } from "../prisma";

type SynchronizeMailInput = {
  companyId: string;
  actorId: string;
};

const ARRIVAL_KEYWORD = "arrivage";
const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;

function normalizeReceivedAt(value?: string | null) {
  if (!value) {
    return new Date();
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? new Date()
    : date;
}

function htmlToPlainText(value: string) {
  return value
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function isArrivalMessage({
  subject,
  body,
}: {
  subject?: string | null;
  body?: string | null;
}) {
  const searchableText = [
    subject ?? "",
    body ? htmlToPlainText(body) : "",
  ]
    .join(" ")
    .toLocaleLowerCase("fr-FR");

  return searchableText.includes(ARRIVAL_KEYWORD);
}

function isExcelAttachment(name: string) {
  const normalizedName =
    name.toLocaleLowerCase("fr-FR");

  return (
    normalizedName.endsWith(".xlsx") ||
    normalizedName.endsWith(".xls")
  );
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

    let arrivalCandidates = 0;
    let imported = 0;
    let duplicates = 0;
    let ignored = 0;
    let attachmentsImported = 0;
    let attachmentsIgnored = 0;

    for (const graphMessage of graphMessages) {
      const senderEmail =
        graphMessage.from?.emailAddress?.address?.trim() ??
        "";

      const bodyContent =
        graphMessage.body?.content?.trim() || null;

      if (
        !graphMessage.id ||
        !senderEmail ||
        !isArrivalMessage({
          subject: graphMessage.subject,
          body: bodyContent,
        })
      ) {
        ignored += 1;
        continue;
      }

      arrivalCandidates += 1;

      const contentType =
        graphMessage.body?.contentType?.toLowerCase();

      const existing =
        await prisma.mailMessage.findUnique({
          where: {
            companyId_externalId: {
              companyId,
              externalId: graphMessage.id,
            },
          },
          include: {
            attachments: {
              select: {
                externalId: true,
              },
            },
          },
        });

      const message =
        existing ??
        (await prisma.mailMessage.create({
          data: {
            companyId,
            connectionId: connection.id,
            externalId: graphMessage.id,
            internetMessageId:
              graphMessage.internetMessageId ?? null,
            outlookFolderId:
              graphMessage.parentFolderId ?? null,
            outlookFolderName: "Boîte de réception",
            isRead:
              graphMessage.isRead === true,
            readAt:
              graphMessage.isRead === true
                ? new Date()
                : null,
            subject:
              graphMessage.subject?.trim() ||
              "Arrivage sans objet",
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
            classification: "ARRIVAGE",
          },
        }));

      if (existing) {
        const outlookIsRead = graphMessage.isRead === true;

        const becameRead =
          !existing.isRead &&
          outlookIsRead;

        await prisma.mailMessage.update({
          where: {
            id: existing.id,
          },
          data: {
            internetMessageId:
              graphMessage.internetMessageId ??
              existing.internetMessageId,
            outlookFolderId:
              graphMessage.parentFolderId ?? null,
            outlookFolderName: "Boîte de réception",
            isRead: outlookIsRead,
            readAt:
              becameRead && !existing.readAt
                ? new Date()
                : existing.readAt,
          },
        });

        duplicates += 1;
      } else {
        imported += 1;
      }

      if (!graphMessage.hasAttachments) {
        continue;
      }

      const graphAttachments =
        await listMicrosoftGraphFileAttachments({
          tenantId: connection.tenantId,
          clientId: connection.clientId,
          clientSecret,
          mailbox: connection.emailAddress,
          messageId: graphMessage.id,
        });

      const existingAttachmentIds = new Set(
        existing?.attachments.map(
          (attachment) => attachment.externalId,
        ) ?? [],
      );

      for (const attachment of graphAttachments) {
        if (
          existingAttachmentIds.has(attachment.id)
        ) {
          continue;
        }

        if (
          attachment.isInline ||
          !isExcelAttachment(attachment.name) ||
          attachment.size > MAX_ATTACHMENT_SIZE
        ) {
          attachmentsIgnored += 1;
          continue;
        }

        const content = Buffer.from(
          attachment.contentBytes,
          "base64",
        );

        await prisma.mailAttachment.create({
          data: {
            messageId: message.id,
            externalId: attachment.id,
            name: attachment.name,
            contentType: attachment.contentType,
            size: attachment.size,
            isInline: attachment.isInline,
            content,
          },
        });

        attachmentsImported += 1;
      }
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
          keyword: ARRIVAL_KEYWORD,
          scanned: graphMessages.length,
          arrivalCandidates,
          imported,
          duplicates,
          ignored,
          attachmentsImported,
          attachmentsIgnored,
        }),
      },
    });

    return {
      mailbox: connection.emailAddress,
      keyword: ARRIVAL_KEYWORD,
      scanned: graphMessages.length,
      arrivalCandidates,
      imported,
      duplicates,
      ignored,
      attachmentsImported,
      attachmentsIgnored,
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
          keyword: ARRIVAL_KEYWORD,
          error: errorMessage,
        }),
      },
    });

    throw new Error(errorMessage);
  }
}
