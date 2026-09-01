"use client";

import {
  useEffect,
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
  absenceRequests: PendingAbsence[];
};

type PlanningResponse = {
  population: PlanningPopulation;
  workers: PlanningWorker[];
  total: number;
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
  schedule: PresenceSchedule,
) {
  if (!schedule.isWorkingDay) {
    return "Repos";
  }

  const morning =
    schedule.morningStart && schedule.morningEnd
      ? `${schedule.morningStart}-${schedule.morningEnd}`
      : null;

  const afternoon =
    schedule.afternoonStart && schedule.afternoonEnd
      ? `${schedule.afternoonStart}-${schedule.afternoonEnd}`
      : null;

  return [
    morning,
    afternoon,
  ]
    .filter(Boolean)
    .join(" / ");
}

export default function PresencePlanningSection() {
  const [population, setPopulation] =
    useState<PlanningPopulation>("EMPLOYEES");

  const [data, setData] =
    useState<PlanningResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
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
        const response = await fetch(endpoint, {
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
  }, [population]);

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
            Planning, horaires, demandes en attente et suivi des collaborateurs.
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
        ) : !data || data.workers.length === 0 ? (
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
              <table className="w-full min-w-[1050px] text-left text-sm">
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
                        className="border-t border-slate-100"
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
                          {worker.presenceSchedules.length ===
                          0 ? (
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
