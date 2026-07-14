"use client";

import useDemo from "../../hooks/useDemo";
import useWarehouseSummary from "../../hooks/useWarehouseSummary";

import ShippingScenarioSummary from "./ShippingScenarioSummary";
import ShippingAnalytics from "./ShippingAnalytics";
import ShippingTeamStatus from "./ShippingTeamStatus";
import ShippingTable from "./ShippingTable";
import ShippingAi from "./ShippingAi";
import ShippingDecisionPanel from "./ShippingDecisionPanel";
import ShippingTimeline from "./ShippingTimeline";

function ShippingRealData() {
  const {
    data: warehouse,
    loading,
    error,
  } = useWarehouseSummary();

  const shipments = warehouse.shipments;
  const workforce = warehouse.workforce;

  const hasShipments = shipments.total > 0;
  const hasWorkforce = workforce.total > 0;

  const cards = [
    {
      label: "Expéditions du jour",
      value: shipments.total,
    },
    {
      label: "Expédiées",
      value: shipments.shipped,
    },
    {
      label: "Prêtes",
      value: shipments.ready,
    },
    {
      label: "En attente",
      value: shipments.waiting,
    },
    {
      label: "Colis",
      value: shipments.totalPackages,
    },
    {
      label: "Palettes",
      value: shipments.totalPallets,
    },
    {
      label: "Avancement moyen",
      value: `${shipments.progress}%`,
    },
    {
      label: "Taux de service",
      value: `${shipments.serviceRate}%`,
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
      label: "Renforts",
      value: workforce.reinforcement,
    },
  ];

  const mainAlert =
    warehouse.alerts.find(
      (alert) =>
        alert.toLowerCase().includes("expédition") ||
        alert.toLowerCase().includes("quai") ||
        alert.toLowerCase().includes("collaborateur")
    ) ??
    (hasShipments
      ? "Aucune alerte critique sur les expéditions."
      : "Aucune expédition ERP disponible.");

  const mainPriority =
    warehouse.priorities.find(
      (priority) =>
        priority.toLowerCase().includes("expédition") ||
        priority.toLowerCase().includes("quai") ||
        priority.toLowerCase().includes("équipe")
    ) ??
    (hasShipments
      ? "Maintenir le suivi des départs transporteurs."
      : "Connecter le flux Expéditions de l’ERP.");

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-10 text-center text-slate-400">
        Chargement du module Expédition...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-900 bg-red-950/30 p-10 text-center text-red-300">
        Impossible de charger les données d’expédition.
      </div>
    );
  }

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
              Suivi centralisé des départs transporteurs, des colis, des
              palettes, des quais et du taux de service.
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
              Statut expédition
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

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
              Performance expédition
            </h2>

            <p className="text-sm text-slate-500">
              Avancement calculé depuis les expéditions reçues de l’ERP.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Expéditions totales
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-950">
                {shipments.total}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Expédiées
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {shipments.shipped}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Restantes
              </p>

              <p className="mt-2 text-3xl font-bold text-orange-500">
                {Math.max(
                  0,
                  shipments.total - shipments.shipped
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
                {shipments.progress}%
              </p>
            </div>

            <div className="h-4 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-cyan-500 transition-all duration-500"
                style={{
                  width: `${Math.min(100, shipments.progress)}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 p-5">
              <p className="text-sm text-slate-500">
                À expédier
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-950">
                {shipments.waiting}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5">
              <p className="text-sm text-slate-500">
                Prêtes
              </p>

              <p className="mt-2 text-3xl font-bold text-cyan-600">
                {shipments.ready}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5">
              <p className="text-sm text-slate-500">
                Expédiées
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {shipments.shipped}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-6 text-white shadow-xl">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
            Analyse stratégique IA
          </p>

          <h2 className="mt-2 text-xl font-bold">
            {hasShipments
              ? "Analyse expédition active"
              : "En attente d’expéditions"}
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
              Taux de service
            </p>

            <p className="mt-2 text-3xl font-bold text-cyan-300">
              {shipments.serviceRate}%
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
            Effectifs et capacité opérationnelle reçus depuis le flux ERP.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
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
                Expéditions live
              </h2>

              <p className="text-sm text-slate-500">
                Synthèse du flux Expéditions central.
              </p>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                hasShipments
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {hasShipments
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
                    Expéditions en attente
                  </td>

                  <td className="px-4 py-4 font-bold">
                    {shipments.waiting}
                  </td>

                  <td className="px-4 py-4">
                    {shipments.waiting > 0
                      ? "Action requise"
                      : "Stable"}
                  </td>
                </tr>

                <tr className="border-t border-slate-200">
                  <td className="px-4 py-4">
                    Expéditions prêtes
                  </td>

                  <td className="px-4 py-4 font-bold">
                    {shipments.ready}
                  </td>

                  <td className="px-4 py-4">
                    {shipments.ready > 0
                      ? "Départ à organiser"
                      : "Stable"}
                  </td>
                </tr>

                <tr className="border-t border-slate-200">
                  <td className="px-4 py-4">
                    Taux de service
                  </td>

                  <td className="px-4 py-4 font-bold">
                    {shipments.serviceRate}%
                  </td>

                  <td className="px-4 py-4">
                    {shipments.serviceRate >= 95
                      ? "Objectif atteint"
                      : hasShipments
                        ? "À améliorer"
                        : "Sans données"}
                  </td>
                </tr>

                <tr className="border-t border-slate-200">
                  <td className="px-4 py-4">
                    Volume total
                  </td>

                  <td className="px-4 py-4 font-bold">
                    {shipments.totalPackages} colis /{" "}
                    {shipments.totalPallets} palettes
                  </td>

                  <td className="px-4 py-4">
                    Suivi actif
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Le détail expédition par expédition sera alimenté par la future
            API Expéditions ERP.
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
              Timeline expédition
            </h2>

            <p className="mt-3 text-sm text-slate-300">
              {shipments.shipped} expédition
              {shipments.shipped > 1 ? "s réalisées" : " réalisée"},{" "}
              {shipments.ready} prête
              {shipments.ready > 1 ? "s" : ""} et {shipments.waiting} en
              attente.
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
    return <ShippingRealData />;
  }

  return (
    <div className="flex flex-col gap-6">
      <ShippingScenarioSummary />

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