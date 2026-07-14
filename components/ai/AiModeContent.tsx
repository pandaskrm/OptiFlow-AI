"use client";

import useDemo from "../../hooks/useDemo";
import useWarehouseSummary from "../../hooks/useWarehouseSummary";

type DecisionLevel = "Critique" | "Haute" | "Moyenne" | "Stable";

type Decision = {
  title: string;
  description: string;
  level: DecisionLevel;
  source: string;
};

function getDecisionStyle(level: DecisionLevel) {
  if (level === "Critique") {
    return "border-red-500/30 bg-red-500/10 text-red-300";
  }

  if (level === "Haute") {
    return "border-orange-500/30 bg-orange-500/10 text-orange-300";
  }

  if (level === "Moyenne") {
    return "border-cyan-500/30 bg-cyan-500/10 text-cyan-300";
  }

  return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
}

function AiRealData() {
  const {
    data: warehouse,
    loading,
    error,
  } = useWarehouseSummary();

  const decisions: Decision[] = [];

  if (warehouse.receptions.late > 0) {
    decisions.push({
      title: "Réceptions en retard",
      description: `${warehouse.receptions.late} réception${
        warehouse.receptions.late > 1 ? "s sont" : " est"
      } en retard. Vérifier immédiatement les créneaux et les transporteurs.`,
      level: "Critique",
      source: "Réception",
    });
  }

  if (warehouse.receptions.occupiedDocks >= 5) {
    decisions.push({
      title: "Risque de saturation des quais",
      description: `${warehouse.receptions.occupiedDocks}/6 quais sont occupés. Prioriser la libération d’un quai.`,
      level: "Critique",
      source: "Quais",
    });
  }

  if (warehouse.orders.priority > 0) {
    decisions.push({
      title: "Commandes prioritaires",
      description: `${warehouse.orders.priority} commande${
        warehouse.orders.priority > 1 ? "s prioritaires doivent" : " prioritaire doit"
      } être traitée rapidement.`,
      level: "Haute",
      source: "Préparation",
    });
  }

  if (warehouse.shipments.waiting > 0) {
    decisions.push({
      title: "Expéditions en attente",
      description: `${warehouse.shipments.waiting} expédition${
        warehouse.shipments.waiting > 1 ? "s sont" : " est"
      } encore en attente de traitement.`,
      level: "Haute",
      source: "Expédition",
    });
  }

  if (warehouse.inventory.unavailableReferences > 0) {
    decisions.push({
      title: "Références indisponibles",
      description: `${warehouse.inventory.unavailableReferences} référence${
        warehouse.inventory.unavailableReferences > 1 ? "s sont" : " est"
      } sans stock disponible.`,
      level: "Critique",
      source: "Stock",
    });
  }

  if (warehouse.inventory.lowStockReferences > 0) {
    decisions.push({
      title: "Stock sous seuil",
      description: `${warehouse.inventory.lowStockReferences} référence${
        warehouse.inventory.lowStockReferences > 1 ? "s sont" : " est"
      } sous le seuil minimum.`,
      level: "Haute",
      source: "Stock",
    });
  }

  if (warehouse.workforce.absent > 0) {
    decisions.push({
      title: "Absences à compenser",
      description: `${warehouse.workforce.absent} collaborateur${
        warehouse.workforce.absent > 1 ? "s sont" : " est"
      } absent. Rééquilibrer les ressources disponibles.`,
      level: "Haute",
      source: "Équipe",
    });
  }

  if (
    warehouse.dataConnected &&
    warehouse.performance.preparation < 80 &&
    warehouse.orders.total > 0
  ) {
    decisions.push({
      title: "Préparation sous objectif",
      description: `L’avancement préparation est de ${warehouse.performance.preparation} %. Affecter des ressources supplémentaires aux commandes en attente.`,
      level: "Moyenne",
      source: "Préparation",
    });
  }

  if (
    warehouse.dataConnected &&
    warehouse.performance.shipping < 80 &&
    warehouse.shipments.total > 0
  ) {
    decisions.push({
      title: "Expédition sous objectif",
      description: `L’avancement expédition est de ${warehouse.performance.shipping} %. Vérifier les départs et la disponibilité des quais.`,
      level: "Moyenne",
      source: "Expédition",
    });
  }

  if (warehouse.dataConnected && decisions.length === 0) {
    decisions.push({
      title: "Activité stable",
      description:
        "Aucune anomalie majeure détectée. Maintenir le suivi des opérations.",
      level: "Stable",
      source: "Global",
    });
  }

  const cards = [
    {
      label: "Santé dépôt",
      value: `${warehouse.healthScore}%`,
    },
    {
      label: "Alertes actives",
      value: warehouse.alerts.length,
    },
    {
      label: "Priorités",
      value: warehouse.priorities.length,
    },
    {
      label: "Réceptions",
      value: warehouse.receptions.total,
    },
    {
      label: "Commandes",
      value: warehouse.orders.total,
    },
    {
      label: "Expéditions",
      value: warehouse.shipments.total,
    },
  ];

  const performanceCards = [
    {
      label: "Réception",
      value: warehouse.performance.reception,
    },
    {
      label: "Préparation",
      value: warehouse.performance.preparation,
    },
    {
      label: "Expédition",
      value: warehouse.performance.shipping,
    },
    {
      label: "Service",
      value: warehouse.performance.service,
    },
  ];

  const globalSummary = warehouse.dataConnected
    ? `L’exploitation présente un score de santé de ${warehouse.healthScore} %. 
       ${warehouse.alerts.length} alerte${
         warehouse.alerts.length > 1 ? "s sont actives" : " est active"
       } et ${warehouse.priorities.length} priorité${
         warehouse.priorities.length > 1 ? "s sont proposées" : " est proposée"
       }.`
    : "Aucune donnée ERP n’est encore disponible. Connectez une source de données ou utilisez le Mode Démo.";

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-950 p-10 text-center text-slate-400">
        Chargement du centre de décision IA...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-900 bg-red-950/30 p-10 text-center text-red-300">
        Impossible de charger les données du module IA.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-8 text-white shadow-2xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
          Centre de décision
        </p>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight lg:text-5xl">
              IA OptiFlow
            </h1>

            <p className="mt-4 max-w-3xl text-slate-300">
              Analyse centralisée des réceptions, commandes, expéditions,
              stocks, équipes et performances opérationnelles.
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
              Statut de l’analyse
            </p>

            <p
              className={`mt-1 text-2xl font-bold ${
                warehouse.dataConnected
                  ? "text-emerald-400"
                  : "text-slate-300"
              }`}
            >
              {warehouse.dataConnected
                ? "Analyse active"
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
            Brief IA du jour
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Synthèse automatique de l’exploitation.
          </p>

          <div className="mt-5 rounded-2xl bg-slate-50 p-5">
            <p className="leading-7 text-slate-700">
              {globalSummary}
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-5">
              <p className="text-sm text-slate-500">
                Réceptions aujourd’hui
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-950">
                {warehouse.receptions.scheduledToday}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5">
              <p className="text-sm text-slate-500">
                Réceptions demain
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-950">
                {warehouse.receptions.scheduledTomorrow}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5">
              <p className="text-sm text-slate-500">
                Collaborateurs présents
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {warehouse.workforce.present}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5">
              <p className="text-sm text-slate-500">
                Références sous seuil
              </p>

              <p className="mt-2 text-3xl font-bold text-orange-500">
                {warehouse.inventory.lowStockReferences}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-6 text-white shadow-xl">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300">
            Recommandation principale
          </p>

          <h2 className="mt-3 text-2xl font-bold">
            {warehouse.priorities[0] ?? "Aucune priorité critique"}
          </h2>

          <p className="mt-4 text-sm leading-6 text-slate-300">
            {warehouse.alerts[0] ??
              "L’activité est stable. Maintenir le suivi opérationnel."}
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">
              Score global
            </p>

            <p className="mt-2 text-5xl font-bold text-cyan-300">
              {warehouse.healthScore}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              sur 100
            </p>
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-950">
            Performance globale
          </h2>

          <p className="text-sm text-slate-500">
            Consolidation automatique des principaux flux.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {performanceCards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl bg-slate-50 p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  {card.label}
                </p>

                <p className="font-bold text-slate-950">
                  {card.value}%
                </p>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-cyan-500 transition-all"
                  style={{
                    width: `${Math.min(100, card.value)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-950">
            Décisions recommandées
          </h2>

          <p className="text-sm text-slate-500">
            Actions classées automatiquement par niveau de priorité.
          </p>
        </div>

        <div className="space-y-4">
          {decisions.map((decision, index) => (
            <div
              key={`${decision.title}-${index}`}
              className={`rounded-2xl border p-5 ${getDecisionStyle(
                decision.level
              )}`}
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest">
                    Priorité {index + 1} · {decision.source}
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-white">
                    {decision.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-200">
                    {decision.description}
                  </p>
                </div>

                <span className="rounded-full border border-current px-3 py-1 text-xs font-bold">
                  {decision.level}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-red-500/20 bg-slate-950 p-6 text-white shadow-xl">
          <h2 className="text-xl font-bold">
            Alertes détectées
          </h2>

          <div className="mt-5 space-y-3">
            {warehouse.alerts.length > 0 ? (
              warehouse.alerts.map((alert) => (
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
            Plan d’action recommandé
          </h2>

          <div className="mt-5 space-y-3">
            {warehouse.priorities.length > 0 ? (
              warehouse.priorities.map((priority, index) => (
                <div
                  key={priority}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                    Action {index + 1}
                  </p>

                  <p className="mt-2 text-sm text-slate-200">
                    {priority}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-slate-400">
                Aucune action prioritaire actuellement.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function AiDemoState() {
  return (
    <div className="rounded-3xl border border-cyan-400/20 bg-slate-950 p-10 text-center text-white">
      <h1 className="text-3xl font-bold">
        Mode Démo IA
      </h1>

      <p className="mt-4 text-slate-300">
        OptiFlow AI analyse actuellement les scénarios simulés du Mode Démo.
      </p>
    </div>
  );
}

export default function AiModeContent() {
  const demo = useDemo();

  if (demo.running) {
    return <AiDemoState />;
  }

  return <AiRealData />;
}