"use client";

import EmployeeQrScanner from "../../components/presence/EmployeeQrScanner";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

type Period =
  | "day"
  | "week"
  | "month"
  | "year";

type Employee = {
  id: number;
  employeeNumber: string;
  name: string;
  service: string | null;
  jobTitle: string | null;
  contractType: string | null;
  agency: string | null;
};

type HistoryDay = {
  date: string;

  hours: {
    dayCode: string | null;
    plannedMinutes: number;
    calculatedMinutes: number;
    approvedMinutes: number | null;
    retainedMinutes: number;
    status: string;
    anomaly: boolean;
    anomalyReason: string | null;
    note: string | null;
    managerValidated: boolean;
    hrValidated: boolean;
  } | null;

  stats: {
    preparedOrders: number;
    preparedLines: number;
    preparedParcels: number;
    preparedQuantity: number;
    workedMinutes: number;
    source: string;
  } | null;
};

type HistoryResponse = {
  employee: Employee;

  period: {
    type: Period;
    reference: string;
    start: string;
    endExclusive: string;
  };

  hours: {
    plannedMinutes: number;
    calculatedMinutes: number;
    retainedMinutes: number;
    anomalyDays: number;
    managerValidatedDays: number;
    hrValidatedDays: number;
  };

  stats: {
    preparedOrders: number;
    preparedLines: number;
    preparedParcels: number;
    preparedQuantity: number;
    workedMinutes: number;
    linesPerHour: number | null;
  };

  days: HistoryDay[];
};

const periodLabels: Record<
  Period,
  string
> = {
  day: "Jour",
  week: "Semaine",
  month: "Mois",
  year: "Année",
};

