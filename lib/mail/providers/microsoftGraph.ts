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

type MicrosoftGraphMessagesResponse = {
  value?: Array<{
    id: string;
    subject?: string;
    receivedDateTime?: string;
  }>;
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

export async function testMicrosoftGraphConnection({
  tenantId,
  clientId,
  clientSecret,
  mailbox,
}: MicrosoftGraphConnection) {
  const tokenBody = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
    scope: "https://graph.microsoft.com/.default",
  });

  const tokenResponse = await fetch(
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

  if (!tokenResponse.ok) {
    throw new Error(
      await readErrorMessage(
        tokenResponse,
        "Authentification Microsoft 365 refusée.",
      ),
    );
  }

  const tokenData = (await tokenResponse.json()) as {
    access_token?: string;
  };

  if (!tokenData.access_token) {
    throw new Error(
      "Microsoft n'a retourné aucun jeton d'accès.",
    );
  }

  const messagesResponse = await fetch(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(
      mailbox,
    )}/mailFolders/inbox/messages?$top=1&$select=id,subject,receivedDateTime`,
    {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    },
  );

  if (!messagesResponse.ok) {
    throw new Error(
      await readErrorMessage(
        messagesResponse,
        "La boîte Outlook est inaccessible.",
      ),
    );
  }

  const messages =
    (await messagesResponse.json()) as MicrosoftGraphMessagesResponse;

  return {
    mailbox,
    accessible: true,
    sampleMessageFound:
      Array.isArray(messages.value) &&
      messages.value.length > 0,
    sampleSubject:
      messages.value?.[0]?.subject ?? null,
  };
}
