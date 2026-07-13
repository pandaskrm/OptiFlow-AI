"use client";

import useDemo from "../../hooks/useDemo";

import ShippingHero from "./ShippingHero";
import ShippingStats from "./ShippingStats";
import ShippingAnalytics from "./ShippingAnalytics";
import ShippingTeamStatus from "./ShippingTeamStatus";
import ShippingTable from "./ShippingTable";
import ShippingAi from "./ShippingAi";
import ShippingDecisionPanel from "./ShippingDecisionPanel";
import ShippingTimeline from "./ShippingTimeline";

const zeroCards = [
  { label: "Expéditions du jour", value: "0" },
  { label: "Expédiées", value: "0" },
  { label: "Chargements", value: "0" },
  { label: "Prioritaires", value: "0" },
  { label: "Colis", value: "0" },
  { label: "Palettes", value: "0" },
  { label: "Avancement moyen", value: "0%" },
  { label: "Taux de service", value: "0%" },
];

const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

function ShippingZeroState() {
  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-3xl border border-white/10 bg-slate-950 p-8 text-white shadow-2xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
          Module expédition
        </p>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight lg:text-5xl">
              Pilotage des expéditions
            </h1>

            <p className="mt-4 max-w-2xl text-slate-300">
              Connectez votre ERP ou lancez le mode Démo pour afficher les
              départs transporteurs, les quais, les colis et les palettes.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-600 bg-slate-800 px-5 py-4">
            <p className="text-sm text-slate-400">
              Statut expédition
            </p>

            <p className="text-2xl font-bold text-slate-300">
              En attente de données
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
              Statistiques expédition
            </h2>

            <p className="text-sm text-slate-500">
              Aucune activité disponible.
            </p>
          </div>

          <div className="mb-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Période actuelle
              </p>

              <p className="text-lg font-bold text-slate-950">
                0 expédition
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Période précédente
              </p>

              <p className="text-lg font-bold text-slate-950">
                0 expédition
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">
                Évolution
              </p>

              <p className="text-lg font-bold text-slate-950">
                0
              </p>
            </div>
          </div>

          <div className="flex h-64 items-end gap-4 rounded-2xl bg-slate-50 p-5">
            {days.map((day) => (
              <div
                key={day}
                className="flex flex-1 flex-col items-center gap-3"
              >
                <div className="flex h-40 w-full items-end justify-center gap-2">
                  <div className="flex h-full w-1/2 items-end rounded-xl bg-slate-100">
                    <div
                      className="w-full rounded-xl bg-slate-300"
                      style={{ height: "0%" }}
                    />
                  </div>

                  <div className="flex h-full w-1/2 items-end rounded-xl bg-slate-100">
                    <div
                      className="w-full rounded-xl bg-cyan-500"
                      style={{ height: "0%" }}
                    />
                  </div>
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
          <h2 className="text-xl font-bold">
            Analyse IA
          </h2>

          <p className="mt-4 text-sm text-slate-300">
            Aucune analyse disponible sans ERP ou mode Démo.
          </p>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="font-semibold text-cyan-300">
              Recommandation
            </p>

            <p className="mt-2 text-sm text-slate-300">
              Lancez le mode Démo pour découvrir les recommandations
              liées aux départs transporteurs.
            </p>
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-950">
            Équipe expédition
          </h2>

          <p className="text-sm text-slate-500">
            Aucune donnée d’équipe disponible.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          {["Prévus", "Présents", "Absents", "Renforts"].map((label) => (
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
          Aucun collaborateur ou quai affecté.
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                Expéditions live
              </h2>

              <p className="text-sm text-slate-500">
                Aucune expédition disponible.
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
                  <th className="px-4 py-3">Expédition</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Transporteur</th>
                  <th className="px-4 py-3">Quai</th>
                  <th className="px-4 py-3">Priorité</th>
                  <th className="px-4 py-3">Colis</th>
                  <th className="px-4 py-3">Avancement</th>
                  <th className="px-4 py-3">Départ</th>
                  <th className="px-4 py-3">Statut</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-12 text-center text-slate-500"
                  >
                    Aucune expédition à afficher.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div className="flex flex-col gap-6">
          <section className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-6 text-white shadow-xl">
            <h2 className="text-xl font-bold">
              Copilote décisionnel
            </h2>

            <p className="mt-3 text-sm text-slate-400">
              Aucune décision disponible.
            </p>
          </section>

          <section className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-6 text-white shadow-xl">
            <h2 className="text-xl font-bold">
              Timeline expédition
            </h2>

            <p className="mt-3 text-sm text-slate-400">
              Aucun événement disponible.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function ShippingModeContent() {
  const demo = useDemo();

  if (!demo.running) {
    return <ShippingZeroState />;
  }

  return (
    <div className="flex flex-col gap-6">
      <ShippingHero />
      <ShippingStats />

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <ShippingAnalytics />
        <ShippingAi />
      </div>

      <ShippingTeamStatus />

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <ShippingTable />

        <div className="flex flex-col gap-6">
          <ShippingDecisionPanel />
          <ShippingTimeline />
        </div>
      </div>
    </div>
  );
}