"use client";

import { useMemo, useState } from "react";

export type MailInboxMessage = {
  id: string;
  subject: string;
  senderEmail: string;
  senderName: string | null;
  receivedAt: string;
  status: string;
  classification: string | null;
  confidence: number | null;
  content: string;
  processingError: string | null;
  receptionId: number | null;
};

type StatusUpdateResponse = {
  success?: boolean;
  error?: string;
  message?: {
    id: string;
    status: string;
  };
};

const statusLabels: Record<string, string> = {
  NEW: "Nouveau",
  PROCESSING: "Analyse en cours",
  ANALYZED: "Analysé",
  NEEDS_REVIEW: "À vérifier",
  RECEPTION_CREATED: "Réception créée",
  IGNORED: "Ignoré",
  ERROR: "Erreur",
};

const statusStyles: Record<string, string> = {
  NEW: "border-cyan-500/30 bg-cyan-500/10 text-cyan-700",
  PROCESSING:
    "border-blue-500/30 bg-blue-500/10 text-blue-700",
  ANALYZED:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
  NEEDS_REVIEW:
    "border-orange-500/30 bg-orange-500/10 text-orange-700",
  RECEPTION_CREATED:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
  IGNORED:
    "border-slate-400/40 bg-slate-100 text-slate-600",
  ERROR:
    "border-red-500/30 bg-red-500/10 text-red-700",
};

