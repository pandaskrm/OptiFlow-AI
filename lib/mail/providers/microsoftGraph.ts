type MicrosoftGraphConnection = {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  mailbox: string;
};

type MicrosoftGraphError = {
  error?: {
    code?: string;
    message?: string;
  };
  error_description?: string;
};

export type MicrosoftGraphMessage = {
  id: string;
  internetMessageId?: string | null;
  subject?: string | null;
  receivedDateTime?: string | null;
  isRead?: boolean;
  parentFolderId?: string | null;
  hasAttachments?: boolean;
  from?: {
    emailAddress?: {
      name?: string | null;
      address?: string | null;
    };
  } | null;
  body?: {
    contentType?: "text" | "html" | string;
    content?: string | null;
  } | null;
};

type MicrosoftGraphMessagesResponse = {
  value?: MicrosoftGraphMessage[];
};

export type MicrosoftGraphMailFolder = {
  id: string;
  displayName?: string | null;
  parentFolderId?: string | null;
  childFolderCount?: number | null;
};

type MicrosoftGraphMailFoldersResponse = {
  value?: MicrosoftGraphMailFolder[];
};

export type MicrosoftGraphMailFolderNode = {
  id: string;
  displayName: string;
  parentFolderId: string | null;
  path: string;
};

type MicrosoftGraphAttachmentListItem = {
  id: string;
  name?: string | null;
  contentType?: string | null;
  size?: number | null;
  isInline?: boolean;
  "@odata.type"?: string;
};

type MicrosoftGraphAttachmentListResponse = {
  value?: MicrosoftGraphAttachmentListItem[];
};

export type MicrosoftGraphFileAttachment = {
  id: string;
  name: string;
  contentType: string | null;
  size: number;
  isInline: boolean;
  contentBytes: string;
};

type MicrosoftGraphFileAttachmentResponse = {
  id?: string;
  name?: string | null;
  contentType?: string | null;
  size?: number | null;
  isInline?: boolean;
  contentBytes?: string | null;
  "@odata.type"?: string;
};

async function readErrorMessage(
  response: Response,
  fallback: string,
) {
  try {
    const data =
      (await response.json()) as MicrosoftGraphError;

    return (
      data.error?.message ??
      data.error_description ??
      fallback
    );
  } catch {
    return fallback;
  }
}

async function getMicrosoftGraphToken({
  tenantId,
  clientId,
  clientSecret,
}: Omit<MicrosoftGraphConnection, "mailbox">) {
  const tokenBody = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
    scope: "https://graph.microsoft.com/.default",
  });

  const response = await fetch(
    `https://login.microsoftonline.com/${encodeURIComponent(
      tenantId,
    )}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body: tokenBody,
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(
        response,
        "Authentification Microsoft 365 refusée.",
      ),
    );
  }

  const data = (await response.json()) as {
    access_token?: string;
  };

  if (!data.access_token) {
    throw new Error(
      "Microsoft n'a retourné aucun jeton d'accès.",
    );
  }

  return data.access_token;
}

export async function testMicrosoftGraphConnection({
  tenantId,
  clientId,
  clientSecret,
  mailbox,
}: MicrosoftGraphConnection) {
  const accessToken = await getMicrosoftGraphToken({
    tenantId,
    clientId,
    clientSecret,
  });

  const response = await fetch(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(
      mailbox,
    )}/mailFolders/inbox/messages?$top=1&$select=id,subject,receivedDateTime`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(
        response,
        "La boîte Outlook est inaccessible.",
      ),
    );
  }

  const data =
    (await response.json()) as MicrosoftGraphMessagesResponse;

  return {
    mailbox,
    accessible: true,
    sampleMessageFound:
      Array.isArray(data.value) &&
      data.value.length > 0,
    sampleSubject:
      data.value?.[0]?.subject ?? null,
  };
}

export async function listMicrosoftGraphMessages({
  tenantId,
  clientId,
  clientSecret,
  mailbox,
}: MicrosoftGraphConnection) {
  const accessToken = await getMicrosoftGraphToken({
    tenantId,
    clientId,
    clientSecret,
  });

  const query = new URLSearchParams({
    "$top": "50",
    "$orderby": "receivedDateTime desc",
    "$select": [
      "id",
      "internetMessageId",
      "subject",
      "receivedDateTime",
      "isRead",
      "parentFolderId",
      "from",
      "body",
      "hasAttachments",
    ].join(","),
  });

  const response = await fetch(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(
      mailbox,
    )}/mailFolders/inbox/messages?${query.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
        Prefer: 'outlook.body-content-type="html"',
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      await readErrorMessage(
        response,
        "Impossible de lire les e-mails Outlook.",
      ),
    );
  }

  const data =
    (await response.json()) as MicrosoftGraphMessagesResponse;

  return Array.isArray(data.value)
    ? data.value
    : [];
}

