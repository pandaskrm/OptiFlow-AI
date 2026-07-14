"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import useDemo from "../../hooks/useDemo";
import useWarehouseSummary from "../../hooks/useWarehouseSummary";
import AIRecommendation from "../ui/AIRecommendation";
import ProgressCard from "../ui/ProgressCard";

const demoOrders = [
  { day: "Lun", commandes: 486 },
  { day: "Mar", commandes: 520 },
  { day: "Mer", commandes: 498 },
  { day: "Jeu", commandes: 610 },
  { day: "Ven", commandes: 575 },
  { day: "Sam", commandes: 320 },
  { day: "Dim", commandes: 210 },
];

const emptyOrders = [
  { day: "Lun", commandes: 0 },
  { day: "Mar", commandes: 0 },
  { day: "Mer", commandes: 0 },
  { day: "Jeu", commandes: 0 },
  { day: "Ven", commandes: 0 },
  { day: "Sam", commandes: 0 },
  { day: "Dim", commandes: 0 },
];

export default function DashboardLiveContent() {
  const demo = useDemo();

  const {
    data: warehouse,
    loading,
    error,
  } = useWarehouseSummary();

  const trucksWaiting = demo.running
    ? demo.state.trucksWaiting
    : warehouse.receptions.planned;

  const occupiedDocks = demo.running
    ? demo.state.occupiedDocks
    : warehouse.receptions.occupiedDocks;

  const activeReceptions = demo.running
    ? demo.state.activeReceptions
    : warehouse.receptions.active;

  const completedToday = demo.running
    ? demo.state.completedToday
    : warehouse.receptions.completed;

  const health = demo.running
    ? demo.state.warehouseHealth
    : warehouse.healthScore;

  const alerts = demo.running
    ? ["Surveiller la disponibilité des quais."]
    : warehouse.alerts;

  const priorities = demo.running
    ? ["Anticiper les prochaines arrivées."]
    : warehouse.priorities;

  const ordersData = demo.running
    ? demoOrders
    : emptyOrders;

  const hasRealData =
    warehouse.receptions.total > 0;

  const sourceLabel = demo.running
    ? "Simulation active"
    : loading
      ? "Actualisation des données..."
      : error
        ? "Données indisponibles"
        : hasRealData
          ? "Données réelles synchronisées"
          : "En attente de données ERP";

  const receptionProgress =
    warehouse.receptions.total > 0
      ? Math.round(
          (warehouse.receptions.completed /
            warehouse.receptions.total) *
            100
        )
      : 0;

  const actions = [
    {
      icon: "🚛",
      title: `${trucksWaiting} camion${
        trucksWaiting > 1 ? "s" : ""
      } en attente`,
      priority:
        trucksWaiting >= 5
          ? "Priorité haute"
          : trucksWaiting > 0
            ? "À planifier"
            : "Stable",
      color:
        trucksWaiting >= 5
          ? "border-orange-500"
          : "border-cyan-500",
    },
    {
      icon: "🚪",
      title: `${occupiedDocks}/6 quais occupés`,
      priority:
        occupiedDocks >= 5
          ? "Critique"
          : occupiedDocks > 0
            ? "Temps réel"
            : "Disponible",
      color:
        occupiedDocks >= 5
          ? "border-red-500"
          : "border-emerald-500",
    },
    {
      icon: "📦",
      title: `${activeReceptions} réception${
        activeReceptions > 1 ? "s" : ""
      } active${activeReceptions > 1 ? "s" : ""}`,
      priority:
        activeReceptions >= 10
          ? "Volume élevé"
          : activeReceptions > 0
            ? "En cours"
            : "Aucune activité",
      color: "border-cyan-500",
    },
    {
      icon: "✅",
      title: `${completedToday} opération${
        completedToday > 1 ? "s" : ""
      } terminée${completedToday > 1 ? "s" : ""}`,
      priority:
        completedToday > 0
          ? "Réception validée"
          : "Aucune opération",
      color: "border-emerald-500",
    },
  ];

  const mainAlert =
    alerts[0] ??
    (hasRealData
      ? "Aucune alerte critique détectée."
      : "Aucune alerte disponible.");

  const mainPriority =
    priorities[0] ??
    (hasRealData
      ? "Maintenir le suivi des opérations."
      : "Aucune priorité disponible.");

  const aiAdvice = demo.running
    ? "Répartir les ressources selon l’occupation simulée."
    : occupiedDocks >= 5
      ? "Accélérer la libération d’un quai pour éviter une saturation."
      : trucksWaiting > 0
        ? "Préparer les quais disponibles pour les prochaines réceptions."
        : hasRealData
          ? "L’activité est stable. Maintenir le suivi des réceptions."
          : "Connectez une source ERP ou créez une réception.";

  return (
    <>
      <section className="mb-8 rounded-xl border border-cyan-900 bg-[#081422] p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-cyan-400">
              Centre de pilotage
            </p>

            <h2 className="mt-1 text-2xl font-bold text-white">
              Poste de commandement
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              {sourceLabel}
            </p>
          </div>

          <div
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              hasRealData || demo.running
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-slate-800 text-slate-400"
            }`}
          >
            IA{" "}
            {hasRealData || demo.running
              ? "ACTIVE"
              : "EN ATTENTE"}{" "}
            · {health}%
          </div>
        </div>

        <div className="mb-5 h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-cyan-400 transition-all duration-500"
            style={{ width: `${health}%` }}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {actions.map((action) => (
            <div
              key={action.title}
              className={`rounded-lg border-l-4 ${action.color} bg-[#0d1d31] p-4 transition hover:scale-[1.01]`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">
                  {action.icon}
                </span>

                <span className="rounded bg-slate-800 px-2 py-1 text-xs text-cyan-300">
                  {action.priority}
                </span>
              </div>

              <p className="mt-4 font-medium text-white">
                {action.title}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-sm font-semibold text-blue-400">
          Analyse IA
        </p>

        <h2 className="mt-1 text-2xl font-bold text-white">
          Santé de l’entrepôt : {health} %
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Statut : {sourceLabel}
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-red-900 bg-red-950/30 p-4">
            <h3 className="mb-2 font-semibold text-red-400">
              Alertes
            </h3>

            <p className="text-sm text-slate-300">
              {mainAlert}
            </p>
          </div>

          <div className="rounded-xl border border-emerald-900 bg-emerald-950/30 p-4">
            <h3 className="mb-2 font-semibold text-emerald-400">
              Priorités
            </h3>

            <p className="text-sm text-slate-300">
              {mainPriority}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-slate-800 p-4">
          <h3 className="mb-1 font-semibold text-white">
            Conseil IA
          </h3>

          <p className="text-sm text-slate-300">
            {aiAdvice}
          </p>
        </div>

        <p className="mt-4 text-sm font-medium text-slate-300">
          Palettes enregistrées :{" "}
          {demo.running
            ? "Données simulées"
            : warehouse.receptions.totalPallets}
        </p>

        <p className="mt-1 text-sm font-medium text-slate-300">
          Palettes réceptionnées :{" "}
          {demo.running
            ? "Données simulées"
            : warehouse.receptions.receivedPallets}
        </p>
      </section>

      <section className="mb-8 rounded-2xl border border-blue-900 bg-slate-900 p-6">
        <h2 className="text-2xl font-bold text-white">
          🤖 Centre de commande IA
        </h2>

        <p
          className={`mt-3 font-bold ${
            hasRealData || demo.running
              ? "text-green-400"
              : "text-slate-400"
          }`}
        >
          État de l’entrepôt : {health} %
        </p>

        <p className="mt-2 text-gray-300">
          {hasRealData || demo.running
            ? "OptiFlow AI analyse les données opérationnelles."
            : "Aucune donnée opérationnelle disponible."}
        </p>

        <div className="mt-5 rounded-xl border border-slate-700 bg-slate-800 p-4">
          <p className="font-bold text-orange-400">
            {alerts.length > 0
              ? "PRIORITÉ À SURVEILLER"
              : "ACTIVITÉ STABLE"}
          </p>

          <h3 className="mt-1 text-xl font-bold text-white">
            {mainPriority}
          </h3>

          <p className="mt-2 text-gray-300">
            {aiAdvice}
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">
                📈 Évolution des commandes
              </h2>

              <p className="text-sm text-slate-400">
                {demo.running
                  ? "Volume simulé sur les 7 derniers jours"
                  : "Les commandes seront alimentées par le flux ERP"}
              </p>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ordersData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                  />

                  <XAxis
                    dataKey="day"
                    stroke="#94a3b8"
                  />

                  <YAxis stroke="#94a3b8" />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#020617",
                      border: "1px solid #1e293b",
                      borderRadius: "12px",
                      color: "#ffffff",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="commandes"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <ProgressCard
            title="Préparation"
            value={demo.running ? 78 : 0}
          />

          <ProgressCard
            title="Expédition"
            value={demo.running ? 92 : 0}
          />

          <ProgressCard
            title="Réception"
            value={
              demo.running ? 65 : receptionProgress
            }
          />

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-5 text-2xl font-bold text-white">
              🤖 Recommandations de l’IA
            </h2>

            {hasRealData || demo.running ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
                  <h3 className="font-bold text-blue-400">
                    Priorité opérationnelle
                  </h3>

                  <p className="mt-1 text-gray-300">
                    {mainPriority}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
                  <h3 className="font-bold text-blue-400">
                    Analyse des quais
                  </h3>

                  <p className="mt-1 text-gray-300">
                    {occupiedDocks}/6 quais sont actuellement
                    occupés.
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-700 bg-slate-800/50 p-6 text-center text-slate-400">
                Aucune recommandation disponible.
              </div>
            )}
          </div>
        </div>

        <AIRecommendation
          title="Conseil IA du jour"
          message={aiAdvice}
          gain={
            hasRealData || demo.running
              ? "Suivi actif"
              : "0 min"
          }
        />
      </div>
    </>
  );
}