const filterOptions = [
  { value: "ALL", label: "Tous les statuts" },
  { value: "NEW", label: "Nouveaux" },
  { value: "ANALYZED", label: "Analysés" },
  { value: "NEEDS_REVIEW", label: "À vérifier" },
  { value: "RECEPTION_CREATED", label: "Réceptions créées" },
  { value: "IGNORED", label: "Ignorés" },
  { value: "ERROR", label: "Erreurs" },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${
        statusStyles[status] ?? statusStyles.NEW
      }`}
    >
      {statusLabels[status] ?? status}
    </span>
  );
}

export default function MailInboxCenter({
  initialMessages,
}: {
  initialMessages: MailInboxMessage[];
}) {
  const [messages, setMessages] =
    useState<MailInboxMessage[]>(initialMessages);

  const [selectedId, setSelectedId] = useState(
    initialMessages[0]?.id ?? "",
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isError, setIsError] = useState(false);

  const counters = useMemo(
    () => ({
      new: messages.filter(
        (message) => message.status === "NEW",
      ).length,
      analyzed: messages.filter(
        (message) => message.status === "ANALYZED",
      ).length,
      review: messages.filter(
        (message) => message.status === "NEEDS_REVIEW",
      ).length,
      errors: messages.filter(
        (message) => message.status === "ERROR",
      ).length,
    }),
    [messages],
  );

  const filteredMessages = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLocaleLowerCase("fr-FR");

    return messages.filter((message) => {
      const matchesStatus =
        statusFilter === "ALL" ||
        message.status === statusFilter;

      const matchesSearch =
        !normalizedSearch ||
        message.subject
          .toLocaleLowerCase("fr-FR")
          .includes(normalizedSearch) ||
        message.senderEmail
          .toLocaleLowerCase("fr-FR")
          .includes(normalizedSearch) ||
        (message.senderName ?? "")
          .toLocaleLowerCase("fr-FR")
          .includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [messages, search, statusFilter]);

  const selectedMessage =
    messages.find(
      (message) => message.id === selectedId,
    ) ?? filteredMessages[0] ?? null;

  async function updateStatus(status: string) {
    if (!selectedMessage) {
      return;
    }

    setUpdating(true);
    setFeedback("");
    setIsError(false);

    try {
      const response = await fetch(
        `/api/mail/messages/${selectedMessage.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        },
      );

      const data =
        (await response.json()) as StatusUpdateResponse;

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Mise à jour du message impossible.",
        );
      }

      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.id === selectedMessage.id
            ? {
                ...message,
                status:
                  data.message?.status ?? status,
              }
            : message,
        ),
      );

      setFeedback(
        status === "IGNORED"
          ? "E-mail marqué comme ignoré."
          : "E-mail ajouté aux messages à vérifier.",
      );
    } catch (error) {
      setIsError(true);
      setFeedback(
        error instanceof Error
          ? error.message
          : "Mise à jour impossible.",
      );
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="space-y-4">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <CounterCard
          label="Nouveaux"
          value={counters.new}
          description="En attente de traitement"
        />

        <CounterCard
          label="Analysés"
          value={counters.analyzed}
          description="Analyse IA terminée"
        />

        <CounterCard
          label="À vérifier"
          value={counters.review}
          description="Contrôle humain requis"
        />

        <CounterCard
          label="Erreurs"
          value={counters.errors}
          description="Traitement à corriger"
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_240px]">
          <label className="block">
            <span className="sr-only">
              Rechercher un e-mail
            </span>

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Rechercher par objet, expéditeur ou adresse..."
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-cyan-500"
            />
          </label>

          <label className="block">
            <span className="sr-only">
              Filtrer les e-mails
            </span>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-800 outline-none focus:border-cyan-500"
            >
              {filterOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      {messages.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
          <div className="text-4xl">📧</div>

          <h3 className="mt-4 text-lg font-bold text-slate-900">
            Aucun e-mail logistique détecté
          </h3>

          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
            Dès que la boîte sera synchronisée, les avis
            d'arrivage apparaîtront ici avant la création
            d'une réception.
          </p>
        </section>
      ) : (
        <section className="grid min-h-[520px] gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-4 py-3">
              <h2 className="font-bold text-slate-950">
                E-mails détectés
              </h2>

              <p className="mt-1 text-xs text-slate-600">
                {filteredMessages.length} résultat
                {filteredMessages.length > 1 ? "s" : ""}
              </p>
            </div>

            <div className="max-h-[600px] overflow-y-auto">
              {filteredMessages.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-600">
                  Aucun e-mail ne correspond à cette
                  recherche.
                </div>
              ) : (
                filteredMessages.map((message) => {
                  const selected =
                    message.id === selectedMessage?.id;

                  return (
                    <button
                      key={message.id}
                      type="button"
                      onClick={() =>
                        setSelectedId(message.id)
                      }
                      className={`block w-full border-b border-slate-100 p-4 text-left transition ${
                        selected
                          ? "bg-cyan-50"
                          : "bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-bold text-slate-950">
                            {message.subject}
                          </p>

                          <p className="mt-1 truncate text-sm text-slate-700">
                            {message.senderName ??
                              message.senderEmail}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {formatDate(message.receivedAt)}
                          </p>
                        </div>

                        <StatusBadge
                          status={message.status}
                        />
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            {selectedMessage ? (
              <>
                <div className="border-b border-slate-200 pb-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-700">
                        Aperçu du message
                      </p>

                      <h2 className="mt-2 break-words text-xl font-bold text-slate-950">
                        {selectedMessage.subject}
                      </h2>
                    </div>

                    <StatusBadge
                      status={selectedMessage.status}
                    />
                  </div>

                  <dl className="mt-4 grid gap-3 text-sm">
                    <div>
                      <dt className="font-semibold text-slate-500">
                        Expéditeur
                      </dt>

                      <dd className="mt-1 break-words font-semibold text-slate-900">
                        {selectedMessage.senderName
                          ? `${selectedMessage.senderName} — ${selectedMessage.senderEmail}`
                          : selectedMessage.senderEmail}
                      </dd>
                    </div>

                    <div>
                      <dt className="font-semibold text-slate-500">
                        Reçu
                      </dt>

                      <dd className="mt-1 font-semibold text-slate-900">
                        {formatDate(
                          selectedMessage.receivedAt,
                        )}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-bold text-slate-900">
                    Contenu
                  </h3>

                  <div className="mt-2 max-h-[250px] overflow-y-auto whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                    {selectedMessage.content}
                  </div>
                </div>

                {selectedMessage.processingError && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {selectedMessage.processingError}
                  </div>
                )}

                {feedback && (
                  <div
                    className={`mt-4 rounded-xl border p-3 text-sm ${
                      isError
                        ? "border-red-200 bg-red-50 text-red-700"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {feedback}
                  </div>
                )}

                <div className="mt-5 grid gap-2">
                  <button
                    type="button"
                    disabled
                    title="Disponible au prochain sprint IA"
                    className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-bold text-white opacity-50"
                  >
                    Analyser avec l'IA
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateStatus("NEEDS_REVIEW")
                    }
                    disabled={updating}
                    className="rounded-xl border border-orange-300 bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700 transition hover:bg-orange-100 disabled:opacity-50"
                  >
                    Ajouter aux e-mails à vérifier
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateStatus("IGNORED")
                    }
                    disabled={updating}
                    className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                  >
                    Ignorer ce message
                  </button>
                </div>
              </>
            ) : (
              <div className="flex h-full min-h-[300px] items-center justify-center text-center text-sm text-slate-600">
                Sélectionnez un e-mail pour afficher son
                contenu.
              </div>
            )}
          </aside>
        </section>
      )}
    </div>
  );
}

function CounterCard({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-600">
        {label}
      </p>

      <p className="mt-2 text-3xl font-black text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-xs font-medium text-slate-500">
        {description}
      </p>
    </article>
  );
}
