"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

type Inspector = {
  membershipId: string;
  userId: string;
  firstName: string;
  lastName: string;
  role: string;
};

type Props = {
  receptionNumber: string;
  supplier: string;

  onConfirm: (payload: {
    inspectorUserIds: string[];
    inspectorNames: string[];
  }) => Promise<void>;

  onCancel: () => void;
};

export default function ReceptionInspectorModal({
  receptionNumber,
  supplier,
  onConfirm,
  onCancel,
}: Props) {
  const [inspectors, setInspectors] =
    useState<Inspector[]>([]);

  const [selectedIds, setSelectedIds] =
    useState<string[]>([]);

  const [manualName, setManualName] =
    useState("");

  const [manualNames, setManualNames] =
    useState<string[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const totalSelected =
    selectedIds.length +
    manualNames.length;

  useEffect(() => {
    let active = true;

    async function loadInspectors() {
      try {
        setLoading(true);

        const response = await fetch(
          "/api/receptions/inspectors",
          {
            cache: "no-store",
          },
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              "Impossible de charger les utilisateurs.",
          );
        }

        if (active) {
          setInspectors(
            Array.isArray(data.inspectors)
              ? data.inspectors
              : [],
          );
        }
      } catch (error) {
        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "Une erreur est survenue.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadInspectors();

    return () => {
      active = false;
    };
  }, []);

  function toggleInspector(
    userId: string,
  ) {
    setSelectedIds((current) =>
      current.includes(userId)
        ? current.filter(
            (id) => id !== userId,
          )
        : [...current, userId],
    );
  }

  function addManualName(
    event?: FormEvent,
  ) {
    event?.preventDefault();

    const name =
      manualName
        .trim()
        .replace(/\s+/g, " ");

    if (!name) {
      return;
    }

    const alreadyExists =
      manualNames.some(
        (existing) =>
          existing.toLowerCase() ===
          name.toLowerCase(),
      );

    if (!alreadyExists) {
      setManualNames((current) => [
        ...current,
        name,
      ]);
    }

    setManualName("");
    setError(null);
  }

  function removeManualName(
    name: string,
  ) {
    setManualNames((current) =>
      current.filter(
        (item) => item !== name,
      ),
    );
  }

  async function confirm() {
    if (totalSelected === 0) {
      setError(
        "Ajoutez au moins une personne pour effectuer le contrôle.",
      );
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await onConfirm({
        inspectorUserIds:
          selectedIds,
        inspectorNames:
          manualNames,
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Impossible de démarrer le contrôle.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-[#008cff]/60 bg-gradient-to-br from-[#071426] via-[#04111f] to-[#020617] shadow-[0_0_50px_rgba(0,140,255,0.30)]">

        <div className="border-b border-[#008cff]/25 px-5 py-5 sm:px-6">
          <p className="text-xs font-black uppercase tracking-[0.20em] text-[#00e5ff]">
            Contrôle qualité
          </p>

          <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">
            Qui effectue le contrôle ?
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

        <div className="max-h-[60vh] overflow-y-auto p-5 sm:p-6">

          {inspectors.length > 0 && (
            <>
              <p className="mb-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                Utilisateurs Organ•IA
              </p>

              <div className="grid gap-2 sm:grid-cols-2">
                {inspectors.map(
                  (inspector) => {
                    const selected =
                      selectedIds.includes(
                        inspector.userId,
                      );

                    const displayName =
                      [
                        inspector.firstName,
                        inspector.lastName,
                      ]
                        .filter(Boolean)
                        .join(" ");

                    return (
                      <button
                        key={inspector.userId}
                        type="button"
                        onClick={() =>
                          toggleInspector(
                            inspector.userId,
                          )
                        }
                        className={[
                          "flex items-center gap-3 rounded-xl border p-3 text-left transition",
                          selected
                            ? "border-[#00e5ff] bg-[#006bff]/25"
                            : "border-slate-700 bg-slate-900/60",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "flex h-6 w-6 items-center justify-center rounded-md border text-xs font-black",
                            selected
                              ? "border-[#00e5ff] bg-[#00e5ff] text-slate-950"
                              : "border-slate-600 text-transparent",
                          ].join(" ")}
                        >
                          ✓
                        </span>

                        <span>
                          <span className="block text-sm font-bold text-white">
                            {displayName}
                          </span>

                          <span className="text-[11px] text-slate-500">
                            {inspector.role}
                          </span>
                        </span>
                      </button>
                    );
                  },
                )}
              </div>
            </>
          )}

          <div className="mt-5 border-t border-[#008cff]/20 pt-5">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#00e5ff]">
              Ajouter un magasinier
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Prénom ou prénom + nom
            </p>

            <form
              onSubmit={addManualName}
              className="mt-3 flex gap-2"
            >
              <input
                value={manualName}
                onChange={(event) =>
                  setManualName(
                    event.target.value,
                  )
                }
                placeholder="Ex. Sandrine"
                className="min-w-0 flex-1 rounded-xl border border-[#008cff]/35 bg-[#020617] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#00e5ff]"
              />

              <button
                type="submit"
                disabled={!manualName.trim()}
                className="rounded-xl border border-[#00e5ff]/45 bg-[#006bff]/20 px-4 py-3 text-sm font-black text-[#7df9ff] disabled:opacity-30"
              >
                Ajouter
              </button>
            </form>

            {manualNames.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {manualNames.map(
                  (name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() =>
                        removeManualName(
                          name,
                        )
                      }
                      className="rounded-full border border-[#00e5ff]/40 bg-[#006bff]/15 px-3 py-1.5 text-xs font-bold text-[#7df9ff]"
                    >
                      {name} ×
                    </button>
                  ),
                )}
              </div>
            )}
          </div>

          {totalSelected > 0 && (
            <div className="mt-5 rounded-xl border border-[#00e5ff]/25 bg-[#006bff]/10 px-4 py-3 text-sm text-[#7df9ff]">
              <span className="font-black">
                {totalSelected}
              </span>{" "}
              personne
              {totalSelected > 1
                ? "s"
                : ""}{" "}
              renseignée
              {totalSelected > 1
                ? "s"
                : ""}
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/35 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-[#008cff]/25 p-4 sm:flex-row sm:justify-end sm:px-6">

          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-bold text-slate-300"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={() =>
              void confirm()
            }
            disabled={
              saving ||
              totalSelected === 0
            }
            className="rounded-xl border border-[#00e5ff]/50 bg-gradient-to-r from-[#006bff] to-[#008cff] px-5 py-2.5 text-sm font-black text-white disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-800 disabled:text-slate-500"
          >
            {saving
              ? "Démarrage..."
              : "Démarrer le contrôle"}
          </button>
        </div>
      </div>
    </div>
  );
}
