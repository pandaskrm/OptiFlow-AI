export type MailProvider =
  | "MICROSOFT_365"
  | "GMAIL"
  | "IMAP";

export type MailConnectionStatus =
  | "DISCONNECTED"
  | "CONFIGURED"
  | "CONNECTED"
  | "ERROR";

export const MAIL_PROVIDERS: Array<{
  value: MailProvider;
  label: string;
}> = [
  {
    value: "MICROSOFT_365",
    label: "Microsoft 365 / Outlook",
  },
  {
    value: "GMAIL",
    label: "Google Workspace / Gmail",
  },
  {
    value: "IMAP",
    label: "Serveur IMAP",
  },
];
