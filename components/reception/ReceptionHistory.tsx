"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

type ReceptionDocument = {
  id: string;
  type: string;
  name: string;
  contentType: string;
  size: number;
  capturedAt: string;
};

type ReceptionEvent = {
  id: string;
  type: string;
  fromStatus: string | null;
  toStatus: string | null;
  happenedAt: string;
};

type HistoricalReception = {
  id: number;
  number: string;
  supplier: string;
  carrier: string;
  dock: string;
  pallets: number;
  status: string;
  scheduledAt: string;

  arrivedAt: string | null;
  unloadingStartedAt: string | null;
  inspectionStartedAt: string | null;
  completedAt: string | null;

  createdAt: string;
  updatedAt: string;

  receptionDocuments: ReceptionDocument[];
  receptionEvents: ReceptionEvent[];
};

type HistoryResponse = {
  success: boolean;
  receptions: HistoricalReception[];
};

function formatDateTime(
  value?: string | null,
) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "fr-FR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    },
  ).format(date);
}

function formatTime(
  value?: string | null,
) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "fr-FR",
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    },
  ).format(date);
}

function formatDuration(
  start?: string | null,
  end?: string | null,
) {
  if (!start || !end) {
    return "—";
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  const milliseconds =
    endDate.getTime() -
    startDate.getTime();

  if (
    Number.isNaN(milliseconds) ||
    milliseconds < 0
  ) {
    return "—";
  }

  const totalMinutes =
    Math.floor(
      milliseconds / 60000,
    );

  const hours =
    Math.floor(
      totalMinutes / 60,
    );

  const minutes =
    totalMinutes % 60;

  if (hours <= 0) {
    return totalMinutes <= 0
      ? "< 1 min"
      : `${minutes} min`;
  }

  return `${hours} h ${String(
    minutes,
  ).padStart(2, "0")} min`;
}

function getEventLabel(type: string) {
  switch (type) {
    case "ARRIVED_AT_DOCK":
      return "Arrivée au quai";

    case "UNLOADING_STARTED":
      return "Début du déchargement";

    case "INSPECTION_STARTED":
      return "Début du contrôle qualité";

    case "RECEPTION_COMPLETED":
      return "Réception terminée";

    default:
      return type;
  }
}

export default function ReceptionHistory() {
  const [receptions, setReceptions] =
    useState<HistoricalReception[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [dateFilter, setDateFilter] =
    useState("");

  const [openedId, setOpenedId] =
    useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            "/api/receptions/history",
            {
              cache: "no-store",
            },
          );

        const payload =
          (await response.json()) as
            | HistoryResponse
            | {
                error?: string;
              };

        if (!response.ok) {
          throw new Error(
            "error" in payload &&
            payload.error
              ? payload.error
              : "Impossible de charger l'historique.",
          );
        }

        if (
          !cancelled &&
          "receptions" in payload
        ) {
          setReceptions(
            payload.receptions,
          );
        }
      } catch (caughtError) {
        if (!cancelled) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Une erreur est survenue.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadHistory();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredReceptions =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLocaleLowerCase(
            "fr-FR",
          );

      return receptions.filter(
        (reception) => {
          const matchesSearch =
            !normalizedSearch ||
            reception.number
              .toLocaleLowerCase(
                "fr-FR",
              )
              .includes(
                normalizedSearch,
              ) ||
            reception.supplier
              .toLocaleLowerCase(
                "fr-FR",
              )
              .includes(
                normalizedSearch,
              ) ||
            reception.carrier
              .toLocaleLowerCase(
                "fr-FR",
              )
              .includes(
                normalizedSearch,
              ) ||
            reception.dock
              .toLocaleLowerCase(
                "fr-FR",
              )
              .includes(
                normalizedSearch,
              );

          let matchesDate = true;

          if (dateFilter) {
            const source =
              reception.arrivedAt ??
              reception.completedAt ??
              reception.createdAt;

            const date =
              new Date(source);

            if (
              Number.isNaN(
                date.getTime(),
              )
            ) {
              matchesDate = false;
            } else {
              const year =
                date.getFullYear();

              const month =
                String(
                  date.getMonth() + 1,
                ).padStart(2, "0");

              const day =
                String(
                  date.getDate(),
                ).padStart(2, "0");

              matchesDate =
                `${year}-${month}-${day}` ===
                dateFilter;
            }
          }

          return (
            matchesSearch &&
            matchesDate
          );
        },
      );
    }, [
      receptions,
      search,
      dateFilter,
    ]);

  if (loading) {
    return (
      <section className="organia-electric-panel organia-electric-panel-v2 rounded-2xl border border-[#008cff]/55 bg-[#020617] p-6">
        <p className="text-sm font-bold text-[#7df9ff]">
          Chargement de l'historique...
        </p>
      </section>
    );
  }

  return (
    <section className="organia-electric-panel organia-electric-panel-v2 overflow-hidden rounded-2xl border border-[#008cff]/55 bg-gradient-to-br from-[#071426] via-[#04111f] to-[#020617] shadow-[0_0_22px_rgba(0,140,255,0.15)]">

      <header className="border-b border-[#008cff]/25 p-4 sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">

          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#00e5ff]">
              Traçabilité
            </p>

            <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">
              Historique des réceptions
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              Retrouvez les camions réceptionnés,
              leurs horaires réels, leur parcours
              opérationnel et leurs bons de livraison.
            </p>
          </div>

          <div className="rounded-xl border border-[#00e5ff]/30 bg-[#006bff]/10 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
              Réceptions trouvées
            </p>

            <p className="mt-1 text-2xl font-black text-[#7df9ff]">
              {filteredReceptions.length}
            </p>
          </div>

        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_220px_auto]">

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            placeholder="N° réception, fournisseur, transporteur, quai..."
            className="min-h-12 rounded-xl border border-[#008cff]/35 bg-[#020617]/80 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#00e5ff]/70 focus:shadow-[0_0_15px_rgba(0,229,255,0.12)]"
          />

          <input
            type="date"
            value={dateFilter}
            onChange={(event) =>
              setDateFilter(
                event.target.value,
              )
            }
            className="min-h-12 rounded-xl border border-[#008cff]/35 bg-[#020617]/80 px-4 text-sm text-white outline-none transition focus:border-[#00e5ff]/70"
          />

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setDateFilter("");
            }}
            className="min-h-12 rounded-xl border border-[#008cff]/35 bg-[#008cff]/10 px-5 text-sm font-black text-[#7df9ff] transition hover:border-[#00e5ff]/60 hover:bg-[#008cff]/20"
          >
            Réinitialiser
          </button>

        </div>
      </header>

      {error ? (
        <div className="p-6">
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-300">
            {error}
          </div>
        </div>
      ) : filteredReceptions.length === 0 ? (
        <div className="p-8 text-center">
          <p className="font-black text-white">
            Aucune réception trouvée
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Modifiez les critères de recherche.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#008cff]/15">

          {filteredReceptions.map(
            (reception) => {
              const opened =
                openedId ===
                reception.id;

              const deliveryNotes =
                reception.receptionDocuments.filter(
                  (document) =>
                    document.type ===
                    "DELIVERY_NOTE",
                );

              return (
                <article
                  key={reception.id}
                  className="p-4 transition hover:bg-[#008cff]/[0.035] sm:p-6"
                >
                  <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr_1fr_1fr_auto] xl:items-center">

                    <div>
                      <div className="flex flex-wrap items-center gap-2">

                        <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-300">
                          Terminée
                        </span>

                        {deliveryNotes.length > 0 ? (
                          <span className="rounded-lg border border-[#00e5ff]/30 bg-[#00e5ff]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#7df9ff]">
                            BL disponible
                          </span>
                        ) : (
                          <span className="rounded-lg border border-slate-700 bg-slate-900/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                            Sans BL
                          </span>
                        )}

                      </div>

                      <h3 className="mt-3 text-lg font-black text-white">
                        {reception.number}
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        {reception.supplier}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
                        Transporteur
                      </p>

                      <p className="mt-1 font-bold text-slate-200">
                        {reception.carrier}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {reception.dock} ·{" "}
                        {reception.pallets} palettes
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
                        Arrivée réelle
                      </p>

                      <p className="mt-1 font-black text-[#7df9ff]">
                        {formatDateTime(
                          reception.arrivedAt,
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">
                        Durée totale
                      </p>

                      <p className="mt-1 font-black text-white">
                        {formatDuration(
                          reception.arrivedAt,
                          reception.completedAt,
                        )}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setOpenedId(
                          opened
                            ? null
                            : reception.id,
                        )
                      }
                      className="min-h-11 rounded-xl border border-[#008cff]/45 bg-[#008cff]/10 px-4 text-sm font-black text-[#7df9ff] transition hover:border-[#00e5ff]/70 hover:bg-[#008cff]/20"
                    >
                      {opened
                        ? "Fermer"
                        : "Consulter"}
                    </button>

                  </div>

                  {opened && (
                    <div className="mt-5 rounded-2xl border border-[#008cff]/25 bg-[#020617]/70 p-4 sm:p-5">

                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

                        <div className="rounded-xl border border-[#008cff]/20 bg-[#061426]/70 p-3">
                          <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-600">
                            Arrivée quai
                          </p>
                          <p className="mt-1 font-black text-white">
                            {formatTime(
                              reception.arrivedAt,
                            )}
                          </p>
                        </div>

                        <div className="rounded-xl border border-[#008cff]/20 bg-[#061426]/70 p-3">
                          <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-600">
                            Déchargement
                          </p>
                          <p className="mt-1 font-black text-white">
                            {formatTime(
                              reception.unloadingStartedAt,
                            )}
                          </p>
                        </div>

                        <div className="rounded-xl border border-[#008cff]/20 bg-[#061426]/70 p-3">
                          <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-600">
                            Contrôle qualité
                          </p>
                          <p className="mt-1 font-black text-white">
                            {formatTime(
                              reception.inspectionStartedAt,
                            )}
                          </p>
                        </div>

                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-3">
                          <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-600">
                            Terminée
                          </p>
                          <p className="mt-1 font-black text-emerald-300">
                            {formatTime(
                              reception.completedAt,
                            )}
                          </p>
                        </div>

                      </div>

                      {reception.receptionEvents.length > 0 && (
                        <div className="mt-5">

                          <p className="text-xs font-black uppercase tracking-[0.15em] text-[#00e5ff]">
                            Chronologie
                          </p>

                          <div className="mt-3 space-y-2">

                            {reception.receptionEvents.map(
                              (event) => (
                                <div
                                  key={event.id}
                                  className="flex items-center gap-3 rounded-xl border border-[#008cff]/15 bg-[#061426]/50 px-3 py-2.5"
                                >
                                  <span className="h-2 w-2 shrink-0 rounded-full bg-[#00e5ff] shadow-[0_0_8px_#00e5ff]" />

                                  <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold text-slate-200">
                                      {getEventLabel(
                                        event.type,
                                      )}
                                    </p>

                                    {event.fromStatus &&
                                      event.toStatus && (
                                        <p className="text-xs text-slate-600">
                                          {
                                            event.fromStatus
                                          }{" "}
                                          →{" "}
                                          {
                                            event.toStatus
                                          }
                                        </p>
                                      )}
                                  </div>

                                  <p className="shrink-0 text-xs font-black text-[#7df9ff]">
                                    {formatTime(
                                      event.happenedAt,
                                    )}
                                  </p>
                                </div>
                              ),
                            )}

                          </div>
                        </div>
                      )}

                      <div className="mt-5">

                        <p className="text-xs font-black uppercase tracking-[0.15em] text-[#00e5ff]">
                          Documents
                        </p>

                        {deliveryNotes.length === 0 ? (
                          <div className="mt-3 rounded-xl border border-dashed border-slate-700 bg-slate-900/30 p-4">
                            <p className="text-sm text-slate-500">
                              Aucun bon de livraison enregistré pour cette réception.
                            </p>
                          </div>
                        ) : (
                          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">

                            {deliveryNotes.map(
                              (document) => (
                                <a
                                  key={
                                    document.id
                                  }
                                  href={`/api/receptions/${reception.id}/documents/${document.id}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="group overflow-hidden rounded-xl border border-[#008cff]/30 bg-[#061426]/70 transition hover:border-[#00e5ff]/70 hover:shadow-[0_0_18px_rgba(0,229,255,0.12)]"
                                >
                                  {document.contentType.startsWith(
                                    "image/",
                                  ) && (
                                    <div className="aspect-[4/3] overflow-hidden border-b border-[#008cff]/20 bg-black/30">
                                      <img
                                        src={`/api/receptions/${reception.id}/documents/${document.id}`}
                                        alt={
                                          document.name
                                        }
                                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                                      />
                                    </div>
                                  )}

                                  <div className="p-3">
                                    <p className="truncate text-sm font-black text-white">
                                      {
                                        document.name
                                      }
                                    </p>

                                    <p className="mt-1 text-xs font-bold text-[#7df9ff]">
                                      Voir le BL
                                    </p>
                                  </div>
                                </a>
                              ),
                            )}

                          </div>
                        )}

                      </div>

                    </div>
                  )}
                </article>
              );
            },
          )}

        </div>
      )}
    </section>
  );
}
