"use client";

import useSimulationV2 from "../../hooks/useSimulationV2";
import useWarehouseSummary from "../../hooks/useWarehouseSummary";

function StockRealData() {
  const {
    data: warehouse,
    loading,
    error,
  } = useWarehouseSummary();

  const inventory = warehouse.inventory;

  const cards = [
    {
      label: "Références",
      value: inventory.references,
    },
    {
      label: "Quantité totale",
      value: inventory.totalQuantity,
    },
    {
      label: "Stock réservé",
      value: inventory.reservedQuantity,
    },
    {
      label: "Stock disponible",
      value: inventory.availableQuantity,
    },
    {
      label: "Sous le seuil",
      value: inventory.lowStockReferences,
    },
    {
      label: "Indisponibles",
      value: inventory.unavailableReferences,
    },
  ];

  const mainAlert =
    warehouse.alerts.find(
      (alert) =>
        alert.toLowerCase().includes("stock") ||
        alert.toLowerCase().includes("référence")
    ) ??
    (inventory.references > 0
      ? "Aucune alerte critique sur le stock."
      : "Aucune donnée de stock ERP disponible.");

  const mainPriority =
    warehouse.priorities.find(
      (priority) =>
        priority.toLowerCase().includes("stock") ||
        priority.toLowerCase().includes("réapprovisionnement")
    ) ??
    (inventory.references > 0
      ? "Maintenir le contrôle des références sensibles."
      : "Connecter le flux Stock de l’ERP.");

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-10 text-center text-slate-500">
        Chargement du module Stock...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-900 bg-red-950/30 p-10 text-center text-red-300">
        Impossible de charger les données de stock.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-white/10 bg-slate-950 p-5 text-white shadow-xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
          Module stock
        </p>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight lg:text-4xl">
              Pilotage du stock
            </h1>

            <p className="mt-4 max-w-2xl text-slate-300">
              Suivi centralisé des quantités, réservations, disponibilités,
              ruptures et seuils de réapprovisionnement.
            </p>
          </div>

          <div
            className={`rounded-2xl border px-5 py-4 ${
              warehouse.dataConnected
                ? "border-emerald-500/30 bg-emerald-500/10"
                : "border-slate-600 bg-slate-800"
            }`}
          >
            <p className="text-sm text-slate-500">
              Statut stock
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

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-700">
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
            Disponibilité globale
          </h2>

          <p className="mt-1 text-sm font-medium text-slate-700">
            Répartition calculée depuis les données de stock ERP.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-700">
                Total
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-950">
                {inventory.totalQuantity}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-700">
                Réservé
              </p>

              <p className="mt-2 text-3xl font-bold text-orange-500">
                {inventory.reservedQuantity}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-700">
                Disponible
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {inventory.availableQuantity}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 p-5">
            <p className="text-sm font-medium text-slate-700">
              Taux de disponibilité
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              {inventory.totalQuantity > 0
                ? Math.round(
                    (inventory.availableQuantity /
                      inventory.totalQuantity) *
                      100
                  )
                : 0}
              %
            </p>

            <div className="mt-4 h-4 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-cyan-500"
                style={{
                  width: `${
                    inventory.totalQuantity > 0
                      ? Math.min(
                          100,
                          Math.round(
                            (inventory.availableQuantity /
                              inventory.totalQuantity) *
                              100
                          )
                        )
                      : 0
                  }%`,
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
            Surveillance du stock
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
            <p className="text-sm text-slate-500">
              Recommandation
            </p>

            <p className="mt-2 font-semibold">
              {mainPriority}
            </p>
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-950">
          Risques de rupture
        </h2>

        <p className="mt-1 text-sm font-medium text-slate-700">
          Synthèse des références nécessitant une action.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 p-5">
            <p className="text-sm font-medium text-slate-700">
              Références suivies
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
              {inventory.references}
            </p>
          </div>

          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
            <p className="text-sm text-orange-700">
              Sous le seuil
            </p>

            <p className="mt-2 text-3xl font-bold text-orange-600">
              {inventory.lowStockReferences}
            </p>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm text-red-700">
              Indisponibles
            </p>

            <p className="mt-2 text-3xl font-bold text-red-600">
              {inventory.unavailableReferences}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function StockDemoState() {
  const simulation = useSimulationV2();
  const stock = simulation.state.stock;

  const availableReferences = Math.max(
    0,
    stock.totalReferences - stock.stockouts,
  );

  const availabilityRate =
    stock.totalReferences > 0
      ? Math.round(
          (availableReferences / stock.totalReferences) * 100,
        )
      : 100;

  const hasRisk =
    stock.stockouts > 0 || stock.lowStockReferences > 0;

  const mainAlert =
    stock.stockouts > 0
      ? `${stock.stockouts} référence(s) actuellement indisponible(s).`
      : stock.lowStockReferences > 0
        ? `${stock.lowStockReferences} référence(s) sous le seuil de sécurité.`
        : "Aucune alerte critique sur le stock.";

  const mainPriority =
    stock.stockouts > 0
      ? "Prioriser le réapprovisionnement des références indisponibles."
      : stock.lowStockReferences > 0
        ? "Surveiller et réapprovisionner les références sous le seuil."
        : "Maintenir la surveillance actuelle du stock.";

  const cards = [
    {
      label: "Références",
      value: stock.totalReferences,
    },
    {
      label: "Disponibles",
      value: availableReferences,
    },
    {
      label: "Sous le seuil",
      value: stock.lowStockReferences,
    },
    {
      label: "Indisponibles",
      value: stock.stockouts,
    },
    {
      label: "Précision inventaire",
      value: `${stock.inventoryAccuracy}%`,
    },
    {
      label: "Disponibilité",
      value: `${availabilityRate}%`,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-cyan-400/20 bg-slate-950 p-5 text-white shadow-xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
          Module stock · Démo live
        </p>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight lg:text-4xl">
              Pilotage du stock
            </h1>

            <p className="mt-4 max-w-2xl text-slate-300">
              Les indicateurs évoluent avec la journée simulée OrganIA.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4">
            <p className="text-sm text-slate-400">
              Statut stock
            </p>

            <p className="text-2xl font-bold text-emerald-400">
              Simulation synchronisée
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
            <p className="text-sm font-medium text-slate-700">
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
            Disponibilité globale
          </h2>

          <p className="mt-1 text-sm font-medium text-slate-700">
            État calculé depuis le moteur de simulation.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-700">
                Références
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-950">
                {stock.totalReferences}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-700">
                Sous le seuil
              </p>

              <p className="mt-2 text-3xl font-bold text-orange-500">
                {stock.lowStockReferences}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-700">
                Disponibles
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {availableReferences}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700">
                Taux de disponibilité
              </p>

              <p className="text-3xl font-bold text-slate-950">
                {availabilityRate}%
              </p>
            </div>

            <div className="mt-4 h-4 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-cyan-500 transition-all"
                style={{
                  width: `${Math.min(100, availabilityRate)}%`,
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
            Surveillance du stock
          </h2>

          <div
            className={`mt-5 rounded-2xl border p-4 ${
              hasRisk
                ? "border-orange-500/20 bg-orange-500/10"
                : "border-emerald-500/20 bg-emerald-500/10"
            }`}
          >
            <p className={hasRisk ? "text-orange-300" : "text-emerald-300"}>
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
        <h2 className="text-xl font-bold text-slate-950">
          Risques de rupture
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 p-5">
            <p className="text-sm font-medium text-slate-700">
              Références suivies
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-950">
              {stock.totalReferences}
            </p>
          </div>

          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
            <p className="text-sm text-orange-700">
              Sous le seuil
            </p>
            <p className="mt-2 text-3xl font-bold text-orange-600">
              {stock.lowStockReferences}
            </p>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm text-red-700">
              Indisponibles
            </p>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {stock.stockouts}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function StockModeContent() {
  const simulation = useSimulationV2();

  if (simulation.running) {
    return <StockDemoState />;
  }

  return <StockRealData />;
}