function localDateKey() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(
    now.getMonth() + 1,
  ).padStart(2, "0");
  const day = String(
    now.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatMinutes(
  minutes: number,
) {
  const safeMinutes = Math.max(
    0,
    Math.round(minutes),
  );

  const hours = Math.floor(
    safeMinutes / 60,
  );

  const remaining =
    safeMinutes % 60;

  return `${hours}h${String(
    remaining,
  ).padStart(2, "0")}`;
}

function formatDate(
  value: string,
) {
  return new Intl.DateTimeFormat(
    "fr-FR",
    {
      weekday: "short",
      day: "2-digit",
      month: "short",
    },
  ).format(
    new Date(`${value}T12:00:00`),
  );
}

export default function EmployeePage() {
  const [period, setPeriod] =
    useState<Period>("month");

  const [referenceDate, setReferenceDate] =
    useState(localDateKey);

  const [data, setData] =
    useState<HistoryResponse | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadHistory =
    useCallback(async () => {
      setLoading(true);
      setError(null);

      try {
        const params =
          new URLSearchParams({
            period,
            date: referenceDate,
          });

        const response =
          await fetch(
            `/api/presence/me/history?${params.toString()}`,
            {
              cache: "no-store",
            },
          );

        if (response.status === 401) {
          window.location.href =
            "/login";
          return;
        }

        if (response.status === 404) {
          throw new Error(
            "Votre compte n'est pas encore relié à votre fiche salarié.",
          );
        }

        if (!response.ok) {
          throw new Error(
            "Impossible de charger vos données.",
          );
        }

        const result =
          (await response.json()) as HistoryResponse;

        setData(result);
      }
      catch (loadError) {
        setData(null);

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Une erreur est survenue.",
        );
      }
      finally {
        setLoading(false);
      }
    }, [
      period,
      referenceDate,
    ]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto min-h-screen w-full max-w-md border-x border-white/5 bg-slate-950 pb-28">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/95 px-5 pb-4 pt-5 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-400">
                Organ•IA Salarié
              </p>

              <h1 className="mt-1 text-xl font-black">
                {data?.employee.name ??
                  "Mon espace"}
              </h1>

              {data && (
                <p className="mt-1 text-xs text-slate-400">
                  {data.employee.jobTitle ??
                    data.employee.service ??
                    "Collaborateur"}
                  {data.employee.contractType
                    ? ` • ${data.employee.contractType}`
                    : ""}
                </p>
              )}
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-lg font-black text-cyan-300">
              O
            </div>
          </div>
        </header>

        <div className="space-y-5 px-4 py-5">
          <section className="overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/15 via-slate-900 to-slate-900 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
              Aujourd'hui
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Bonjour
              {data?.employee.name
                ? ` ${data.employee.name.split(" ")[0]}`
                : ""}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              Retrouvez votre temps de travail et vos performances personnelles.
            </p>

            <EmployeeQrScanner
              onPunchRecorded={() => {
                void loadHistory();
              }}
            />
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-black">
                Mon historique
              </h2>

              <input
                type="date"
                value={referenceDate}
                onChange={(event) =>
                  setReferenceDate(
                    event.target.value,
                  )
                }
                className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-4 gap-2 rounded-2xl border border-white/10 bg-slate-900 p-1.5">
              {(
                Object.keys(
                  periodLabels,
                ) as Period[]
              ).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    setPeriod(item)
                  }
                  className={`rounded-xl px-2 py-2.5 text-xs font-black transition ${
                    period === item
                      ? "bg-cyan-400 text-slate-950"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {periodLabels[item]}
                </button>
              ))}
            </div>
          </section>

          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-10 text-center text-sm text-slate-400">
              Chargement de vos données...
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm font-semibold text-red-300">
              {error}
            </div>
          ) : data ? (
            <>
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-black">
                    Mes heures
                  </h2>

                  <span className="text-xs font-bold text-slate-500">
                    {periodLabels[
                      data.period.type
                    ]}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <MetricCard
                    label="Prévues"
                    value={formatMinutes(
                      data.hours
                        .plannedMinutes,
                    )}
                  />

                  <MetricCard
                    label="Retenues"
                    value={formatMinutes(
                      data.hours
                        .retainedMinutes,
                    )}
                    highlight
                  />

                  <MetricCard
                    label="Calculées"
                    value={formatMinutes(
                      data.hours
                        .calculatedMinutes,
                    )}
                  />

                  <MetricCard
                    label="Anomalies"
                    value={String(
                      data.hours
                        .anomalyDays,
                    )}
                  />
                </div>
              </section>

              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-black">
                    Mes stats
                  </h2>

                  <span className="text-xs font-bold text-slate-500">
                    Performance personnelle
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <MetricCard
                    label="Lignes"
                    value={String(
                      data.stats
                        .preparedLines,
                    )}
                    highlight
                  />

                  <MetricCard
                    label="Commandes"
                    value={String(
                      data.stats
                        .preparedOrders,
                    )}
                  />

                  <MetricCard
                    label="Colis"
                    value={String(
                      data.stats
                        .preparedParcels,
                    )}
                  />

                  <MetricCard
                    label="Quantité"
                    value={String(
                      data.stats
                        .preparedQuantity,
                    )}
                  />
                </div>

                <div className="mt-3 rounded-2xl border border-white/10 bg-slate-900 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Productivité
                      </p>

                      <p className="mt-1 text-2xl font-black text-white">
                        {data.stats.linesPerHour ??
                          "—"}
                      </p>
                    </div>

                    <p className="text-right text-xs font-semibold text-slate-400">
                      lignes
                      <br />
                      par heure
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="mb-3 text-lg font-black">
                  Détail
                </h2>

                {data.days.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-slate-900 p-5 text-center text-sm text-slate-400">
                    Aucune donnée sur cette période.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {data.days
                      .slice()
                      .reverse()
                      .map((day) => (
                        <div
                          key={day.date}
                          className="rounded-2xl border border-white/10 bg-slate-900 p-4"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-black capitalize">
                                {formatDate(
                                  day.date,
                                )}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {day.hours?.dayCode ??
                                  "Journée de travail"}
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="font-black text-cyan-300">
                                {day.hours
                                  ? formatMinutes(
                                      day.hours
                                        .retainedMinutes,
                                    )
                                  : "—"}
                              </p>

                              {day.hours?.anomaly && (
                                <p className="mt-1 text-[11px] font-bold text-amber-300">
                                  À vérifier
                                </p>
                              )}
                            </div>
                          </div>

                          {day.stats && (
                            <div className="mt-3 flex gap-4 border-t border-white/5 pt-3 text-xs text-slate-400">
                              <span>
                                <strong className="text-slate-200">
                                  {
                                    day.stats
                                      .preparedLines
                                  }
                                </strong>{" "}
                                lignes
                              </span>

                              <span>
                                <strong className="text-slate-200">
                                  {
                                    day.stats
                                      .preparedOrders
                                  }
                                </strong>{" "}
                                commandes
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </section>
            </>
          ) : null}
        </div>

        <nav className="fixed bottom-0 left-1/2 z-30 flex w-full max-w-md -translate-x-1/2 border-t border-white/10 bg-slate-950/95 px-3 py-3 backdrop-blur">
          <NavItem
            label="Accueil"
            active
          />

          <NavItem label="Planning" />

          <NavItem label="Demandes" />

          <NavItem label="Profil" />
        </nav>
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        highlight
          ? "border-cyan-400/20 bg-cyan-400/10"
          : "border-white/10 bg-slate-900"
      }`}
    >
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p
        className={`mt-2 text-2xl font-black ${
          highlight
            ? "text-cyan-300"
            : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function NavItem({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={`flex-1 rounded-xl py-2 text-xs font-black ${
        active
          ? "text-cyan-300"
          : "text-slate-500"
      }`}
    >
      {label}
    </button>
  );
}
