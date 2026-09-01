"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

type PlanningPopulation =
  | "EMPLOYEES"
  | "TEMPORARY";

type PresenceSchedule = {
  id: string;
  dayOfWeek: number;
  morningStart: string | null;
  morningEnd: string | null;
  afternoonStart: string | null;
  afternoonEnd: string | null;
  isWorkingDay: boolean;
  validFrom: string | null;
  validUntil: string | null;
};

type PresenceHabit = {
  id: string;
  dayOfWeek: number;
  isWorkingDay: boolean;
  morningStart: string | null;
  morningEnd: string | null;
  afternoonStart: string | null;
  afternoonEnd: string | null;
  sampleCount: number;
  confidence: number;
  firstObservedAt: string | null;
  lastObservedAt: string | null;
  effectiveFrom: string;
  effectiveUntil: string | null;
  status: string;
};

type PresenceChange = {
  id: string;
  workDate: string;
  dayOfWeek: number;
  kind: string;
  message: string;
  expectedSnapshot: string | null;
  actualSnapshot: string | null;
  severity: string;
  status: string;
  detectedAt: string;
  acknowledgedAt: string | null;
  acknowledgedBy: string | null;
};

type PendingAbsence = {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  startPart: string;
  endPart: string;
  employeeComment: string | null;
  status: string;
  submittedAt: string;
  documents: {
    id: string;
    category: string;
    isMedical: boolean;
  }[];
};

type PlanningWorker = {
  id: number;
  employeeNumber: string;
  name: string;
  team: string | null;
  service: string | null;
  jobTitle: string | null;
  contractType: string | null;
  agency: string | null;
  onboardingStatus: string;
  zone: string | null;

  job: {
    id: string;
    code: string | null;
    name: string;
    service: string;
    sortOrder: number;
  } | null;

  presenceSchedules: PresenceSchedule[];
  presenceScheduleHabits: PresenceHabit[];
  presenceScheduleChanges: PresenceChange[];
  absenceRequests: PendingAbsence[];
};

type PlanningResponse = {
  population: PlanningPopulation;
  workers: PlanningWorker[];
  total: number;
};

type Snapshot = {
  isWorkingDay?: boolean;
  morningStart?: string | null;
  morningEnd?: string | null;
  afternoonStart?: string | null;
  afternoonEnd?: string | null;
};

const dayLabels = [
  "",
  "Lun",
  "Mar",
  "Mer",
  "Jeu",
  "Ven",
  "Sam",
  "Dim",
];

function formatSchedule(
  schedule: {
    isWorkingDay: boolean;
    morningStart: string | null;
    morningEnd: string | null;
    afternoonStart: string | null;
    afternoonEnd: string | null;
  },
) {
  if (!schedule.isWorkingDay) {
    return "Repos";
  }

  const morning =
    schedule.morningStart &&
    schedule.morningEnd
      ? `${schedule.morningStart}-${schedule.morningEnd}`
      : null;

  const afternoon =
    schedule.afternoonStart &&
    schedule.afternoonEnd
      ? `${schedule.afternoonStart}-${schedule.afternoonEnd}`
      : null;

  return [morning, afternoon]
    .filter(Boolean)
    .join(" / ") || "Jour travaille";
}

function readSnapshot(
  value: string | null,
): Snapshot | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as Snapshot;
  }
  catch {
    return null;
  }
}

function formatSnapshot(
  value: string | null,
) {
  const snapshot =
    readSnapshot(value);

  if (!snapshot) {
    return "Non disponible";
  }

  return formatSchedule({
    isWorkingDay:
      snapshot.isWorkingDay ?? true,
    morningStart:
      snapshot.morningStart ?? null,
    morningEnd:
      snapshot.morningEnd ?? null,
    afternoonStart:
      snapshot.afternoonStart ?? null,
    afternoonEnd:
      snapshot.afternoonEnd ?? null,
  });
}

function confidenceLabel(
  confidence: number,
) {
  return `${Math.round(confidence * 100)} %`;
}

