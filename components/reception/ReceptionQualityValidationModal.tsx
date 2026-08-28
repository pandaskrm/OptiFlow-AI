"use client";

import { useState } from "react";

type QualityResult =
  | "CONFORME"
  | "ANOMALIE";

type Props = {
  receptionNumber: string;
  supplier: string;
  onConfirm: (payload: {
    qualityResult: QualityResult;
    qualityValidatedBy: string;
    qualityComment: string;
  }) => Promise<void>;
  onCancel: () => void;
};

export default function ReceptionQualityValidationModal({
  receptionNumber,
  supplier,
  onConfirm,
  onCancel,
}: Props) {
  const [result, setResult] =
    useState<QualityResult | null>(null);

  const [validatedBy, setValidatedBy] =
    useState("");

  const [comment, setComment] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function confirm() {
    const validator =
      validatedBy.trim();

    const qualityComment =
      comment.trim();

    if (!result) {
      setError(
        "Sélectionnez le résultat du contrôle.",
      );
      return;
    }

    if (!validator) {
      setError(
        "Indiquez le nom de la personne qui valide le contrôle.",
      );
      return;
    }

    if (
      result === "ANOMALIE" &&
      !qualityComment
    ) {
      setError(
        "Un commentaire est obligatoire lorsqu'une anomalie est constatée.",
      );
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await onConfirm({
        qualityResult: result,
        qualityValidatedBy: validator,
        qualityComment,
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Impossible de valider le contrôle.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-[#008cff]/60 bg-gradient-to-br from-[#071426] via-[#04111f] to-[#020617] shadow-[0_0_50px_rgba(0,140,255,0.30)]">

        <div className="border-b border-[#008cff]/25 px-5 py-5 sm:px-6">
          <p className="text-xs font-black uppercase tracking-[0.20em] text-[#00e5ff]">
            Validation qualité
          </p>

          <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">
            Terminer le contrôle
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Réception{" "}
            <span className="font-bold text-white">
              {receptionNumber}
            </span>
            {" · "}
            {supplier}
          </p>
        </div>

        <div className="space-y-5 p-5 sm:p-6">

          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.15em] text-slate-400">
              Résultat du contrôle *
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setResult("CONFORME")
                }
                className={[
                  "rounded-xl border p-4 text-left transition",
                  result === "CONFORME"
                    ? "border-emerald-400 bg-emerald-500/15"
                    : "border-slate-700 bg-slate-900/60 hover:border-emerald-500/50",
                ].join(" ")}
              >
                <span className="block text-lg font-black text-emerald-300">
                  ✓ Conforme
                </span>
                <span className="mt-1 block text-xs text-slate-400">
                  Contrôle validé
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setResult("ANOMALIE")
                }
                className={[
                  "rounded-xl border p-4 text-left transition",
                  result === "ANOMALIE"
                    ? "border-amber-400 bg-amber-500/15"
                    : "border-slate-700 bg-slate-900/60 hover:border-amber-500/50",
                ].join(" ")}
              >
                <span className="block text-lg font-black text-amber-300">
                  ⚠ Anomalie
                </span>
                <span className="mt-1 block text-xs text-slate-400">
                  Écart constaté
                </span>
              </button>
            </div>
          </div>

          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.15em] text-slate-400">
              Validé par *
            </span>

            <input
              type="text"
              value={validatedBy}
              onChange={(event) =>
                setValidatedBy(
                  event.target.value,
                )
              }
              placeholder="Ex. Kevin Rodrigues"
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#00e5ff]"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.15em] text-slate-400">
              Commentaire
              {result === "ANOMALIE"
                ? " *"
                : ""}
            </span>

            <textarea
              value={comment}
              onChange={(event) =>
                setComment(
                  event.target.value,
                )
              }
              rows={4}
              placeholder={
                result === "ANOMALIE"
                  ? "Décrivez l'anomalie constatée..."
                  : "Commentaire facultatif..."
              }
              className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-[#00e5ff]"
            />
          </label>

          {error && (
            <div className="rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-[#008cff]/25 p-4 sm:flex-row sm:justify-end sm:px-6">

          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-bold text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={() => void confirm()}
            disabled={saving}
            className="rounded-xl border border-[#00e5ff]/50 bg-gradient-to-r from-[#006bff] to-[#008cff] px-5 py-2.5 text-sm font-black text-white shadow-[0_0_18px_rgba(0,140,255,0.25)] transition hover:shadow-[0_0_25px_rgba(0,229,255,0.30)] disabled:opacity-50"
          >
            {saving
              ? "Validation..."
              : "Valider et terminer"}
          </button>

        </div>
      </div>
    </div>
  );
}
