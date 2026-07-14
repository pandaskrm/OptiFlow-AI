"use client";

import useDemo from "../../hooks/useDemo";
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
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-10 text-center text-slate-400">
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
              Suivi centralisé des commandes, des lignes préparées,
              des priorités, des équipes et du taux de service.
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
              Statut opérationnel
            </p>

            <p
              className={`text-2xl font-bold ${
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

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
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
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-950">
              Performance préparation
            </h2>

            <p className="text-sm text-slate-500">
              Avancement calculé depuis les lignes reçues de l’ERP.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Lignes totales
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-950">
                {orders.totalLines}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Lignes préparées
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {orders.preparedLines}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
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

          <div className="mt-6 rounded-2xl bg-slate-50 p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-semibold text-slate-700">
                Avancement global
              </p>

              <p className="text-2xl font-bold text-slate-950">
                {orders.progress}%
              </p>
            </div>

            <div className="h-4 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-cyan-500 transition-all duration-500"
                style={{
                  width: `${Math.min(100, orders.progress)}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 p-5">
              <p className="text-sm text-slate-500">
                À préparer
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-950">
                {orders.waiting}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5">
              <p className="text-sm text-slate-500">
                En cours
              </p>

              <p className="mt-2 text-3xl font-bold text-cyan-600">
                {orders.inPreparation}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5">
              <p className="text-sm text-slate-500">
                Terminées
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {orders.completed}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-6 text-white shadow-xl">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
            Analyse stratégique IA
          </p>

          <h2 className="mt-2 text-xl font-bold">
            {hasOrders
              ? "Analyse préparation active"
              : "En attente de commandes"}
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

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">
              Productivité
            </p>

            <p className="mt-2 text-3xl font-bold text-cyan-300">
              {workforce.productivity}
              <span className="ml-2 text-sm font-normal text-slate-400">
                unités/heure
              </span>
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
            Effectifs et capacité reçus depuis le flux ERP.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-5">
          {teamCards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl bg-slate-50 p-4"
            >
              <p className="text-sm text-slate-500">
                {card.label}
              </p>

              <p className="text-2xl font-bold text-slate-950">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">
              Minutes travaillées
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-950">
              {workforce.workedMinutes}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">
              Unités traitées
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-950">
              {workforce.processedUnits}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">
              Productivité
            </p>

            <p className="mt-2 text-2xl font-bold text-cyan-600">
              {workforce.productivity} u/h
            </p>
          </div>
        </div>

        {!hasWorkforce && (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
            Aucune donnée d’équipe reçue pour le moment.
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                Commandes en préparation
              </h2>

              <p className="text-sm text-slate-500">
                Synthèse du flux Commandes central.
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                hasOrders
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {hasOrders
                ? "ERP synchronisé"
                : "En attente ERP"}
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
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
                <tr className="border-t border-slate-200">
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

                <tr className="border-t border-slate-200">
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

                <tr className="border-t border-slate-200">
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

          <p className="mt-4 text-sm text-slate-500">
            Le détail ligne par ligne des commandes sera alimenté
            par la future API Commandes ERP.
          </p>
        </section>

        <div className="flex flex-col gap-6">
          <section className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-6 text-white shadow-xl">
            <h2 className="text-xl font-bold">
              Copilote décisionnel
            </h2>

            <p className="mt-3 text-sm text-slate-300">
              {mainPriority}
            </p>
          </section>

          <section className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-6 text-white shadow-xl">
            <h2 className="text-xl font-bold">
              Analyse IA
            </h2>

            <p className="mt-3 text-sm text-slate-300">
              Avancement global : {orders.progress}%.
              Productivité actuelle : {workforce.productivity} unité
              {workforce.productivity > 1 ? "s" : ""} par heure.
            </p>
          </section>

          <section className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-6 text-white shadow-xl">
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
  const demo = useDemo();

  if (!demo.running) {
    return <PreparationRealData />;
  }

  return (
    <div className="flex flex-col gap-6">
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

        <div className="flex flex-col gap-6">
          <PreparationDecisionPanel />
          <PreparationAi />
          <PreparationTimeline />
        </div>
      </div>
    </div>
  );
}