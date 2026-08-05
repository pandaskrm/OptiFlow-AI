import Link from "next/link";
import { redirect } from "next/navigation";

import MainLayout from "../../../components/layout/MainLayout";
import { getCurrentSession } from "../../../lib/auth/session";
import { prisma } from "../../../lib/prisma";

const statusLabels: Record<string, string> = {
  NEW: "Nouveau",
  PROCESSING: "Analyse en cours",
  ANALYZED: "Analysé",
  NEEDS_REVIEW: "À vérifier",
  RECEPTION_CREATED: "Réception créée",
  ERROR: "Erreur",
};

const statusStyles: Record<string, string> = {
  NEW: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  PROCESSING:
    "border-blue-500/30 bg-blue-500/10 text-blue-300",
  ANALYZED:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  NEEDS_REVIEW:
    "border-orange-500/30 bg-orange-500/10 text-orange-300",
  RECEPTION_CREATED:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  ERROR: "border-red-500/30 bg-red-500/10 text-red-300",
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(value);
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
                Boîte mail réception
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Les avis d'arrivage détectés seront analysés
                puis transformés en réceptions à valider.
              </p>
            </div>

            <div className="flex items-center gap-3">
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
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                E-mails détectés
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                {messages.length} message
                {messages.length > 1 ? "s" : ""} enregistré
                {messages.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {messages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
              <div className="text-4xl">📧</div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                Aucun e-mail logistique détecté
              </h3>

              <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
                Dès que la boîte sera connectée, les avis
                d'arrivage apparaîtront ici avant la création
                d'une réception.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600">
                    <tr>
                      <th className="px-4 py-3">Reçu</th>
                      <th className="px-4 py-3">Expéditeur</th>
                      <th className="px-4 py-3">Objet</th>
                      <th className="px-4 py-3">Statut</th>
                      <th className="px-4 py-3">Confiance</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200">
                    {messages.map((message) => (
                      <tr
                        key={message.id}
                        className="bg-white transition hover:bg-slate-50"
                      >
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-700">
                          {formatDate(message.receivedAt)}
                        </td>

                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-900">
                            {message.senderName ??
                              message.senderEmail}
                          </p>

                          {message.senderName && (
                            <p className="text-xs text-slate-600">
                              {message.senderEmail}
                            </p>
                          )}
                        </td>

                        <td className="max-w-[420px] px-4 py-3 font-medium text-slate-800">
                          {message.subject}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
                              statusStyles[message.status] ??
                              statusStyles.NEW
                            }`}
                          >
                            {statusLabels[message.status] ??
                              message.status}
                          </span>
                        </td>

                        <td className="px-4 py-3 font-semibold text-slate-700">
                          {message.confidence === null
                            ? "—"
                            : `${Math.round(
                                message.confidence * 100,
                              )} %`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}
