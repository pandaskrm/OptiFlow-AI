"use client";

import {
  ChangeEvent,
  useRef,
  useState,
} from "react";

type ReceptionDeliveryNoteModalProps = {
  receptionId: number;
  receptionNumber: string;
  supplier: string;
  onCompleted: () => Promise<void> | void;
  onCancel: () => void;
};

export default function ReceptionDeliveryNoteModal({
  receptionId,
  receptionNumber,
  supplier,
  onCompleted,
  onCancel,
}: ReceptionDeliveryNoteModalProps) {
  const cameraInputRef =
    useRef<HTMLInputElement | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function uploadDocument(file: File) {
    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        `/api/receptions/${receptionId}/documents`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        const payload = await response
          .json()
          .catch(() => null);

        throw new Error(
          payload?.error ||
            "Impossible d'enregistrer le bon de livraison.",
        );
      }

      await onCompleted();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Une erreur est survenue.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    await uploadDocument(file);
  }

  async function continueWithoutDocument() {
    try {
      setUploading(true);
      setError(null);

      await onCompleted();
    } catch (continueError) {
      setError(
        continueError instanceof Error
          ? continueError.message
          : "Impossible de continuer.",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/75 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delivery-note-title"
    >
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#008cff]/55 bg-gradient-to-br from-[#071426] via-[#04111f] to-[#020617] shadow-[0_0_45px_rgba(0,140,255,0.25)]">
        <div className="border-b border-[#008cff]/25 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#00e5ff]">
                Camion à quai
              </p>

              <h2
                id="delivery-note-title"
                className="mt-2 text-2xl font-black text-white"
              >
                Bon de livraison
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Ajoutez le BL maintenant pour le conserver
                avec cette réception.
              </p>
            </div>

            <button
              type="button"
              onClick={onCancel}
              disabled={uploading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-xl text-slate-400 transition hover:text-white disabled:opacity-40"
              aria-label="Fermer"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="rounded-2xl border border-[#008cff]/25 bg-[#071426]/80 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Réception
            </p>

            <p className="mt-1 text-lg font-black text-white">
              {receptionNumber}
            </p>

            <p className="mt-1 text-sm font-semibold text-[#7df9ff]">
              {supplier}
            </p>
          </div>

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(event) =>
              void handleFileChange(event)
            }
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            className="hidden"
            onChange={(event) =>
              void handleFileChange(event)
            }
          />

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={uploading}
              onClick={() =>
                cameraInputRef.current?.click()
              }
              className="min-h-24 rounded-2xl border border-[#00e5ff]/55 bg-gradient-to-br from-[#006bff]/45 to-[#008cff]/20 p-4 text-left transition hover:border-[#00e5ff] hover:shadow-[0_0_24px_rgba(0,229,255,0.18)] active:scale-[0.99] disabled:opacity-50"
            >
              <span className="text-2xl">
                📷
              </span>

              <span className="mt-2 block font-black text-white">
                Photographier le BL
              </span>

              <span className="mt-1 block text-xs text-slate-400">
                Idéal sur téléphone
              </span>
            </button>

            <button
              type="button"
              disabled={uploading}
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="min-h-24 rounded-2xl border border-[#008cff]/40 bg-[#071426] p-4 text-left transition hover:border-[#00e5ff]/70 hover:bg-[#09203a] active:scale-[0.99] disabled:opacity-50"
            >
              <span className="text-2xl">
                📎
              </span>

              <span className="mt-2 block font-black text-white">
                Ajouter un fichier
              </span>

              <span className="mt-1 block text-xs text-slate-400">
                Photo, image ou PDF
              </span>
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm font-semibold text-red-300">
              {error}
            </div>
          )}

          <div className="mt-5 border-t border-slate-800 pt-5">
            <button
              type="button"
              disabled={uploading}
              onClick={() =>
                void continueWithoutDocument()
              }
              className="min-h-12 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm font-bold text-slate-300 transition hover:border-slate-600 hover:text-white disabled:opacity-50"
            >
              {uploading
                ? "Enregistrement..."
                : "Continuer sans BL"}
            </button>

            <p className="mt-3 text-center text-xs leading-5 text-slate-500">
              Le BL reste facultatif et pourra être ajouté
              ultérieurement à la réception.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
