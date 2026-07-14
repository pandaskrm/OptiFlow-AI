"use client";

import useDemo from "../../hooks/useDemo";
import useWarehouseSummary from "../../hooks/useWarehouseSummary";

const weeklySchedule = [
  {
    day: "Lundi",
    morning: "08h30 - 13h00",
    afternoon: "14h00 - 17h30",
    breaks: "10h50 et 15h30",
  },
  {
    day: "Mardi",
    morning: "08h30 - 13h00",
    afternoon: "14h00 - 17h30",
    breaks: "10h50 et 15h30",
  },
  {
    day: "Mercredi",
    morning: "08h30 - 13h00",
    afternoon: "14h00 - 17h30",
    breaks: "10h50 et 15h30",
  },
  {
    day: "Jeudi",
    morning: "08h30 - 13h00",
    afternoon: "14h00 - 17h30",
    breaks: "10h50 et 15h30",
  },
  {
    day: "Vendredi",
    morning: "08h30 - 13h00",
    afternoon: "14h00 - 16h30",
    breaks: "10h50 uniquement",
  },
];

function TeamRealData() {
  const {
    data: warehouse,
    loading,
    error,
  } = useWarehouseSummary();

  const workforce = warehouse.workforce;

  const cards = [
    {
      label: "Effectif total",
      value: workforce.total,
    },
    {
      label: "Présents",
      value: workforce.present,
    },
    {
      label: "Absents",
      value: workforce.absent,
    },
    {
      label: "En pause",
      value: workforce.paused,
    },
    {
      label: "Renforts",
      value: workforce.reinforcement,
    },
    {
      label: "Productivité",
      value: `${workforce.productivity} u/h`,
    },
  ];

  const attendanceRate =
    workforce.total > 0
      ? Math.round(
          (workforce.present / workforce.total) * 100
        )
      : 0;

  const workedHours =
    workforce.workedMinutes > 0
      ? Math.round(
          (workforce.workedMinutes / 60) * 10
        ) / 10
      : 0;

  const mainAlert =
    warehouse.alerts.find(
      (alert) =>
        alert.toLowerCase().includes("collaborateur") ||
        alert.toLowerCase().includes("absent")
    ) ??
    (workforce.total > 0
      ? "Aucune alerte critique concernant les équipes."
      : "Aucune donnée d’équipe ERP disponible.");

  const mainPriority =
    warehouse.priorities.find(
      (priority) =>
        priority.toLowerCase().includes("équipe") ||
        priority.toLowerCase().includes("absence") ||
        priority.toLowerCase().includes("ressource")
    ) ??
    (workforce.total > 0
      ? "Maintenir la répartition actuelle des équipes."
      : "Connecter le flux Équipe de l’ERP.");

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-10 text-center text-slate-400">
        Chargement du module Équipe...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-900 bg-red-950/30 p-10 text-center text-red-300">
        Impossible de charger les données d’équipe.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-3xl border border-white/10 bg-slate-950 p-8 text-white shadow-2xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
          Module équipe
        </p>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight lg:text-5xl">
              Pilotage des équipes
            </h1>

            <p className="mt-4 max-w-3xl text-slate-300">
              Suivi centralisé des présences, absences, pauses,
              renforts, temps travaillé et performances.
            </p>
          </div>

          <div
            className={`rounded-2xl border px-5 py-4 ${
              warehouse.dataConnected
                ? "border-emerald-500/30 bg-emerald-500/10"
                : "border-slate-600 bg-slate-800"
            }`}
          >
            <p className="text-sm text-slate-400">
              Statut équipe
            </p>

            <p
              className={`mt-1 text-2xl font-bold ${
                warehouse.dataConnected
                  ? "text-emerald-400"
                  : "text-slate-300"
              }`}
            >
              {warehouse.dataConnected
                ? "Données ERP synchronisées"
                : "En attente de données ERP"}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">
              {card.label}
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              {card.value}
            </p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">
            Capacité opérationnelle
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Indicateurs calculés depuis les données d’activité.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Taux de présence
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-950">
                {attendanceRate}%
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Heures enregistrées
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-950">
                {workedHours} h
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Unités traitées
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {workforce.processedUnits}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-semibold text-slate-700">
                Présence de l’équipe
              </p>

              <p className="text-2xl font-bold text-slate-950">
                {attendanceRate}%
              </p>
            </div>

            <div className="h-4 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-cyan-500 transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    attendanceRate
                  )}%`,
                }}
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-6 text-white shadow-xl">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
            Analyse IA
          </p>

          <h2 className="mt-2 text-xl font-bold">
            Équilibre des ressources
          </h2>

          <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
            <p className="text-sm text-red-300">
              Alerte
            </p>

            <p className="mt-2 font-semibold text-white">
              {mainAlert}
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">
              Recommandation
            </p>

            <p className="mt-2 font-semibold">
              {mainPriority}
            </p>
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              Horaires de référence
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Organisation fixe de la semaine de travail.
            </p>
          </div>

          <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-bold text-cyan-700">
            Contrat : 39 h / semaine
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3">
                  Jour
                </th>

                <th className="px-4 py-3">
                  Matin
                </th>

                <th className="px-4 py-3">
                  Après-midi
                </th>

                <th className="px-4 py-3">
                  Pauses
                </th>

                <th className="px-4 py-3">
                  Durée d’une pause
                </th>
              </tr>
            </thead>

            <tbody>
              {weeklySchedule.map((row) => (
                <tr
                  key={row.day}
                  className="border-t border-slate-200"
                >
                  <td className="px-4 py-4 font-bold text-slate-950">
                    {row.day}
                  </td>

                  <td className="px-4 py-4 text-slate-600">
                    {row.morning}
                  </td>

                  <td className="px-4 py-4 text-slate-600">
                    {row.afternoon}
                  </td>

                  <td className="px-4 py-4 text-slate-600">
                    {row.breaks}
                  </td>

                  <td className="px-4 py-4 text-slate-600">
                    10 minutes
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">
          Synthèse des ressources
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">
              Présents
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {workforce.present}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">
              Absents
            </p>

            <p className="mt-2 text-3xl font-bold text-red-600">
              {workforce.absent}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">
              Renforts
            </p>

            <p className="mt-2 text-3xl font-bold text-cyan-600">
              {workforce.reinforcement}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">
              En pause
            </p>

            <p className="mt-2 text-3xl font-bold text-orange-500">
              {workforce.paused}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function TeamDemoState() {
  return (
    <div className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-10 text-center text-white">
      <h1 className="text-3xl font-bold">
        Mode Démo Équipe
      </h1>

      <p className="mt-4 text-slate-300">
        Le scénario Démo utilise les effectifs simulés du moteur
        OptiFlow AI.
      </p>
    </div>
  );
}

export default function TeamModeContent() {
  const demo = useDemo();

  if (demo.running) {
    return <TeamDemoState />;
  }

  return <TeamRealData />;
}
