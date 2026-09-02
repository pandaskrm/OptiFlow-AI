"use client";

import {
  useEffect,
  useState,
} from "react";

type ManagerPresenceDay = {
  id: string;
  workDate: string;
  dayCode: string | null;
  plannedMinutes: number;
  calculatedMinutes: number;
  approvedMinutes: number | null;
  status: string;
  anomaly: boolean;
  anomalyReason: string | null;
  managerValidatedAt: string | null;
  hrValidatedAt: string | null;
  workforce: {
    id: number;
    employeeNumber: string;
    name: string;
    service: string | null;
    team: string | null;
  };
};

type ManagerDaysResponse = {
  success: boolean;
  days: ManagerPresenceDay[];
  error?: string;
};

export default function PresenceManagerValidation() {
  const [days, setDays] =
    useState<ManagerPresenceDay[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [validatingId, setValidatingId] =
    useState<string | null>(null);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [correctedMinutes, setCorrectedMinutes] =
    useState("");

  const [correctionReason, setCorrectionReason] =
    useState("");

  useEffect(() => {
    async function loadDays() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "/api/presence/manager/days?period=week",
        );

        const payload =
          (await response.json()) as ManagerDaysResponse;

        if (!response.ok) {
          throw new Error(
            payload.error ??
              "Impossible de charger les heures.",
          );
        }

        setDays(payload.days ?? []);
      }
      catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Erreur inattendue.",
        );
      }
      finally {
        setLoading(false);
      }
    }

    void loadDays();
  }, []);

  function startCorrection(day: ManagerPresenceDay) {
    const retainedMinutes =
      day.approvedMinutes ?? day.calculatedMinutes;

    setEditingId(day.id);
    setCorrectedMinutes(String(retainedMinutes));
    setCorrectionReason("");
  }

  function cancelCorrection() {
    setEditingId(null);
    setCorrectedMinutes("");
    setCorrectionReason("");
  }

  async function submitCorrection(day: ManagerPresenceDay) {
    const minutes = Number(correctedMinutes);

    if (!Number.isInteger(minutes) || minutes < 0) {
      setError("Le temps corrige doit etre un nombre de minutes valide.");
      return;
    }

    if (!correctionReason.trim()) {
      setError("Le motif de la correction est obligatoire.");
      return;
    }

    setValidatingId(day.id);
    setError(null);

    try {
      const response = await fetch(
        "/api/presence/manager/validate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            presenceDayId: day.id,
            approvedMinutes: minutes,
            reason: correctionReason.trim(),
          }),
        },
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error ??
            "Impossible d'enregistrer la correction.",
        );
      }

      setDays((current) =>
        current.map((item) =>
          item.id === day.id
            ? {
                ...item,
                approvedMinutes:
                  payload.presenceDay.approvedMinutes,
                status: payload.presenceDay.status,
                managerValidatedAt:
                  payload.presenceDay.managerValidatedAt,
              }
            : item,
        ),
      );

      cancelCorrection();
    }
    catch (correctionError) {
      setError(
        correctionError instanceof Error
          ? correctionError.message
          : "Erreur inattendue.",
      );
    }
    finally {
      setValidatingId(null);
    }
  }

  async function validateDay(day: ManagerPresenceDay) {
    setValidatingId(day.id);
    setError(null);

    try {
      const response = await fetch(
        "/api/presence/manager/validate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            presenceDayId: day.id,
          }),
        },
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error ??
            "Impossible de valider cette journee.",
        );
      }

      setDays((current) =>
        current.map((item) =>
          item.id === day.id
            ? {
                ...item,
                approvedMinutes:
                  payload.presenceDay.approvedMinutes,
                status:
                  payload.presenceDay.status,
                managerValidatedAt:
                  payload.presenceDay.managerValidatedAt,
              }
            : item,
        ),
      );
    }
    catch (validationError) {
      setError(
        validationError instanceof Error
          ? validationError.message
          : "Erreur inattendue.",
      );
    }
    finally {
      setValidatingId(null);
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 text-sm text-slate-400">
        Chargement des heures de presence...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-900/50 bg-red-950/20 p-6 text-sm text-red-300">
        {error}
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
      <h3 className="text-lg font-bold text-white">
        Validation des heures
      </h3>

      <p className="mt-1 text-sm text-slate-400">
        {days.length} journee(s) a controler cette semaine.
      </p>

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-3">Salarie</th>
              <th className="px-3 py-3">Date</th>
              <th className="px-3 py-3">Prevu</th>
              <th className="px-3 py-3">Calcule</th>
              <th className="px-3 py-3">Retenu</th>
              <th className="px-3 py-3">Anomalie</th>
              <th className="px-3 py-3">Statut</th>
              <th className="px-3 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {days.map((day) => (
              <>
              <tr
                key={day.id}
                className="border-b border-slate-900 text-slate-300"
              >
                <td className="px-3 py-3 font-semibold text-white">
                  {day.workforce.name}
                </td>

                <td className="px-3 py-3">
                  {new Date(day.workDate).toLocaleDateString("fr-FR")}
                </td>

                <td className="px-3 py-3">
                  {Math.floor(day.plannedMinutes / 60)}h
                  {String(day.plannedMinutes % 60).padStart(2, "0")}
                </td>

                <td className="px-3 py-3">
                  {Math.floor(day.calculatedMinutes / 60)}h
                  {String(day.calculatedMinutes % 60).padStart(2, "0")}
                </td>

                <td className="px-3 py-3">
                  {Math.floor(
                    (day.approvedMinutes ?? day.calculatedMinutes) / 60,
                  )}h
                  {String(
                    (day.approvedMinutes ?? day.calculatedMinutes) % 60,
                  ).padStart(2, "0")}
                </td>

                <td className="px-3 py-3">
                  {day.anomaly ? "Oui" : "Non"}
                </td>

                <td className="px-3 py-3">
                  {day.hrValidatedAt
                    ? "RH valide"
                    : day.managerValidatedAt
                      ? "Manager valide"
                      : "A valider"}
                </td>

                <td className="px-3 py-3">
                  {!day.managerValidatedAt && !day.hrValidatedAt ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={validatingId === day.id}
                        onClick={() => void validateDay(day)}
                        className="rounded-lg bg-cyan-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-cyan-700 disabled:cursor-wait disabled:opacity-50"
                      >
                        {validatingId === day.id
                          ? "Validation..."
                          : "Valider"}
                      </button>

                      <button
                        type="button"
                        disabled={validatingId === day.id}
                        onClick={() => startCorrection(day)}
                        className="rounded-lg border border-slate-700 px-3 py-2 text-xs font-bold text-slate-200 transition hover:border-cyan-500 hover:text-white disabled:opacity-50"
                      >
                        Corriger
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">
                      Termine
                    </span>
                  )}
                </td>
              </tr>

              {editingId === day.id && (
                <tr key={`${day.id}-correction`}>
                  <td colSpan={8} className="bg-slate-900/60 px-4 py-4">
                    <div className="grid gap-3 md:grid-cols-[180px_1fr_auto_auto]">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={correctedMinutes}
                        onChange={(event) =>
                          setCorrectedMinutes(event.target.value)
                        }
                        placeholder="Minutes retenues"
                        className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                      />

                      <input
                        type="text"
                        value={correctionReason}
                        onChange={(event) =>
                          setCorrectionReason(event.target.value)
                        }
                        placeholder="Motif de la correction"
                        className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-cyan-500"
                      />

                      <button
                        type="button"
                        disabled={validatingId === day.id}
                        onClick={() => void submitCorrection(day)}
                        className="rounded-lg bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-700 disabled:opacity-50"
                      >
                        Enregistrer
                      </button>

                      <button
                        type="button"
                        disabled={validatingId === day.id}
                        onClick={cancelCorrection}
                        className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-bold text-slate-200 hover:border-slate-500"
                      >
                        Annuler
                      </button>
                    </div>
                  </td>
                </tr>
              )}
              </>
            ))}

            {days.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-3 py-8 text-center text-slate-500"
                >
                  Aucune journee de presence pour cette semaine.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}











