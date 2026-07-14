"use client";

import useDemo from "../../hooks/useDemo";
import useWarehouseSummary from "../../hooks/useWarehouseSummary";

import ExecutiveHero from "./ExecutiveHero";
import ExecutiveStats from "./ExecutiveStats";
import ExecutiveHealthScore from "./ExecutiveHealthScore";
import ExecutiveOperations from "./ExecutiveOperations";
import ExecutiveAi from "./ExecutiveAi";
import ExecutiveDecisions from "./ExecutiveDecisions";

function ExecutiveRealData() {
  const {
    data: warehouse,
    loading,
    error,
  } = useWarehouseSummary();

  const hasData = warehouse.dataConnected;

  const cards = [
    {
      label: "Santé entrepôt",
      value: `${warehouse.healthScore}/100`,
    },
    {
      label: "Taux de service",
      value: `${warehouse.performance.service}%`,
    },
    {
      label: "Productivité",
      value: `${warehouse.performance.productivity}`,
    },
    {
      label: "Alertes",
      value: String(warehouse.alerts.length),
    },
    {
      label: "Réceptions",
      value: String(warehouse.receptions.total),
    },
    {
      label: "Préparations",
      value: String(warehouse.orders.total),
    },
    {
      label: "Expéditions",
      value: String(warehouse.shipments.total),
    },
    {
      label: "Retards",
      value: String(warehouse.receptions.late),
    },
  ];

  const operations = [
    {
      label: "Réception",
      value: warehouse.performance.reception,
      detail: `${warehouse.receptions.completed}/${warehouse.receptions.total} terminées`,
    },
    {
      label: "Préparation",
      value: warehouse.performance.preparation,
      detail: `${warehouse.orders.preparedLines}/${warehouse.orders.totalLines} lignes préparées`,
    },
    {
      label: "Expédition",
      value: warehouse.performance.shipping,
      detail: `${warehouse.shipments.shipped}/${warehouse.shipments.total} expédiées`,
    },
  ];

  const workforceCards = [
    {
      label: "Collaborateurs",
      value: warehouse.workforce.total,
    },
    {
      label: "Présents",
      value: warehouse.workforce.present,
    },
    {
      label: "Absents",
      value: warehouse.workforce.absent,
    },
    {
      label: "Renforts",
      value: warehouse.workforce.reinforcement,
    },
  ];

  const stockCards = [
    {
      label: "Références",
      value: warehouse.inventory.references,
    },
    {
      label: "Stock disponible",
      value: warehouse.inventory.availableQuantity,
    },
    {
      label: "Stock réservé",
      value: warehouse.inventory.reservedQuantity,
    },
    {
      label: "Sous le seuil",
      value: warehouse.inventory.lowStockReferences,
    },
  ];

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-10 text-center text-slate-400">
        Chargement de la Vue Direction...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-900 bg-red-950/30 p-10 text-center text-red-300">
        Impossible de charger les données de la Direction.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-3xl border border-white/10 bg-slate-950 p-8 text-white shadow-2xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
          Vue Direction
        </p>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight lg:text-5xl">
              Santé globale de l’exploitation
            </h1>

            <p className="mt-4 max-w-3xl text-slate-300">
              Synthèse en temps réel des réceptions, préparations,
              expéditions, stocks, équipes et priorités opérationnelles.
            </p>
          </div>

          <div
            className={`rounded-2xl border px-5 py-4 ${
              hasData
                ? "border-emerald-500/30 bg-emerald-500/10"
                : "border-slate-600 bg-slate-800"
            }`}
          >
            <p className="text-sm text-slate-400">
              Statut global
            </p>

            <p
              className={`mt-1 text-2xl font-bold ${
                hasData
                  ? "text-emerald-400"
                  : "text-slate-300"
              }`}
            >
              {hasData
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

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
            Score global
          </p>

          <div className="mt-6 flex items-center justify-center">
            <div className="flex h-52 w-52 items-center justify-center rounded-full border-[18px] border-cyan-100">
              <div className="text-center">
                <p className="text-5xl font-bold text-slate-950">
                  {warehouse.healthScore}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  sur 100
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {[
              {
                label: "Productivité",
                value: warehouse.performance.productivity,
              },
              {
                label: "Service",
                value: warehouse.performance.service,
              },
              {
                label: "Réception",
                value: warehouse.performance.reception,
              },
              {
                label: "Expédition",
                value: warehouse.performance.shipping,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-xl bg-slate-50 p-3"
              >
                <span className="text-sm text-slate-600">
                  {item.label}
                </span>

                <span className="font-bold text-slate-950">
                  {item.value}
                  {item.label === "Productivité" ? "" : "%"}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-950">
              Performance opérationnelle
            </h2>

            <p className="text-sm text-slate-500">
              Consolidation automatique des flux ERP.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {operations.map((operation) => (
              <div
                key={operation.label}
                className="rounded-2xl bg-slate-50 p-5"
              >
                <p className="text-sm text-slate-500">
                  {operation.label}
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-950">
                  {operation.value}%
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  {operation.detail}
                </p>

                <div className="mt-4 h-3 rounded-full bg-slate-200">
                  <div
                    className="h-3 rounded-full bg-cyan-500 transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        operation.value
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-5">
              <p className="text-sm font-semibold text-slate-500">
                Planning réception
              </p>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <div>
                  <p className="text-2xl font-bold text-slate-950">
                    {warehouse.receptions.scheduledToday}
                  </p>
                  <p className="text-xs text-slate-500">
                    Aujourd’hui
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-slate-950">
                    {warehouse.receptions.scheduledTomorrow}
                  </p>
                  <p className="text-xs text-slate-500">
                    Demain
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-red-500">
                    {warehouse.receptions.late}
                  </p>
                  <p className="text-xs text-slate-500">
                    En retard
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5">
              <p className="text-sm font-semibold text-slate-500">
                Quais et palettes
              </p>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <div>
                  <p className="text-2xl font-bold text-slate-950">
                    {warehouse.receptions.occupiedDocks}/6
                  </p>
                  <p className="text-xs text-slate-500">
                    Quais occupés
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-slate-950">
                    {warehouse.receptions.totalPallets}
                  </p>
                  <p className="text-xs text-slate-500">
                    Palettes prévues
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-emerald-600">
                    {warehouse.receptions.receivedPallets}
                  </p>
                  <p className="text-xs text-slate-500">
                    Réceptionnées
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">
            Équipes
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Présence et capacité opérationnelle.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-4">
            {workforceCards.map((card) => (
              <div
                key={card.label}
                className="rounded-2xl bg-slate-50 p-4"
              >
                <p className="text-sm text-slate-500">
                  {card.label}
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-950">
                  {card.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">
            Stock
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Disponibilité et risques de rupture.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-4">
            {stockCards.map((card) => (
              <div
                key={card.label}
                className="rounded-2xl bg-slate-50 p-4"
              >
                <p className="text-sm text-slate-500">
                  {card.label}
                </p>

                <p className="mt-2 text-2xl font-bold text-slate-950">
                  {card.value}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-6 text-white shadow-xl">
          <h2 className="text-xl font-bold">
            IA Direction
          </h2>

          <p className="mt-2 text-sm text-slate-300">
            Analyse consolidée de l’exploitation.
          </p>

          <div className="mt-5 space-y-3">
            {warehouse.alerts.length > 0 ? (
              warehouse.alerts.slice(0, 5).map((alert) => (
                <div
                  key={alert}
                  className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100"
                >
                  {alert}
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                Aucune alerte critique détectée.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-6 text-white shadow-xl">
          <h2 className="text-xl font-bold">
            Décisions prioritaires
          </h2>

          <p className="mt-2 text-sm text-slate-300">
            Actions proposées à partir des données ERP.
          </p>

          <div className="mt-5 space-y-3">
            {warehouse.priorities.length > 0 ? (
              warehouse.priorities
                .slice(0, 5)
                .map((priority, index) => (
                  <div
                    key={priority}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                      Priorité {index + 1}
                    </p>

                    <p className="mt-2 text-sm text-slate-200">
                      {priority}
                    </p>
                  </div>
                ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-slate-400">
                Aucune décision prioritaire actuellement.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function ExecutiveModeContent() {
  const demo = useDemo();

  if (!demo.running) {
    return <ExecutiveRealData />;
  }

  return (
    <div className="flex flex-col gap-6">
      <ExecutiveHero />
      <ExecutiveStats />

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <ExecutiveHealthScore />
        <ExecutiveOperations />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ExecutiveAi />
        <ExecutiveDecisions />
      </div>
    </div>
  );
}