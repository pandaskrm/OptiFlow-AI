"use client";

import {
  useEffect,
  useState,
} from "react";

type HrPresenceDay = {
  id: string;
  workDate: string;
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

type HrDaysResponse = {
  success: boolean;
  days: HrPresenceDay[];
  error?: string;
};

export default function PresenceHrValidation() {
  const [currentRole, setCurrentRole] =
    useState<string | null>(null);

  const [days, setDays] =
    useState<HrPresenceDay[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [validatingId, setValidatingId] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCurrentRole() {
      try {
        const response = await fetch("/api/auth/session", {
          cache: "no-store",
        });

        if (!response.ok) {
          if (!cancelled) setLoading(false);
          return;
        }

        const data = (await response.json()) as {
          role?: string;
        };

        if (!cancelled) {
          setCurrentRole(data.role ?? null);
        }
      } catch {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadCurrentRole();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!currentRole) return;

    const hrRoles = [
      "ADMIN",
      "HR",
    ];

    if (!hrRoles.includes(currentRole)) {
      setLoading(false);
      return;
    }

    async function loadDays() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "/api/presence/hr/days?period=week",
          {
            cache: "no-store",
          },
        );

        const payload =
          (await response.json()) as HrDaysResponse;

        if (!response.ok) {
          throw new Error(
            payload.error ??
              "Impossible de charger les validations RH.",
          );
        }

        setDays(payload.days ?? []);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Erreur inattendue.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadDays();
  }, [currentRole]);

  async function validateDay(day: HrPresenceDay) {
    setValidatingId(day.id);
    setError(null);

    try {
      const response = await fetch(
        "/api/presence/hr/validate",
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

      const payload = (await response.json()) as {
        success?: boolean;
        presenceDay?: HrPresenceDay;
        error?: string;
      };

      if (!response.ok || !payload.presenceDay) {
        throw new Error(
          payload.error ??
            "La validation RH a echoue.",
        );
      }

      setDays((currentDays) =>
        currentDays.map((currentDay) =>
          currentDay.id === day.id
            ? {
                ...currentDay,
                approvedMinutes:
                  payload.presenceDay?.approvedMinutes ??
                  currentDay.approvedMinutes,
                status:
                  payload.presenceDay?.status ??
                  "HR_VALIDATED",
                hrValidatedAt:
                  payload.presenceDay?.hrValidatedAt ??
                  new Date().toISOString(),
              }
            : currentDay,
        ),
      );
    } catch (validationError) {
      setError(
        validationError instanceof Error
          ? validationError.message
          : "Erreur inattendue.",
      );
    } finally {
      setValidatingId(null);
    }
  }

  const hrRoles = [
    "ADMIN",
    "HR",
  ];

  if (
    currentRole &&
    !hrRoles.includes(currentRole)
  ) {
    return null;
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 text-sm text-slate-400">
        Chargement des validations RH...
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
    <div className="rounded-3xl border border-cyan-900/50 bg-slate-950 p-6">
      <div>
        <h3 className="text-lg font-bold text-white">
          Validation RH
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          Journees controlees par le manager et transmises aux RH.
        </p>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-left text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-3">Salarie</th>
              <th className="px-3 py-3">Date</th>
              <th className="px-3 py-3">Prevu</th>
              <th className="px-3 py-3">Calcule</th>
              <th className="px-3 py-3">Retenu manager</th>
              <th className="px-3 py-3">Manager</th>
              <th className="px-3 py-3">RH</th>
              <th className="px-3 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {days.map((day) => {
              const retainedMinutes =
                day.approvedMinutes ??
                day.calculatedMinutes;

              return (
                <tr
                  key={day.id}
                  className="border-b border-slate-900 text-slate-300"
                >
                  <td className="px-3 py-3 font-semibold text-white">
                    {day.workforce.name}
                  </td>

                  <td className="px-3 py-3">
                    {new Date(
                      day.workDate,
                    ).toLocaleDateString("fr-FR")}
                  </td>

                  <td className="px-3 py-3">
                    {Math.floor(day.plannedMinutes / 60)}h
                    {String(
                      day.plannedMinutes % 60,
                    ).padStart(2, "0")}
                  </td>

                  <td className="px-3 py-3">
                    {Math.floor(day.calculatedMinutes / 60)}h
                    {String(
                      day.calculatedMinutes % 60,
                    ).padStart(2, "0")}
                  </td>

                  <td className="px-3 py-3 font-semibold text-cyan-300">
                    {Math.floor(retainedMinutes / 60)}h
                    {String(
                      retainedMinutes % 60,
                    ).padStart(2, "0")}
                  </td>

                  <td className="px-3 py-3">
                    Valide
                  </td>

                  <td className="px-3 py-3">
                    {day.hrValidatedAt
                      ? "Valide"
                      : "En attente"}
                  </td>

                  <td className="px-3 py-3">
                    {day.hrValidatedAt ? (
                      <span className="text-xs text-slate-500">
                        Termine
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={
                          validatingId === day.id
                        }
                        onClick={() =>
                          void validateDay(day)
                        }
                        className="rounded-lg bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-700 disabled:opacity-50"
                      >
                        {validatingId === day.id
                          ? "Validation..."
                          : "Valider RH"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}

            {days.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-3 py-8 text-center text-slate-500"
                >
                  Aucune journee transmise aux RH cette semaine.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
