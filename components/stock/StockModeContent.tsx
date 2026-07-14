"use client";

import useDemo from "../../hooks/useDemo";
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
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-10 text-center text-slate-400">
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
      <section className="rounded-3xl border border-white/10 bg-slate-950 p-8 text-white shadow-2xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
          Module stock
        </p>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight lg:text-5xl">
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
            <p className="text-sm text-slate-400">
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
            Disponibilité globale
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Répartition calculée depuis les données de stock ERP.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Total
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-950">
                {inventory.totalQuantity}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Réservé
              </p>

              <p className="mt-2 text-3xl font-bold text-orange-500">
                {inventory.reservedQuantity}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">
                Disponible
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {inventory.availableQuantity}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">
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

        <p className="mt-1 text-sm text-slate-500">
          Synthèse des références nécessitant une action.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">
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
  return (
    <div className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-10 text-center text-white">
      <h1 className="text-3xl font-bold">
        Mode Démo Stock
      </h1>

      <p className="mt-4 text-slate-300">
        Les données simulées du Stock seront enrichies dans un prochain sprint.
      </p>
    </div>
  );
}

export default function StockModeContent() {
  const demo = useDemo();

  if (demo.running) {
    return <StockDemoState />;
  }

  return <StockRealData />;
}