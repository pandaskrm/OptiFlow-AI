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
      "from",
      "body",
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