export default function PresencePlanningSection() {
  const [population, setPopulation] =
    useState<PlanningPopulation>("EMPLOYEES");

  const [data, setData] =
    useState<PlanningResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [learning, setLearning] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [refreshKey, setRefreshKey] =
    useState(0);

  const [adoptingChangeId, setAdoptingChangeId] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPlanning() {
      setLoading(true);
      setError(null);

      const endpoint =
        population === "EMPLOYEES"
          ? "/api/presence/planning/employees"
          : "/api/presence/planning/temporary";

      try {
        const response =
          await fetch(endpoint, {
            cache: "no-store",
          });

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}`,
          );
        }

        const result =
          (await response.json()) as PlanningResponse;

        if (!cancelled) {
          setData(result);
        }
      }
      catch {
        if (!cancelled) {
          setError(
            "Impossible de charger le planning Presence.",
          );
          setData(null);
        }
      }
      finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadPlanning();

    return () => {
      cancelled = true;
    };
  }, [population, refreshKey]);

  const openChanges =
    useMemo(
      () =>
        data?.workers.reduce(
          (total, worker) =>
            total +
            worker
              .presenceScheduleChanges
              .length,
          0,
        ) ?? 0,
      [data],
    );

  async function refreshLearning() {
    setLearning(true);
    setError(null);

    try {
      const response =
        await fetch(
          "/api/presence/planning/learning",
          {
            method: "POST",
          },
        );

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`,
        );
      }

      setRefreshKey(
        (value) => value + 1,
      );
    }
    catch {
      setError(
        "Impossible d'actualiser l'analyse du planning.",
      );
    }
    finally {
      setLearning(false);
    }
  }

  async function adoptNewPattern(
    changeId: string,
  ) {
    const accepted =
      window.confirm(
        "Adopter ce rythme comme nouvelle habitude pour ce collaborateur ? Le planning officiel ne sera pas modifie.",
      );

    if (!accepted) {
      return;
    }

    setAdoptingChangeId(
      changeId,
    );

    setError(null);

    try {
      const response =
        await fetch(
          `/api/presence/planning/changes/${changeId}/adopt`,
          {
            method: "POST",
          },
        );

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`,
        );
      }

      setRefreshKey(
        (value) =>
          value + 1,
      );
    }
    catch {
      setError(
        "Impossible d'adopter ce nouveau rythme.",
      );
    }
    finally {
      setAdoptingChangeId(
        null,
      );
    }
  }

  const title =
    population === "EMPLOYEES"
      ? "Planning Embauches"
      : "Planning Interimaires";

  return (
    <section className="rounded-2xl border border-cyan-400/20 bg-slate-950 p-4 text-white shadow-xl">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
            OrganIA Presence
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            {title}
          </h2>

          <p className="mt-1 max-w-3xl text-sm text-slate-400">
            Planning, horaires, demandes en attente et changements de rythme detectes.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              setPopulation("EMPLOYEES")
            }
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
              population === "EMPLOYEES"
                ? "bg-cyan-400 text-slate-950"
                : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            Embauches
          </button>

          <button
            type="button"
            onClick={() =>
              setPopulation("TEMPORARY")
            }
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
              population === "TEMPORARY"
                ? "bg-cyan-400 text-slate-950"
                : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            Interimaires
          </button>

          <button
            type="button"
            disabled={learning}
            onClick={() =>
              void refreshLearning()
            }
            className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-200 transition hover:bg-cyan-400/20 disabled:cursor-wait disabled:opacity-50"
          >
            {learning
              ? "Analyse..."
              : "Analyser les habitudes"}
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Collaborateurs
          </p>
          <p className="mt-1 text-xl font-bold">
            {data?.total ?? "—"}
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Changements detectes
          </p>
          <p className="mt-1 text-xl font-bold text-cyan-300">
            {loading ? "—" : openChanges}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white">
        {loading ? (
          <div className="p-8 text-center text-sm font-medium text-slate-500">
            Chargement du planning...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-sm font-medium text-red-600">
            {error}
          </div>
        ) : !data ||
          data.workers.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-bold text-slate-900">
              Aucun collaborateur dans ce planning.
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Les nouveaux collaborateurs apparaitront ici apres leur ajout ou leur inscription OrganIA.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <p className="text-sm font-semibold text-slate-700">
                {data.total} collaborateur
                {data.total > 1 ? "s" : ""}
              </p>

              <p className="text-xs font-medium text-slate-500">
                Source : OrganIA Presence
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1250px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">
                      Collaborateur
                    </th>

                    <th className="px-4 py-3">
                      Metier / service
                    </th>

                    <th className="px-4 py-3">
                      Contrat
                    </th>

                    {population ===
                      "TEMPORARY" && (
                      <th className="px-4 py-3">
                        Agence
                      </th>
                    )}

                    <th className="px-4 py-3">
                      Horaires
                    </th>

                    <th className="px-4 py-3">
                      Intelligence OrganIA
                    </th>

                    <th className="px-4 py-3 text-center">
                      A valider
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {data.workers.map(
                    (worker) => (
                      <tr
                        key={worker.id}
                        className="border-t border-slate-100 align-top"
                      >
                        <td className="px-4 py-3">
                          <p className="font-bold text-slate-950">
                            {worker.name}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-500">
                            {worker.employeeNumber}
                          </p>
                        </td>

                        <td className="px-4 py-3 text-slate-700">
                          <p className="font-semibold">
                            {worker.job?.name ??
                              worker.jobTitle ??
                              "Non defini"}
                          </p>

                          <p className="text-xs text-slate-500">
                            {worker.job?.service ??
                              worker.service ??
                              worker.team ??
                              "Service non defini"}
                          </p>
                        </td>

                        <td className="px-4 py-3 font-medium text-slate-700">
                          {worker.contractType ??
                            "Non defini"}
                        </td>

                        {population ===
                          "TEMPORARY" && (
                          <td className="px-4 py-3 font-medium text-slate-700">
                            {worker.agency ??
                              "Agence non definie"}
                          </td>
                        )}

                        <td className="px-4 py-3">
                          {worker
                            .presenceSchedules
                            .length === 0 ? (
                            <span className="text-slate-400">
                              Aucun horaire
                            </span>
                          ) : (
                            <div className="flex flex-col gap-1">
                              {worker.presenceSchedules.map(
                                (schedule) => (
                                  <div
                                    key={
                                      schedule.id
                                    }
                                    className="text-xs text-slate-600"
                                  >
                                    <span className="font-bold text-slate-800">
                                      {dayLabels[
                                        schedule.dayOfWeek
                                      ] ??
                                        `J${schedule.dayOfWeek}`}
                                      {" : "}
                                    </span>

                                    {formatSchedule(
                                      schedule,
                                    )}
                                  </div>
                                ),
                              )}
                            </div>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {worker
                            .presenceScheduleChanges
                            .length > 0 ? (
                            <div className="flex min-w-[280px] flex-col gap-2">
                              {worker.presenceScheduleChanges.map(
                                (change) => (
                                  <div
                                    key={
                                      change.id
                                    }
                                    className="rounded-xl border border-cyan-200 bg-cyan-50 p-3"
                                  >
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="text-xs font-black uppercase tracking-wide text-cyan-800">
                                        {change.kind ===
                                        "NEW_RECURRING_PATTERN"
                                          ? "Nouveau rythme"
                                          : "Changement detecte"}
                                      </span>

                                      <span className="text-xs font-bold text-slate-500">
                                        {dayLabels[
                                          change.dayOfWeek
                                        ] ??
                                          `J${change.dayOfWeek}`}
                                      </span>
                                    </div>

                                    <div className="mt-2 grid gap-1 text-xs">
                                      <p className="text-slate-600">
                                        <span className="font-bold text-slate-900">
                                          Habituel :
                                        </span>{" "}
                                        {formatSnapshot(
                                          change.expectedSnapshot,
                                        )}
                                      </p>

                                      <p className="text-slate-600">
                                        <span className="font-bold text-slate-900">
                                          Actuel :
                                        </span>{" "}
                                        {formatSnapshot(
                                          change.actualSnapshot,
                                        )}
                                      </p>
                                    </div>

                                    <p className="mt-2 text-xs leading-relaxed text-slate-500">
                                      {change.message}
                                    </p>

                                    {change.kind ===
                                      "NEW_RECURRING_PATTERN" && (
                                      <button
                                        type="button"
                                        disabled={
                                          adoptingChangeId ===
                                          change.id
                                        }
                                        onClick={() =>
                                          void adoptNewPattern(
                                            change.id,
                                          )
                                        }
                                        className="mt-3 w-full rounded-lg bg-cyan-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-cyan-700 disabled:cursor-wait disabled:opacity-50"
                                      >
                                        {adoptingChangeId ===
                                        change.id
                                          ? "Adoption..."
                                          : "Adopter comme nouveau rythme"}
                                      </button>
                                    )}
                                  </div>
                                ),
                              )}
                            </div>
                          ) : worker
                              .presenceScheduleHabits
                              .length > 0 ? (
                            <div className="min-w-[220px]">
                              <p className="text-xs font-bold text-slate-700">
                                Rythme habituel appris
                              </p>

                              <div className="mt-1 flex flex-col gap-1">
                                {worker.presenceScheduleHabits.map(
                                  (habit) => (
                                    <p
                                      key={
                                        habit.id
                                      }
                                      className="text-xs text-slate-500"
                                    >
                                      <span className="font-semibold text-slate-700">
                                        {dayLabels[
                                          habit.dayOfWeek
                                        ] ??
                                          `J${habit.dayOfWeek}`}
                                      </span>
                                      {" · "}
                                      {formatSchedule(
                                        habit,
                                      )}
                                      {" · "}
                                      {confidenceLabel(
                                        habit.confidence,
                                      )}
                                    </p>
                                  ),
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">
                              Pas encore assez d'historique
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3 text-center">
                          {worker.absenceRequests
                            .length > 0 ? (
                            <span className="inline-flex min-w-8 items-center justify-center rounded-full border border-slate-300 bg-slate-100 px-2 py-1 text-xs font-bold text-slate-800">
                              {
                                worker
                                  .absenceRequests
                                  .length
                              }
                            </span>
                          ) : (
                            <span className="text-slate-400">
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
