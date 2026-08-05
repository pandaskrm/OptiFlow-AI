import Link from "next/link";
import { redirect } from "next/navigation";

import MainLayout from "../../../components/layout/MainLayout";
import MailInboxCenter from "../../../components/mail/MailInboxCenter";
import MailSyncButton from "../../../components/mail/MailSyncButton";
import { getCurrentSession } from "../../../lib/auth/session";
import { prisma } from "../../../lib/prisma";

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(value);
}

function htmlToPlainText(value: string | null) {
  if (!value) {
    return "";
  }

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

export default async function ReceptionMailPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login");
  }

  const messages = await prisma.mailMessage.findMany({
    where: {
      companyId: session.company.id,
    },
    orderBy: {
      receivedAt: "desc",
    },
    take: 100,
  });

  const connection = await prisma.mailConnection.findFirst({
    where: {
      companyId: session.company.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const inboxMessages = messages.map((message) => ({
    id: message.id,
    subject: message.subject,
    senderEmail: message.senderEmail,
    senderName: message.senderName,
    receivedAt: message.receivedAt.toISOString(),
    status: message.status,
    classification: message.classification,
    confidence: message.confidence,
    content:
      message.bodyText?.trim() ||
      htmlToPlainText(message.bodyHtml) ||
      "Aucun contenu textuel disponible.",
    processingError: message.processingError,
    receptionId: message.receptionId,
  }));

  return (
    <MainLayout>
      <div className="space-y-5">
        <section className="rounded-2xl border border-cyan-400/20 bg-slate-950 p-5 text-white shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
                Mail Intelligence
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                Centre de traitement des e-mails
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Centralisez, contrôlez et préparez les avis
                d'arrivage avant leur analyse par OptiFlow AI.
              </p>
            </div>

            <div className="flex flex-wrap items-start justify-end gap-3">
              <MailSyncButton
                disabled={
                  !connection?.isEnabled ||
                  connection.status !== "CONNECTED"
                }
              />

              <span
                className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${
                  connection?.isEnabled
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : "border-slate-700 bg-slate-800 text-slate-300"
                }`}
              >
                {connection?.isEnabled
                  ? connection.status
                  : "Non connectée"}
              </span>

              <Link
                href="/parametres"
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-500 hover:text-white"
              >
                Configurer
              </Link>

              {connection?.lastSyncedAt && (
                <p className="w-full text-right text-xs text-slate-400">
                  Dernière synchronisation :{" "}
                  {formatDate(connection.lastSyncedAt)}
                </p>
              )}
            </div>
          </div>
        </section>

        <MailInboxCenter
          initialMessages={inboxMessages}
        />
      </div>
    </MainLayout>
  );
}
