"use client";

import useSimulationV2 from "../../hooks/useSimulationV2";
import useWarehouseSummary from "../../hooks/useWarehouseSummary";

import PreparationTable from "./PreparationTable";
import PreparationAi from "./PreparationAi";
import PreparationLiveChart from "./PreparationLiveChart";
import PickerPerformance from "./PickerPerformance";
import PreparationTimeline from "./PreparationTimeline";
import PreparationAnalytics from "./PreparationAnalytics";
import PreparationAnalyticsAi from "./PreparationAnalyticsAi";
import PreparationTeamStatus from "./PreparationTeamStatus";
import PreparationDecisionPanel from "./PreparationDecisionPanel";
import PreparationScenarioSummary from "./PreparationScenarioSummary";

function PreparationRealData() {
  const {
    data: warehouse,
    loading,
    error,
  } = useWarehouseSummary();

  const orders = warehouse.orders;
  const workforce = warehouse.workforce;

  const hasOrders = orders.total > 0;
  const hasWorkforce = workforce.total > 0;

  const cards = [
    {
      label: "Commandes du jour",
      value: orders.total,
    },
    {
      label: "Terminées",
      value: orders.completed,
    },
    {
      label: "En préparation",
      value: orders.inPreparation,
    },
    {
      label: "Prioritaires",
      value: orders.priority,
    },
    {
      label: "Avancement moyen",
      value: `${orders.progress}%`,
    },
    {
      label: "Taux de service",
      value: `${orders.serviceRate}%`,
    },
  ];

  const teamCards = [
    {
      label: "Prévus",
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
  ];

  const mainAlert =
    warehouse.alerts.find(
      (alert) =>
        alert.toLowerCase().includes("commande") ||
        alert.toLowerCase().includes("collaborateur")
    ) ??
    (hasOrders
      ? "Aucune alerte critique sur la préparation."
      : "Aucune commande ERP disponible.");

  const mainPriority =
    warehouse.priorities.find(
      (priority) =>
        priority.toLowerCase().includes("commande") ||
        priority.toLowerCase().includes("équipe")
    ) ??
    (hasOrders
      ? "Maintenir le suivi des commandes en cours."
      : "Connecter le flux Commandes de l’ERP.");

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-10 text-center text-slate-500">
        Chargement du module Préparation...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-900 bg-red-950/30 p-10 text-center text-red-300">
        Impossible de charger les données de préparation.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <section className="organia-electric-panel organia-electric-panel-v2 relative overflow-hidden rounded-2xl border border-[#008cff]/80 bg-gradient-to-r from-[#020617] via-[#061426] to-[#00265c] px-5 py-5 text-white shadow-[0_0_24px_rgba(0,140,255,0.28),0_0_60px_rgba(0,107,255,0.14),inset_0_0_32px_rgba(0,140,255,0.06)]">
  <div className="pointer-events-none absolute inset-0">
    <div className="absolute left-1/2 top-0 h-px w-[70%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#00e5ff] to-transparent shadow-[0_0_18px_rgba(0,229,255,0.80)]" />
    <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#008cff]/20 blur-3xl" />
    <div className="absolute right-[19%] top-1/2 h-24 w-24 -translate-y-1/2 rounded-full border border-[#00e5ff]/10 shadow-[0_0_70px_rgba(0,140,255,0.20)]" />
    <div className="absolute right-[20%] top-1/2 h-px w-52 bg-gradient-to-r from-transparent via-[#00e5ff]/45 to-transparent" />
  </div>

  <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
    <div className="min-w-0">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#00e5ff]/55 bg-[#006bff]/15 text-xl shadow-[0_0_18px_rgba(0,229,255,0.28),inset_0_0_14px_rgba(0,140,255,0.10)]">
          📦
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.50)]">
            Module Préparation
          </p>

          <h1 className="mt-1 text-2xl font-black tracking-tight text-white lg:text-4xl">
            Préparation intelligente
          </h1>
        </div>
      </div>

      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
        Pilotage temps réel des commandes, lignes préparées, priorités,
        équipes et objectifs de service.
      </p>
    </div>

    <div className="grid grid-cols-3 gap-2">
      <div className="min-w-[125px] rounded-xl border border-[#008cff]/45 bg-[#020617]/80 px-3 py-2.5 shadow-[inset_0_0_14px_rgba(0,107,255,0.06)]">
        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
          Statut
        </p>
        <p className={`mt-1 text-sm font-black ${
          warehouse.dataConnected ? "text-emerald-300" : "text-white"
        }`}>
          {warehouse.dataConnected ? "ERP synchronisé" : "En attente ERP"}
        </p>
      </div>

      <div className="min-w-[115px] rounded-xl border border-[#008cff]/45 bg-[#020617]/80 px-3 py-2.5 shadow-[inset_0_0_14px_rgba(0,107,255,0.06)]">
        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
          Commandes
        </p>
        <p className="mt-1 text-sm font-black text-[#7df9ff]">
          {orders.total}
        </p>
      </div>

      <div className="min-w-[135px] rounded-xl border border-[#00e5ff]/40 bg-[#006bff]/10 px-3 py-2.5 shadow-[0_0_18px_rgba(0,140,255,0.12)]">
        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
          Intelligence IA
        </p>

        <div className="mt-1 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#00e5ff] shadow-[0_0_10px_#00e5ff]" />
          <p className="text-sm font-black text-[#00e5ff]">
            Surveillance
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className="organia-electric-panel relative overflow-hidden rounded-2xl border border-[#008cff]/55 bg-gradient-to-br from-[#071426] via-[#06101f] to-[#020617] p-4 text-white shadow-[0_0_20px_rgba(0,107,255,0.14),inset_0_0_18px_rgba(0,140,255,0.04)] transition hover:-translate-y-0.5 hover:border-[#00e5ff]/75 hover:shadow-[0_0_30px_rgba(0,140,255,0.24)]"
          >
            <p className="text-sm font-medium text-slate-400">
              {card.label}
            </p>

            <p className="mt-2 text-3xl font-bold text-white">
              {card.value}
            </p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <section className="organia-electric-panel organia-electric-panel-v2 organia-electric-panel organia-electric-panel-v2 relative overflow-hidden rounded-3xl border border-[#00b8ff]/55 bg-gradient-to-br from-[#061426] via-[#031024] to-[#020617] p-6 text-white shadow-[0_0_30px_rgba(0,140,255,0.20),inset_0_0_28px_rgba(0,229,255,0.035)]">
          <div className="mb-6">
            <h2 className="text-xl font-black text-white">
              Performance préparation
            </h2>

            <p className="text-sm font-medium text-slate-400">
              Avancement calculé depuis les lignes reçues de l’ERP.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-[#008cff]/30 bg-gradient-to-br from-[#071426] to-[#020617] p-5 shadow-[inset_0_0_18px_rgba(0,107,255,0.05)] transition hover:border-[#00e5ff]/45">
              <p className="text-sm font-medium text-slate-400">
                Lignes totales
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {orders.totalLines}
              </p>
            </div>

            <div className="rounded-2xl border border-[#008cff]/30 bg-gradient-to-br from-[#071426] to-[#020617] p-5 shadow-[inset_0_0_18px_rgba(0,107,255,0.05)] transition hover:border-[#00e5ff]/45">
              <p className="text-sm font-medium text-slate-400">
                Lignes préparées
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-300">
                {orders.preparedLines}
              </p>
            </div>

            <div className="rounded-2xl border border-[#008cff]/30 bg-gradient-to-br from-[#071426] to-[#020617] p-5 shadow-[inset_0_0_18px_rgba(0,107,255,0.05)] transition hover:border-[#00e5ff]/45">
              <p className="text-sm font-medium text-slate-400">
                Restantes
              </p>

              <p className="mt-2 text-3xl font-bold text-orange-500">
                {Math.max(
                  0,
                  orders.totalLines - orders.preparedLines
                )}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[#008cff]/30 bg-gradient-to-br from-[#071426] to-[#020617] p-5 shadow-[inset_0_0_18px_rgba(0,107,255,0.05)] transition hover:border-[#00e5ff]/45">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-semibold text-slate-300">
                Avancement global
              </p>

              <p className="text-2xl font-bold text-white">
                {orders.progress}%
              </p>
            </div>

            <div className="h-4 overflow-hidden rounded-full border border-[#008cff]/35 bg-[#010814] shadow-[inset_0_0_12px_rgba(0,107,255,0.12)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#006bff] via-[#008cff] to-[#00e5ff] shadow-[0_0_10px_rgba(0,229,255,0.75),0_0_22px_rgba(0,107,255,0.45)] transition-all duration-500"
                style={{
                  width: `${Math.min(100, orders.progress)}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-[#008cff]/28 bg-[#071426]/80 p-5 shadow-[inset_0_0_16px_rgba(0,107,255,0.04)]">
              <p className="text-sm font-medium text-slate-400">
                À préparer
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {orders.waiting}
              </p>
            </div>

            <div className="rounded-2xl border border-[#008cff]/28 bg-[#071426]/80 p-5 shadow-[inset_0_0_16px_rgba(0,107,255,0.04)]">
              <p className="text-sm font-medium text-slate-400">
                En cours
              </p>

              <p className="mt-2 text-3xl font-bold text-[#00e5ff]">
                {orders.inPreparation}
              </p>
            </div>

            <div className="rounded-2xl border border-[#008cff]/28 bg-[#071426]/80 p-5 shadow-[inset_0_0_16px_rgba(0,107,255,0.04)]">
              <p className="text-sm font-medium text-slate-400">
                Terminées
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-300">
                {orders.completed}
              </p>
            </div>
          </div>
        </section>

        <section className="organia-electric-panel organia-electric-panel-v2 organia-electric-panel organia-electric-panel-v2 relative overflow-hidden rounded-3xl border border-[#00b8ff]/55 bg-gradient-to-br from-[#061426] via-[#031024] to-[#020617] p-6 text-white shadow-[0_0_30px_rgba(0,140,255,0.20),inset_0_0_28px_rgba(0,229,255,0.035)]">
          <p className="text-sm uppercase tracking-[0.25em] text-[#00e5ff]">
            Analyse stratégique IA
          </p>

          <h2 className="mt-2 text-xl font-bold">
            {hasOrders
              ? "Analyse préparation active"
              : "En attente de commandes"}
          </h2>

          <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/100/10 p-4">
            <p className="text-sm text-red-300">
              Alerte
            </p>

            <p className="mt-2 font-semibold text-white">
              {mainAlert}
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-[#006bff]/25 bg-[#071426]/90 p-4">
            <p className="text-sm text-slate-500">
              Recommandation
            </p>

            <p className="mt-2 font-semibold">
              {mainPriority}
            </p>
          </div>

          <div className="mt-4 rounded-2xl border border-[#006bff]/25 bg-[#071426]/90 p-4">
            <p className="text-sm text-slate-500">
              Productivité
            </p>

            <p className="mt-2 text-3xl font-bold text-[#00e5ff]">
              {workforce.productivity}
              <span className="ml-2 text-sm font-normal text-slate-500">
                unités/heure
              </span>
            </p>
          </div>
        </section>
      </div>

      <section className="organia-electric-panel organia-electric-panel-v2 organia-electric-panel organia-electric-panel-v2 relative overflow-hidden rounded-3xl border border-[#00b8ff]/55 bg-gradient-to-br from-[#061426] via-[#031024] to-[#020617] p-6 text-white shadow-[0_0_30px_rgba(0,140,255,0.20),inset_0_0_28px_rgba(0,229,255,0.035)]">
        <div className="mb-5">
          <h2 className="text-xl font-black text-white">
            Équipe du jour
          </h2>

          <p className="text-sm font-medium text-slate-400">
            Effectifs et capacité reçus depuis le flux ERP.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5">
          {teamCards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-[#008cff]/28 bg-gradient-to-br from-[#071426] to-[#020617] p-4 shadow-[inset_0_0_16px_rgba(0,107,255,0.04)]"
            >
              <p className="text-sm font-medium text-slate-400">
                {card.label}
              </p>

              <p className="text-2xl font-bold text-white">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[#008cff]/28 bg-[#071426]/80 p-4 shadow-[inset_0_0_16px_rgba(0,107,255,0.04)]">
            <p className="text-sm font-medium text-slate-400">
              Minutes travaillées
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
              {workforce.workedMinutes}
            </p>
          </div>

          <div className="rounded-2xl border border-[#008cff]/28 bg-[#071426]/80 p-4 shadow-[inset_0_0_16px_rgba(0,107,255,0.04)]">
            <p className="text-sm font-medium text-slate-400">
              Unités traitées
            </p>

            <p className="mt-2 text-2xl font-bold text-white">
              {workforce.processedUnits}
            </p>
          </div>

          <div className="rounded-2xl border border-[#008cff]/28 bg-[#071426]/80 p-4 shadow-[inset_0_0_16px_rgba(0,107,255,0.04)]">
            <p className="text-sm font-medium text-slate-400">
              Productivité
            </p>

            <p className="mt-2 text-2xl font-bold text-[#00e5ff]">
              {workforce.productivity} u/h
            </p>
          </div>
        </div>

        {!hasWorkforce && (
          <div className="mt-5 rounded-2xl border border-dashed border-[#006bff]/35 bg-[#006bff]/5 p-6 text-center text-slate-400">
            Aucune donnée d’équipe reçue pour le moment.
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <section className="organia-electric-panel organia-electric-panel-v2 organia-electric-panel organia-electric-panel-v2 relative overflow-hidden rounded-3xl border border-[#00b8ff]/55 bg-gradient-to-br from-[#061426] via-[#031024] to-[#020617] p-6 text-white shadow-[0_0_30px_rgba(0,140,255,0.20),inset_0_0_28px_rgba(0,229,255,0.035)]">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white">
                Commandes en préparation
              </h2>

              <p className="text-sm font-medium text-slate-400">
                Synthèse du flux Commandes central.
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                hasOrders
                  ? "border border-emerald-400/30 bg-emerald-500/10 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.10)]"
                  : "border border-[#006bff]/25 bg-gradient-to-r from-[#006bff]/16 to-[#00e5ff]/6 text-[#9eefff]"
              }`}
            >
              {hasOrders
                ? "ERP synchronisé"
                : "En attente ERP"}
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#008cff]/35 bg-[#020617]/65 shadow-[inset_0_0_22px_rgba(0,107,255,0.04)]">
            <table className="w-full text-left text-sm">
              <thead className="bg-gradient-to-r from-[#006bff]/16 to-[#00e5ff]/6 text-[#9eefff]">
                <tr>
                  <th className="px-4 py-3">
                    Indicateur
                  </th>

                  <th className="px-4 py-3">
                    Valeur
                  </th>

                  <th className="px-4 py-3">
                    Statut
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t border-[#008cff]/18">
                  <td className="px-4 py-4">
                    Commandes prioritaires
                  </td>

                  <td className="px-4 py-4 font-bold">
                    {orders.priority}
                  </td>

                  <td className="px-4 py-4">
                    {orders.priority > 0
                      ? "À traiter"
                      : "Stable"}
                  </td>
                </tr>

                <tr className="border-t border-[#008cff]/18">
                  <td className="px-4 py-4">
                    Commandes en attente
                  </td>

                  <td className="px-4 py-4 font-bold">
                    {orders.waiting}
                  </td>

                  <td className="px-4 py-4">
                    {orders.waiting > 0
                      ? "Action requise"
                      : "Stable"}
                  </td>
                </tr>

                <tr className="border-t border-[#008cff]/18">
                  <td className="px-4 py-4">
                    Taux de service
                  </td>

                  <td className="px-4 py-4 font-bold">
                    {orders.serviceRate}%
                  </td>

                  <td className="px-4 py-4">
                    {orders.serviceRate >= 95
                      ? "Objectif atteint"
                      : hasOrders
                        ? "À améliorer"
                        : "Sans données"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm font-medium text-slate-400">
            Le détail ligne par ligne des commandes sera alimenté
            par la future API Commandes ERP.
          </p>
        </section>

        <div className="flex flex-col gap-4">
          <section className="organia-electric-panel organia-electric-panel-v2 organia-electric-panel organia-electric-panel-v2 relative overflow-hidden rounded-3xl border border-[#00b8ff]/55 bg-gradient-to-br from-[#061426] via-[#031024] to-[#020617] p-6 text-white shadow-[0_0_30px_rgba(0,140,255,0.20),inset_0_0_28px_rgba(0,229,255,0.035)]">
            <h2 className="text-xl font-bold">
              Copilote décisionnel
            </h2>

            <p className="mt-3 text-sm text-slate-300">
              {mainPriority}
            </p>
          </section>

          <section className="organia-electric-panel organia-electric-panel-v2 organia-electric-panel organia-electric-panel-v2 relative overflow-hidden rounded-3xl border border-[#00b8ff]/55 bg-gradient-to-br from-[#061426] via-[#031024] to-[#020617] p-6 text-white shadow-[0_0_30px_rgba(0,140,255,0.20),inset_0_0_28px_rgba(0,229,255,0.035)]">
            <h2 className="text-xl font-bold">
              Analyse IA
            </h2>

            <p className="mt-3 text-sm text-slate-300">
              Avancement global : {orders.progress}%.
              Productivité actuelle : {workforce.productivity} unité
              {workforce.productivity > 1 ? "s" : ""} par heure.
            </p>
          </section>

          <section className="organia-electric-panel organia-electric-panel-v2 organia-electric-panel organia-electric-panel-v2 relative overflow-hidden rounded-3xl border border-[#00b8ff]/55 bg-gradient-to-br from-[#061426] via-[#031024] to-[#020617] p-6 text-white shadow-[0_0_30px_rgba(0,140,255,0.20),inset_0_0_28px_rgba(0,229,255,0.035)]">
            <h2 className="text-xl font-bold">
              Chronologie
            </h2>

            <p className="mt-3 text-sm text-slate-300">
              {orders.completed} commande
              {orders.completed > 1 ? "s terminées" : " terminée"},{" "}
              {orders.inPreparation} en cours et {orders.waiting} en
              attente.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function PreparationModeContent() {
  const simulation = useSimulationV2();

  if (!simulation.running) {
    return <PreparationRealData />;
  }

  return (
    <div className="flex flex-col gap-4">
      <PreparationScenarioSummary />

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

        <div className="flex flex-col gap-4">
          <PreparationDecisionPanel />
<PreparationAi />
          <PreparationTimeline />
        </div>
      </div>
    </div>
  );
}
