"use client";

import { Fragment, useEffect, useState } from "react";
import useWarehouseSummary from "../../hooks/useWarehouseSummary";

import {
  getNextStatus,
  getStatusColor,
  RECEPTION_STATUS,
  STATUS_ORDER,
} from "../../constants/receptionStatus";
import { Reception } from "../../types/reception";

import ReceptionDeliveryNoteModal from "./ReceptionDeliveryNoteModal";
import ReceptionInspectorModal from "./ReceptionInspectorModal";
import ReceptionQualityValidationModal from "./ReceptionQualityValidationModal";

type ReceptionDocument = {
  id: string;
  type: string;
  name: string;
  contentType: string;
  size: number;
  capturedAt: string;
  createdAt: string;
};

function canDeleteCompletedReception(
  role?: string | null,
) {
  return (
    role === "OWNER" ||
    role === "ADMIN" ||
    role === "LOGISTICS_MANAGER"
  );
}

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

function formatCountdownDifference(
  milliseconds: number,
) {
  const totalSeconds = Math.max(
    0,
    Math.floor(Math.abs(milliseconds) / 1000),
  );

  const hours = Math.floor(totalSeconds / 3600);

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60,
  );

  const seconds = totalSeconds % 60;

  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":");
}

function getTruckCountdown(
  scheduledAt?: string | null,
  arrivedAt?: string | null,
  status?: string,
  nowTimestamp?: number,
) {
  if (!scheduledAt) {
    return null;
  }

  if (
    status === RECEPTION_STATUS.COMPLETED &&
    !arrivedAt
  ) {
    return null;
  }

  const scheduledDate = new Date(scheduledAt);

  if (Number.isNaN(scheduledDate.getTime())) {
    return null;
  }

  const referenceTimestamp =
    typeof nowTimestamp === "number"
      ? nowTimestamp
      : Date.now();

  if (arrivedAt) {
    const arrivalDate = new Date(arrivedAt);

    if (!Number.isNaN(arrivalDate.getTime())) {
      const difference =
        arrivalDate.getTime() -
        scheduledDate.getTime();

      if (Math.abs(difference) < 60000) {
        return {
          label: "Arrivé à l'heure",
          detail: "< 1 min d'écart",
          className:
            "border-emerald-500/35 bg-emerald-500/10 text-emerald-300",
        };
      }

      const minutes = Math.round(
        Math.abs(difference) / 60000,
      );

      if (difference > 0) {
        return {
          label: `Arrivé ${minutes} min en retard`,
          detail: "Arrivée enregistrée",
          className:
            "border-red-500/35 bg-red-500/10 text-red-300",
        };
      }

      return {
        label: `Arrivé ${minutes} min en avance`,
        detail: "Arrivée enregistrée",
        className:
          "border-emerald-500/35 bg-emerald-500/10 text-emerald-300",
      };
    }
  }

  const difference =
    scheduledDate.getTime() - referenceTimestamp;

  if (difference > 0) {
    return {
      label: `Arrivée dans ${formatCountdownDifference(
        difference,
      )}`,
      detail: "Compte à rebours",
      className:
        "border-[#00e5ff]/35 bg-[#006bff]/10 text-[#7df9ff]",
    };
  }

  return {
    label: `RETARD +${formatCountdownDifference(
      difference,
    )}`,
    detail: "Camion non arrivé",
    className:
      "border-red-500/45 bg-red-500/10 text-red-300",
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
        "bg-cyan-500/15 text-[#7df9ff] border-cyan-500/30",
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
  const {
    data: warehouse,
    loading,
    refresh,
  } = useWarehouseSummary();

  const receptions: Reception[] =
    warehouse.receptionDetails;

  const [nowTimestamp, setNowTimestamp] =
    useState(() => Date.now());

  const [loadingId, setLoadingId] =
    useState<number | null>(null);

  const [currentRole, setCurrentRole] =
    useState<string | null>(null);

  const [documentsByReception, setDocumentsByReception] =
    useState<Record<number, ReceptionDocument[]>>({});

  const [documentsLoadingId, setDocumentsLoadingId] =
    useState<number | null>(null);

  const [uploadingDocumentId, setUploadingDocumentId] =
    useState<number | null>(null);

  const [pendingDockReception, setPendingDockReception] =
    useState<Reception | null>(null);

  const [
    pendingInspectorReception,
    setPendingInspectorReception,
  ] = useState<Reception | null>(null);

  const [
    pendingQualityReception,
    setPendingQualityReception,
  ] = useState<Reception | null>(null);

  useEffect(() => {
    void refresh();
  }, [refreshKey, refresh]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowTimestamp(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadCurrentRole() {
      try {
        const response = await fetch("/api/auth/session", {
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as {
          role?: string;
        };

        if (!cancelled) {
          setCurrentRole(data.role ?? null);
        }
      } catch {
        // La sécurité réelle reste assurée côté API DELETE.
      }
    }

    void loadCurrentRole();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    receptions.forEach((reception) => {
      if (
        documentsByReception[reception.id] === undefined
      ) {
        void loadDocuments(reception.id);
      }
    });
  }, [receptions]);

  async function updateReceptionStatus(
    item: Reception,
    nextStatus: string,
    inspectorUserIds?: string[],
    inspectorNames?: string[],
    qualityValidation?: {
      qualityResult: "CONFORME" | "ANOMALIE";
      qualityValidatedBy: string;
      qualityComment: string;
    },
  ) {
    setLoadingId(item.id);

    try {
      const response = await fetch(
        `/api/receptions/${item.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: nextStatus,
            ...(inspectorUserIds
              ? { inspectorUserIds }
              : {}),
            ...(inspectorNames
              ? { inspectorNames }
              : {}),
            ...(qualityValidation
              ? qualityValidation
              : {}),
          }),
        },
      );

      if (!response.ok) {
        const payload = await response
          .json()
          .catch(() => null);

        throw new Error(
          payload?.error ||
            "Impossible de mettre à jour la réception.",
        );
      }

      await refresh();
      onDeleted();
    } finally {
      setLoadingId(null);
    }
  }

  async function loadDocuments(receptionId: number) {
    try {
      setDocumentsLoadingId(receptionId);

      const response = await fetch(
        `/api/receptions/${receptionId}/documents`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(
          "Impossible de charger le bon de livraison.",
        );
      }

      const data = await response.json();

      setDocumentsByReception((current) => ({
        ...current,
        [receptionId]: Array.isArray(data.documents)
          ? data.documents
          : [],
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setDocumentsLoadingId(null);
    }
  }

  async function uploadDocument(
    receptionId: number,
    file: File,
  ) {
    try {
      setUploadingDocumentId(receptionId);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `/api/receptions/${receptionId}/documents`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Impossible d'enregistrer le bon de livraison.",
        );
      }

      await loadDocuments(receptionId);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Impossible d'enregistrer le bon de livraison.",
      );
    } finally {
      setUploadingDocumentId(null);
    }
  }

  function formatDocumentDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }
  async function handleNextStatus(item: Reception) {
    const nextStatus = getNextStatus(item.status);

    if (nextStatus === item.status) {
      return;
    }

    if (nextStatus === RECEPTION_STATUS.AT_DOCK) {
      setPendingDockReception(item);
      return;
    }

    if (
      nextStatus ===
      RECEPTION_STATUS.INSPECTION
    ) {
      setPendingInspectorReception(item);
      return;
    }

    if (
      nextStatus ===
      RECEPTION_STATUS.COMPLETED
    ) {
      setPendingQualityReception(item);
      return;
    }

    try {
      await updateReceptionStatus(
        item,
        nextStatus,
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue.",
      );
    }
  }

  async function confirmInspection(
    payload: {
      inspectorUserIds: string[];
      inspectorNames: string[];
    },
  ) {
    if (!pendingInspectorReception) {
      return;
    }

    await updateReceptionStatus(
      pendingInspectorReception,
      RECEPTION_STATUS.INSPECTION,
      payload.inspectorUserIds,
      payload.inspectorNames,
    );

    setPendingInspectorReception(null);
  }

  async function confirmQualityValidation(
    payload: {
      qualityResult: "CONFORME" | "ANOMALIE";
      qualityValidatedBy: string;
      qualityComment: string;
    },
  ) {
    if (!pendingQualityReception) {
      return;
    }

    await updateReceptionStatus(
      pendingQualityReception,
      RECEPTION_STATUS.COMPLETED,
      undefined,
      undefined,
      payload,
    );

    setPendingQualityReception(null);
  }

  async function confirmDockArrival() {
    if (!pendingDockReception) {
      return;
    }

    await updateReceptionStatus(
      pendingDockReception,
      RECEPTION_STATUS.AT_DOCK,
    );

    setPendingDockReception(null);
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

      await refresh();
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
    <section className="organia-electric-panel organia-electric-panel-v2 overflow-hidden rounded-2xl border border-[#008cff]/55 bg-gradient-to-br from-[#071426] via-[#04111f] to-[#020617] shadow-[0_0_22px_rgba(0,140,255,0.15)]">
      {pendingInspectorReception && (
        <ReceptionInspectorModal
          receptionNumber={
            pendingInspectorReception.number
          }
          supplier={
            pendingInspectorReception.supplier
          }
          onConfirm={confirmInspection}
          onCancel={() =>
            setPendingInspectorReception(null)
          }
        />
      )}

      {pendingQualityReception && (
        <ReceptionQualityValidationModal
          receptionNumber={
            pendingQualityReception.number
          }
          supplier={
            pendingQualityReception.supplier
          }
          onConfirm={
            confirmQualityValidation
          }
          onCancel={() =>
            setPendingQualityReception(null)
          }
        />
      )}

      {pendingDockReception && (
        <ReceptionDeliveryNoteModal
          receptionId={pendingDockReception.id}
          receptionNumber={pendingDockReception.number}
          supplier={pendingDockReception.supplier}
          onCompleted={confirmDockArrival}
          onCancel={() =>
            setPendingDockReception(null)
          }
        />
      )}

      <header className="border-b border-[#008cff]/25 p-4 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#00e5ff] drop-shadow-[0_0_7px_rgba(0,229,255,0.45)]">
          Réceptions
        </p>

        <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">
          Pilotage opérationnel
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          Suivi des rendez-vous, camions, quais et
          opérations de réception.
        </p>
      </header>

      {loading ? (
        <div className="p-8 text-center text-slate-500">
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

          <p className="mt-2 text-sm text-slate-500">
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
              const scheduledAt = formatScheduledAt(
                item.scheduledAt,
              );

              const planningStatus =
                getPlanningStatus(
                  item.scheduledAt,
                  item.status,
                );

              const truckCountdown =
                getTruckCountdown(
                  item.scheduledAt,
                  item.arrivedAt,
                  item.status,
                  nowTimestamp,
                );

              return (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-[#008cff]/40 bg-gradient-to-br from-[#071426] to-[#020617] shadow-lg"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
                          Réception
                        </p>

                        <h3 className="mt-1 truncate text-lg font-black text-white">
                          {item.number}
                        </h3>

                        <p className="mt-1 truncate text-sm font-semibold text-[#7df9ff]">
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
                      <div className="rounded-xl border border-[#008cff]/30 bg-[#071426]/85 p-3">
                        <p className="text-[10px] uppercase tracking-wider text-slate-600">
                          Date prévue
                        </p>
                        <p className="mt-1 font-bold text-white">
                          {scheduledAt.date}
                        </p>
                        <p className="mt-1 text-sm text-[#7df9ff]">
                          {scheduledAt.time || "--"}
                        </p>
                      </div>

                      <div className="rounded-xl border border-[#008cff]/30 bg-[#071426]/85 p-3">
                        <p className="text-[10px] uppercase tracking-wider text-slate-600">
                          Quai
                        </p>
                        <p className="mt-1 font-bold text-white">
                          {item.dock || "À attribuer"}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {item.pallets} palette(s)
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 rounded-xl border border-[#008cff]/30 bg-[#071426]/85 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-wider text-slate-600">
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
                        <span className="text-slate-600">
                          Progression
                        </span>
                        <span className="font-bold text-[#7df9ff]">
                          {progress} %
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#006bff] via-[#008cff] to-[#00e5ff] shadow-[0_0_12px_rgba(0,229,255,0.55)] transition-all duration-500"
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="min-h-12">
  {(() => {
    const documents =
      documentsByReception[item.id] ?? [];

    const document = documents[0];

    if (documentsLoadingId === item.id) {
      return (
        <div className="flex min-h-12 items-center justify-center rounded-xl border border-[#008cff]/30 bg-[#071426] px-3 text-sm text-slate-500">
          Chargement du BL...
        </div>
      );
    }

    if (document) {
      return (
        <a
          href={`/api/receptions/${item.id}/documents/${document.id}`}
          target="_blank"
          rel="noreferrer"
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-3 py-3 text-center text-sm font-bold text-emerald-300 transition active:scale-[0.98]"
        >
          <span>📄</span>
          <span>Voir le BL</span>
        </a>
      );
    }

    return (
      <label className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#008cff]/40 bg-[#071426] px-3 py-3 text-center text-sm font-bold text-[#7df9ff] transition active:scale-[0.98]">
        <span>📷</span>

        <span>
          {uploadingDocumentId === item.id
            ? "Enregistrement..."
            : "Ajouter un BL"}
        </span>

        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          disabled={uploadingDocumentId === item.id}
          onChange={(event) => {
            const file =
              event.target.files?.[0];

            if (file) {
              void uploadDocument(
                item.id,
                file,
              );
            }

            event.target.value = "";
          }}
        />
      </label>
    );
  })()}
</div>

                      <button
                        type="button"
                        onClick={() =>
                          void handleNextStatus(item)
                        }
                        disabled={
                          isCompleted || isLoading
                        }
                        className="min-h-12 rounded-xl border border-[#00e5ff]/55 bg-gradient-to-r from-[#006bff] to-[#008cff] px-3 py-3 text-sm font-black text-white shadow-[0_0_14px_rgba(0,140,255,0.25)] transition active:scale-[0.98] disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-800 disabled:text-slate-500"
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
                      disabled={
                        isLoading ||
                        (isCompleted &&
                          !canDeleteCompletedReception(
                            currentRole,
                          ))
                      }
                      className="mt-2 min-h-11 w-full rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-bold text-red-300 transition active:scale-[0.98] disabled:opacity-40"
                    >
                      {isCompleted &&
                      !canDeleteCompletedReception(
                        currentRole,
                      )
                        ? "Réception verrouillée"
                        : "Supprimer la réception"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* TABLEAU DESKTOP */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[1350px]">
              <thead className="bg-[#006bff]/12 text-[#8befff]">
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
                    "Bon de livraison",
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
                  const scheduledAt =
                    formatScheduledAt(
                      item.scheduledAt,
                    );

                  const planningStatus =
                    getPlanningStatus(
                      item.scheduledAt,
                      item.status,
                    );

                  const truckCountdown =
                    getTruckCountdown(
                      item.scheduledAt,
                      item.arrivedAt,
                      item.status,
                      nowTimestamp,
                    );

                  return (
                    <Fragment key={item.id}>
                      <tr className="border-t border-[#008cff]/20 hover:bg-slate-800/70">
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
                          <p className="mt-1 text-sm text-[#00e5ff] drop-shadow-[0_0_7px_rgba(0,229,255,0.45)]">
                            {scheduledAt.time}
                          </p>

                          {truckCountdown && (
                            <div
                              className={`mt-2 rounded-lg border px-2.5 py-2 ${truckCountdown.className}`}
                            >
                              <p className="text-xs font-black tabular-nums">
                                {truckCountdown.label}
                              </p>

                              <p className="mt-0.5 text-[9px] uppercase tracking-[0.12em] opacity-60">
                                {truckCountdown.detail}
                              </p>
                            </div>
                          )}

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
                            <div className="mb-1 text-xs font-medium text-slate-600">
                              {progress} %
                            </div>

                            <div className="h-2 overflow-hidden rounded-full border border-[#008cff]/20 bg-[#020617]">
                              <div
                                className="h-2 rounded-full bg-gradient-to-r from-[#006bff] to-[#00e5ff] shadow-[0_0_10px_rgba(0,229,255,0.45)]"
                                style={{
                                  width:
                                    `${progress}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="p-4 text-center">
  {(() => {
    const documents =
      documentsByReception[item.id] ?? [];

    const document = documents[0];

    if (documentsLoadingId === item.id) {
      return (
        <span className="text-xs text-slate-500">
          Chargement...
        </span>
      );
    }

    if (document) {
      return (
        <div className="flex flex-col items-center gap-2">
          <a
            href={`/api/receptions/${item.id}/documents/${document.id}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-3 py-2 text-sm font-bold text-emerald-300 transition hover:bg-emerald-500/20"
          >
            📄 Voir le BL
          </a>

          <span className="text-[10px] text-slate-500">
            {formatDocumentDate(
              document.capturedAt,
            )}
          </span>
        </div>
      );
    }

    return (
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#00e5ff]/45 bg-[#006bff]/20 px-3 py-2 text-sm font-bold text-[#7df9ff] transition hover:bg-[#008cff]/30">
        📷 Ajouter BL

        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploadingDocumentId === item.id}
          onChange={(event) => {
            const file =
              event.target.files?.[0];

            if (file) {
              void uploadDocument(
                item.id,
                file,
              );
            }

            event.target.value = "";
          }}
        />
      </label>
    );
  })()}
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
                            className="rounded-lg border border-[#008cff]/55 bg-gradient-to-r from-[#006bff] to-[#008cff] px-3 py-2 text-sm font-bold text-white shadow-[0_0_12px_rgba(0,140,255,0.22)] transition hover:shadow-[0_0_20px_rgba(0,229,255,0.30)] disabled:border-slate-700 disabled:bg-slate-800 disabled:text-slate-500"
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
                            disabled={
                        isLoading ||
                        (isCompleted &&
                          !canDeleteCompletedReception(
                            currentRole,
                          ))
                      }
                            className="rounded-lg bg-red-600 px-3 py-2 hover:bg-red-500 disabled:bg-slate-700"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
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
