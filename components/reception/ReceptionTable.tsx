"use client";

import { Fragment, useEffect, useState } from "react";
import ReceptionTimeline from "../timeline/ReceptionTimeline";
import { Reception } from "../../types/reception";
import {
  getNextStatus,
  getStatusColor,
  RECEPTION_STATUS,
  STATUS_ORDER,
} from "../../constants/receptionStatus";

type ReceptionTableProps = {
  refreshKey: number;
  onDeleted: () => void;
};

function getActionLabel(status: string) {
  if (status === RECEPTION_STATUS.PLANNED) {
    return "▶️ Démarrer";
  }

  if (status === RECEPTION_STATUS.AT_DOCK) {
    return "📦 Déchargement";
  }

  if (status === RECEPTION_STATUS.UNLOADING) {
    return "🔎 Contrôle";
  }

  if (status === RECEPTION_STATUS.INSPECTION) {
    return "✅ Terminer";
  }

  return "✅ Terminée";
}

function getProgress(status: string) {
  const index = STATUS_ORDER.indexOf(status as never);

  if (index === -1) {
    return 0;
  }

  return Math.round(
    ((index + 1) / STATUS_ORDER.length) * 100
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
  status?: string
) {
  if (!scheduledAt) {
    return null;
  }

  if (status === RECEPTION_STATUS.COMPLETED) {
    return {
      label: "Terminée",
      className:
        "bg-emerald-500/20 text-emerald-400",
    };
  }

  const scheduledDate = new Date(scheduledAt);

  if (Number.isNaN(scheduledDate.getTime())) {
    return null;
  }

  const now = new Date();
  const difference = scheduledDate.getTime() - now.getTime();

  if (difference < 0) {
    return {
      label: "En retard",
      className: "bg-red-500/20 text-red-400",
    };
  }

  const today = new Date();
  const tomorrow = new Date();

  tomorrow.setDate(today.getDate() + 1);

  const isSameDay = (first: Date, second: Date) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();

  if (isSameDay(scheduledDate, today)) {
    return {
      label: "Aujourd’hui",
      className:
        "bg-orange-500/20 text-orange-400",
    };
  }

  if (isSameDay(scheduledDate, tomorrow)) {
    return {
      label: "Demain",
      className: "bg-cyan-500/20 text-cyan-400",
    };
  }

  return {
    label: "À venir",
    className: "bg-blue-500/20 text-blue-400",
  };
}

export default function ReceptionTable({
  refreshKey,
  onDeleted,
}: ReceptionTableProps) {
  const [receptions, setReceptions] = useState<Reception[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<number | null>(
    null
  );
  const [openedId, setOpenedId] = useState<number | null>(
    null
  );

  async function loadReceptions() {
    try {
      setLoading(true);

      const response = await fetch("/api/receptions", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(
          "Impossible de charger les réceptions."
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
    loadReceptions();
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
        }
      );

      if (!response.ok) {
        throw new Error(
          "Impossible de mettre à jour la réception."
        );
      }

      await loadReceptions();
      onDeleted();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue."
      );
    } finally {
      setLoadingId(null);
    }
  }

  async function deleteReception(id: number) {
    const confirmDelete = confirm(
      "Voulez-vous vraiment supprimer cette réception ?"
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
        }
      );

      if (!response.ok) {
        throw new Error(
          "Impossible de supprimer la réception."
        );
      }

      await loadReceptions();
      onDeleted();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue."
      );
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 p-6">
        <h2 className="text-2xl font-bold text-white">
          📋 Pilotage des réceptions
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Suivi opérationnel des camions, rendez-vous,
          statuts et quais.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1350px] w-full">
          <thead className="bg-slate-800">
            <tr>
              <th className="p-4 text-left">
                Réception
              </th>

              <th className="p-4 text-left">
                Fournisseur
              </th>

              <th className="p-4 text-left">
                Transporteur
              </th>

              <th className="p-4 text-left">
                Date prévue
              </th>

              <th className="p-4 text-left">
                Quai
              </th>

              <th className="p-4 text-left">
                Palettes
              </th>

              <th className="p-4 text-left">
                Statut
              </th>

              <th className="p-4 text-left">
                Progression
              </th>

              <th className="p-4 text-center">
                Timeline
              </th>

              <th className="p-4 text-center">
                Action
              </th>

              <th className="p-4 text-center">
                Supprimer
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={11}
                  className="p-8 text-center text-slate-400"
                >
                  Chargement des réceptions...
                </td>
              </tr>
            ) : receptions.length === 0 ? (
              <tr>
                <td
                  colSpan={11}
                  className="p-8 text-center text-slate-400"
                >
                  Aucune réception enregistrée.
                </td>
              </tr>
            ) : (
              receptions.map((item) => {
                const progress = getProgress(item.status);

                const isCompleted =
                  item.status ===
                  RECEPTION_STATUS.COMPLETED;

                const isLoading =
                  loadingId === item.id;

                const isOpened =
                  openedId === item.id;

                const scheduledAt = formatScheduledAt(
                  item.scheduledAt
                );

                const planningStatus =
                  getPlanningStatus(
                    item.scheduledAt,
                    item.status
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
                        <div className="min-w-[135px]">
                          <p className="font-semibold text-white">
                            {scheduledAt.date}
                          </p>

                          {scheduledAt.time && (
                            <p className="mt-1 text-sm text-cyan-400">
                              🕒 {scheduledAt.time}
                            </p>
                          )}

                          {planningStatus && (
                            <span
                              className={`mt-2 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${planningStatus.className}`}
                            >
                              {planningStatus.label}
                            </span>
                          )}
                        </div>
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
                            item.status
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
                              className="h-2 rounded-full bg-blue-500 transition-all"
                              style={{
                                width: `${progress}%`,
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
                              isOpened ? null : item.id
                            )
                          }
                          className="rounded-lg bg-cyan-600 px-3 py-2 text-sm font-semibold transition hover:bg-cyan-700"
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
                            handleNextStatus(item)
                          }
                          disabled={
                            isCompleted || isLoading
                          }
                          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                        >
                          {isLoading
                            ? "Chargement..."
                            : getActionLabel(
                                item.status
                              )}
                        </button>
                      </td>

                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            deleteReception(item.id)
                          }
                          disabled={isLoading}
                          className="rounded-lg bg-red-600 px-3 py-2 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-700"
                        >
                          🗑️
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
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}