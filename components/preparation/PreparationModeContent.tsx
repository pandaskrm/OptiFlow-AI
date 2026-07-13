"use client";

import useDemo from "../../hooks/useDemo";

import PreparationHero from "./PreparationHero";
import PreparationStats from "./PreparationStats";
import PreparationTable from "./PreparationTable";
import PreparationAi from "./PreparationAi";
import PreparationLiveChart from "./PreparationLiveChart";
import PickerPerformance from "./PickerPerformance";
import PreparationTimeline from "./PreparationTimeline";
import PreparationAnalytics from "./PreparationAnalytics";
import PreparationAnalyticsAi from "./PreparationAnalyticsAi";
import PreparationTeamStatus from "./PreparationTeamStatus";
import PreparationDecisionPanel from "./PreparationDecisionPanel";

const zeroCards = [
  { label: "Commandes du jour", value: "0" },
  { label: "Terminées", value: "0" },
  { label: "En préparation", value: "0" },
  { label: "Prioritaires", value: "0" },
  { label: "Avancement moyen", value: "0%" },
  { label: "Taux de service", value: "0%" },
];

const hours = ["08h", "09h", "10h", "11h", "12h"];

function PreparationZeroState() {
  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-3xl border border-white/10 bg-slate-950 p-8 text-white shadow-2xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
          Module préparation
        </p>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight lg:text-5xl">
              Pilotage des commandes à préparer
            </h1>

            <p className="mt-4 max-w-2xl text-slate-300">
              Connectez votre ERP ou lancez le mode Démo pour afficher
              l’activité de préparation.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-600 bg-slate-800 px-5 py-4">
            <p className="text-sm text-slate-400">
              Statut opérationnel
            </p>

            <p className="text-2xl font-bold text-slate-300">
              En attente de données
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {zeroCards.map((card) => (
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
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-950">
              Statistiques préparation
            </h2>

            <p className="text-sm text-slate-500">
              Aucune activité disponible.
            </p>
          </div>

          <div className="mb-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Semaine actuelle
              </p>

              <p className="mt-1 text-lg font-bold text-slate-950">
                0 commande
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Semaine précédente
              </p>

              <p className="mt-1 text-lg font-bold text-slate-950">
                0 commande
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Évolution
              </p>

              <p className="mt-1 text-lg font-bold text-slate-950">
                0 commande
              </p>
            </div>
          </div>

          <div className="flex h-64 items-end gap-4 rounded-2xl bg-slate-50 p-5">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day) => (
              <div
                key={day}
                className="flex flex-1 flex-col items-center gap-3"
              >
                <div className="flex h-40 w-full items-end rounded-xl bg-slate-100">
                  <div
                    className="w-full rounded-xl bg-cyan-500"
                    style={{ height: "0%" }}
                  />
                </div>

                <p className="text-sm font-bold text-slate-950">
                  {day}
                </p>

                <p className="text-xs font-bold text-slate-500">
                  0
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-6 text-white shadow-xl">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
            Analyse stratégique IA
          </p>

          <h2 className="mt-2 text-xl font-bold">
            En attente de données
          </h2>

          <p className="mt-4 text-sm text-slate-300">
            Aucune analyse ne peut être produite sans ERP ou mode Démo.
          </p>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">
              Recommandation
            </p>

            <p className="mt-2 font-semibold">
              Lancez le mode Démo pour découvrir les recommandations
              intelligentes.
            </p>
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-950">
            Équipe du jour
          </h2>

          <p className="text-sm text-slate-500">
            Aucune donnée d’équipe disponible.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-5">
          {[
            "Prévus",
            "Présents",
            "Absents",
            "En pause",
            "Renforts",
          ].map((label) => (
            <div
              key={label}
              className="rounded-2xl bg-slate-50 p-4"
            >
              <p className="text-sm text-slate-500">
                {label}
              </p>

              <p className="text-2xl font-bold text-slate-950">
                0
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
          Aucun préparateur ou secteur disponible.
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">
            Activité live
          </h2>

          <p className="text-sm text-slate-500">
            Commandes préparées par heure.
          </p>

          <div className="mt-6 flex h-48 items-end gap-4">
            {hours.map((hour) => (
              <div
                key={hour}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div className="flex h-40 w-full items-end rounded-xl bg-slate-100">
                  <div
                    className="w-full rounded-xl bg-cyan-500"
                    style={{ height: "0%" }}
                  />
                </div>

                <p className="text-xs font-semibold text-slate-500">
                  {hour}
                </p>

                <p className="text-sm font-bold text-slate-950">
                  0
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">
            Performance préparateurs
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Aucune performance disponible.
          </p>

          <div className="mt-5 space-y-4">
            {["Préparateur 1", "Préparateur 2", "Préparateur 3"].map(
              (name) => (
                <div key={name}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-500">
                      {name}
                    </span>

                    <span className="font-bold text-slate-950">
                      0%
                    </span>
                  </div>

                  <div className="h-3 rounded-full bg-slate-100">
                    <div
                      className="h-3 rounded-full bg-cyan-500"
                      style={{ width: "0%" }}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                Commandes en préparation
              </h2>

              <p className="text-sm text-slate-500">
                Aucune commande disponible.
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
              Hors ligne
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3">Commande</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Préparateur</th>
                  <th className="px-4 py-3">Priorité</th>
                  <th className="px-4 py-3">Lignes</th>
                  <th className="px-4 py-3">Avancement</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Échéance</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-slate-500"
                  >
                    Aucune commande à afficher.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div className="flex flex-col gap-6">
          {[
            "Copilote décisionnel",
            "Analyse IA",
            "Chronologie",
          ].map((title) => (
            <section
              key={title}
              className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-6 text-white shadow-xl"
            >
              <h2 className="text-xl font-bold">
                {title}
              </h2>

              <p className="mt-3 text-sm text-slate-400">
                Aucune donnée disponible.
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PreparationModeContent() {
  const demo = useDemo();

  if (!demo.running) {
    return <PreparationZeroState />;
  }

  return (
    <div className="flex flex-col gap-6">
      <PreparationHero />
      <PreparationStats />

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <PreparationAnalytics />
        <PreparationAnalyticsAi />
      </div>

      <PreparationTeamStatus />

      <div className="grid gap-6 xl:grid-cols-2">
        <PreparationLiveChart />
        <PickerPerformance />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <PreparationTable />

        <div className="flex flex-col gap-6">
          <PreparationDecisionPanel />
          <PreparationAi />
          <PreparationTimeline />
        </div>
      </div>
    </div>
  );
}