export async function listMicrosoftGraphFileAttachments({
  tenantId,
  clientId,
  clientSecret,
  mailbox,
  messageId,
}: MicrosoftGraphConnection & {
  messageId: string;
}) {
  const accessToken = await getMicrosoftGraphToken({
    tenantId,
    clientId,
    clientSecret,
  });

  const listResponse = await fetch(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(
      mailbox,
    )}/messages/${encodeURIComponent(
      messageId,
    )}/attachments?$select=id,name,contentType,size,isInline`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );

  if (!listResponse.ok) {
    throw new Error(
      await readErrorMessage(
        listResponse,
        "Impossible de récupérer la liste des pièces jointes.",
      ),
    );
  }

  const listData =
    (await listResponse.json()) as MicrosoftGraphAttachmentListResponse;

  const attachments: MicrosoftGraphFileAttachment[] = [];

  for (const attachment of listData.value ?? []) {
    if (
      !attachment.id ||
      attachment["@odata.type"] !==
        "#microsoft.graph.fileAttachment"
    ) {
      continue;
    }

    const fileResponse = await fetch(
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(
        mailbox,
      )}/messages/${encodeURIComponent(
        messageId,
      )}/attachments/${encodeURIComponent(
        attachment.id,
      )}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );

    if (!fileResponse.ok) {
      throw new Error(
        await readErrorMessage(
          fileResponse,
          `Impossible de télécharger ${attachment.name ?? "la pièce jointe"}.`,
        ),
      );
    }

    const file =
      (await fileResponse.json()) as MicrosoftGraphFileAttachmentResponse;

    if (
      !file.id ||
      !file.name ||
      !file.contentBytes
    ) {
      continue;
    }

    attachments.push({
      id: file.id,
      name: file.name,
      contentType: file.contentType ?? null,
      size: file.size ?? 0,
      isInline: file.isInline ?? false,
      contentBytes: file.contentBytes,
    });
  }

  return attachments;
}

export async function listMicrosoftGraphMailFolders({
  tenantId,
  clientId,
  clientSecret,
  mailbox,
}: MicrosoftGraphConnection) {
  const accessToken = await getMicrosoftGraphToken({
    tenantId,
    clientId,
    clientSecret,
  });

  async function fetchFolders(url: string) {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        await readErrorMessage(
          response,
          "Impossible de récupérer les dossiers Outlook.",
        ),
      );
    }

    const data =
      (await response.json()) as MicrosoftGraphMailFoldersResponse;

    return Array.isArray(data.value)
      ? data.value
      : [];
  }

  const rootFolders = await fetchFolders(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(
      mailbox,
    )}/mailFolders?$top=100&$select=id,displayName,parentFolderId,childFolderCount`,
  );

  const collected = new Map<string, MicrosoftGraphMailFolder>();

  async function walk(
    folder: MicrosoftGraphMailFolder,
  ): Promise<void> {
    if (!folder.id) {
      return;
    }

    collected.set(folder.id, folder);

    if (!folder.childFolderCount) {
      return;
    }

    const children = await fetchFolders(
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(
        mailbox,
      )}/mailFolders/${encodeURIComponent(
        folder.id,
      )}/childFolders?$top=100&$select=id,displayName,parentFolderId,childFolderCount`,
    );

    for (const child of children) {
      await walk(child);
    }
  }

  for (const folder of rootFolders) {
    await walk(folder);
  }

  return Array.from(collected.values());
}

export async function getMicrosoftGraphMailFolderTree({
  tenantId,
  clientId,
  clientSecret,
  mailbox,
}: MicrosoftGraphConnection) {
  const folders = await listMicrosoftGraphMailFolders({
    tenantId,
    clientId,
    clientSecret,
    mailbox,
  });

  const byId = new Map(
    folders.map((folder) => [folder.id, folder]),
  );

  function buildPath(folder: MicrosoftGraphMailFolder) {
    const parts: string[] = [];
    const visited = new Set<string>();

    let current: MicrosoftGraphMailFolder | undefined =
      folder;

    while (current?.id && !visited.has(current.id)) {
      visited.add(current.id);

      const name =
        current.displayName?.trim() || "Dossier sans nom";

      parts.unshift(name);

      if (!current.parentFolderId) {
        break;
      }

      current = byId.get(current.parentFolderId);
    }

    return parts.join(" > ");
  }

  return folders
    .map(
      (folder): MicrosoftGraphMailFolderNode => ({
        id: folder.id,
        displayName:
          folder.displayName?.trim() ||
          "Dossier sans nom",
        parentFolderId:
          folder.parentFolderId ?? null,
        path: buildPath(folder),
      }),
    )
    .sort((a, b) =>
      a.path.localeCompare(b.path, "fr"),
    );
}