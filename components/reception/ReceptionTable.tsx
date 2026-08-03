"use client";

import { Fragment, useEffect, useState } from "react";

import {
  getNextStatus,
  getStatusColor,
  RECEPTION_STATUS,
  STATUS_ORDER,
} from "../../constants/receptionStatus";
import { Reception } from "../../types/reception";
import ReceptionTimeline from "../timeline/ReceptionTimeline";

type ReceptionTableProps = {
  refreshKey: number;
  onDeleted: () => void;
};

function getActionLabel(status: string) {
  if (status === RECEPTION_STATUS.PLANNED) {
    return "Démarrer";
  }

  if (status === RECEPTION_STATUS.AT_DOCK) {
    return "Déchargement";
  }

  if (status === RECEPTION_STATUS.UNLOADING) {
    return "Contrôle";
  }

  if (status === RECEPTION_STATUS.INSPECTION) {
    return "Terminer";
  }

  return "Terminée";
}

function getProgress(status: string) {
  const index = STATUS_ORDER.indexOf(status as never);

  if (index === -1) {
    return 0;
  }

  return Math.round(
    ((index + 1) / STATUS_ORDER.length) * 100,
  );
}

function formatScheduledAt(value?: string | null) {
  if (!value) {
    return {
      date: "Non renseignée",
      time: "",
    };
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return {
      date: value,
      time: "",
    };
  }

  return {
    date: new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(parsedDate),

    time: new Intl.DateTimeFormat("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(parsedDate),
  };
}

function getPlanningStatus(
  scheduledAt?: string | null,
  status?: string,
) {
  if (!scheduledAt) {
    return null;
  }

  if (status === RECEPTION_STATUS.COMPLETED) {
    return {
      label: "Terminée",
      className:
        "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    };
  }

  const scheduledDate = new Date(scheduledAt);

  if (Number.isNaN(scheduledDate.getTime())) {
    return null;
  }

  const now = new Date();
  const difference =
    scheduledDate.getTime() - now.getTime();

  if (difference < 0) {
    return {
      label: "En retard",
      className:
        "bg-red-500/15 text-red-300 border-red-500/30",
    };
  }

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  const isSameDay = (first: Date, second: Date) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();

  if (isSameDay(scheduledDate, now)) {
    return {
      label: "Aujourd’hui",
      className:
        "bg-orange-500/15 text-orange-300 border-orange-500/30",
    };
  }

  if (isSameDay(scheduledDate, tomorrow)) {
    return {
      label: "Demain",
      className:
        "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    };
  }

  return {
    label: "À venir",
    className:
      "bg-blue-500/15 text-blue-300 border-blue-500/30",
  };
}

export default function ReceptionTable({
  refreshKey,
  onDeleted,
}: ReceptionTableProps) {
  const [receptions, setReceptions] =
    useState<Reception[]>([]);

  const [loading, setLoading] = useState(true);

  const [loadingId, setLoadingId] =
    useState<number | null>(null);

  const [openedId, setOpenedId] =
    useState<number | null>(null);

  async function loadReceptions() {
    try {
      setLoading(true);

      const response = await fetch("/api/receptions", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          "Impossible de charger les réceptions.",
        );
      }

      const data: Reception[] = await response.json();
      setReceptions(data);
    } catch (error) {
      console.error(error);
      setReceptions([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadReceptions();
  }, [refreshKey]);

  async function handleNextStatus(item: Reception) {
    const nextStatus = getNextStatus(item.status);

    if (nextStatus === item.status) {
      return;
    }

    try {
      setLoadingId(item.id);

      const response = await fetch(
        `/api/receptions/${item.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: nextStatus,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          "Impossible de mettre à jour la réception.",
        );
      }

      await loadReceptions();
      onDeleted();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue.",
      );
    } finally {
      setLoadingId(null);
    }
  }

  async function deleteReception(id: number) {
    const confirmDelete = confirm(
      "Voulez-vous vraiment supprimer cette réception ?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setLoadingId(id);

      const response = await fetch(
        `/api/receptions/${id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error(
          "Impossible de supprimer la réception.",
        );
      }

      await loadReceptions();
      onDeleted();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue.",
      );
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <header className="border-b border-slate-800 p-4 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
          Réceptions
        </p>

        <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">
          Pilotage opérationnel
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-400">
          Suivi des rendez-vous, camions, quais et
          opérations de réception.
        </p>
      </header>

      {loading ? (
        <div className="p-8 text-center text-slate-400">
          Chargement des réceptions...
        </div>
      ) : receptions.length === 0 ? (
        <div className="p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-700 bg-slate-950 text-2xl">
            📥
          </div>

          <p className="mt-4 font-bold text-white">
            Aucune réception enregistrée
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Créez une réception depuis le formulaire ou
            avec le copilote vocal.
          </p>
        </div>
      ) : (
        <>
          {/* EXPÉRIENCE MOBILE */}
          <div className="space-y-4 p-3 md:hidden">
            {receptions.map((item) => {
              const progress = getProgress(item.status);

              const isCompleted =
                item.status ===
                RECEPTION_STATUS.COMPLETED;

              const isLoading =
                loadingId === item.id;

              const isOpened =
                openedId === item.id;

              const scheduledAt = formatScheduledAt(
                item.scheduledAt,
              );

              const planningStatus =
                getPlanningStatus(
                  item.scheduledAt,
                  item.status,
                );

              return (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-950/70 shadow-lg"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                          Réception
                        </p>

                        <h3 className="mt-1 truncate text-lg font-black text-white">
                          {item.number}
                        </h3>

                        <p className="mt-1 truncate text-sm font-semibold text-cyan-300">
                          {item.supplier}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${getStatusColor(
                          item.status,
                        )}`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                        <p className="text-[10px] uppercase tracking-wider text-slate-500">
                          Date prévue
                        </p>
                        <p className="mt-1 font-bold text-white">
                          {scheduledAt.date}
                        </p>
                        <p className="mt-1 text-sm text-cyan-300">
                          {scheduledAt.time || "--"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                        <p className="text-[10px] uppercase tracking-wider text-slate-500">
                          Quai
                        </p>
                        <p className="mt-1 font-bold text-white">
                          {item.dock || "À attribuer"}
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                          {item.pallets} palette(s)
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-wider text-slate-500">
                            Transporteur
                          </p>
                          <p className="mt-1 truncate text-sm font-semibold text-slate-200">
                            {item.carrier ||
                              "Non renseigné"}
                          </p>
                        </div>

                        {planningStatus && (
                          <span
                            className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold ${planningStatus.className}`}
                          >
                            {planningStatus.label}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="text-slate-500">
                          Progression
                        </span>
                        <span className="font-bold text-cyan-300">
                          {progress} %
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-cyan-500 transition-all duration-500"
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenedId(
                            isOpened ? null : item.id,
                          )
                        }
                        className="min-h-12 rounded-xl border border-slate-700 bg-slate-900 px-3 py-3 text-sm font-bold text-white transition active:scale-[0.98]"
                      >
                        {isOpened
                          ? "Masquer le détail"
                          : "Voir le détail"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          void handleNextStatus(item)
                        }
                        disabled={
                          isCompleted || isLoading
                        }
                        className="min-h-12 rounded-xl bg-cyan-500 px-3 py-3 text-sm font-black text-slate-950 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                      >
                        {isLoading
                          ? "Chargement..."
                          : getActionLabel(item.status)}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        void deleteReception(item.id)
                      }
                      disabled={isLoading}
                      className="mt-2 min-h-11 w-full rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-bold text-red-300 transition active:scale-[0.98] disabled:opacity-40"
                    >
                      Supprimer la réception
                    </button>
                  </div>

                  {isOpened && (
                    <div className="border-t border-slate-800 bg-slate-950 p-4">
                      <ReceptionTimeline
                        reception={item}
                      />
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {/* TABLEAU DESKTOP */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[1350px]">
              <thead className="bg-slate-800">
                <tr>
                  {[
                    "Réception",
                    "Fournisseur",
                    "Transporteur",
                    "Date prévue",
                    "Quai",
                    "Palettes",
                    "Statut",
                    "Progression",
                    "Timeline",
                    "Action",
                    "Supprimer",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="p-4 text-left"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {receptions.map((item) => {
                  const progress =
                    getProgress(item.status);

                  const isCompleted =
                    item.status ===
                    RECEPTION_STATUS.COMPLETED;

                  const isLoading =
                    loadingId === item.id;

                  const isOpened =
                    openedId === item.id;

                  const scheduledAt =
                    formatScheduledAt(
                      item.scheduledAt,
                    );

                  const planningStatus =
                    getPlanningStatus(
                      item.scheduledAt,
                      item.status,
                    );

                  return (
                    <Fragment key={item.id}>
                      <tr className="border-t border-slate-800 hover:bg-slate-800/70">
                        <td className="p-4 font-bold text-white">
                          {item.number}
                        </td>

                        <td className="p-4 text-slate-300">
                          {item.supplier}
                        </td>

                        <td className="p-4 text-slate-300">
                          {item.carrier}
                        </td>

                        <td className="p-4">
                          <p className="font-semibold text-white">
                            {scheduledAt.date}
                          </p>
                          <p className="mt-1 text-sm text-cyan-400">
                            {scheduledAt.time}
                          </p>

                          {planningStatus && (
                            <span
                              className={`mt-2 inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${planningStatus.className}`}
                            >
                              {planningStatus.label}
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-slate-300">
                          {item.dock}
                        </td>

                        <td className="p-4 text-slate-300">
                          {item.pallets}
                        </td>

                        <td className="p-4">
                          <span
                            className={`rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
                              item.status,
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="w-32">
                            <div className="mb-1 text-xs text-slate-400">
                              {progress} %
                            </div>

                            <div className="h-2 rounded-full bg-slate-700">
                              <div
                                className="h-2 rounded-full bg-blue-500"
                                style={{
                                  width:
                                    `${progress}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="p-4 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenedId(
                                isOpened
                                  ? null
                                  : item.id,
                              )
                            }
                            className="rounded-lg bg-cyan-600 px-3 py-2 text-sm font-semibold hover:bg-cyan-500"
                          >
                            {isOpened
                              ? "Masquer"
                              : "Voir"}
                          </button>
                        </td>

                        <td className="p-4 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              void handleNextStatus(item)
                            }
                            disabled={
                              isCompleted || isLoading
                            }
                            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-400"
                          >
                            {isLoading
                              ? "Chargement..."
                              : getActionLabel(
                                  item.status,
                                )}
                          </button>
                        </td>

                        <td className="p-4 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              void deleteReception(
                                item.id,
                              )
                            }
                            disabled={isLoading}
                            className="rounded-lg bg-red-600 px-3 py-2 hover:bg-red-500 disabled:bg-slate-700"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>

                      {isOpened && (
                        <tr className="border-t border-slate-800">
                          <td
                            colSpan={11}
                            className="bg-slate-950 p-6"
                          >
                            <ReceptionTimeline
                              reception={item}
                            />
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
