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

  const trucksWaiting = demo.running
    ? demo.state.trucksWaiting
    : 0;

  const occupiedDocks = demo.running
    ? demo.state.occupiedDocks
    : 0;

  const activeReceptions = demo.running
    ? demo.state.activeReceptions
    : 0;

  const completedToday = demo.running
    ? demo.state.completedToday
    : 0;

  const health = demo.running
    ? demo.state.warehouseHealth
    : 0;

  const ordersData = demo.running
    ? demoOrders
    : emptyOrders;

  const actions = [
    {
      icon: "🚛",
      title: `${trucksWaiting} camion${
        trucksWaiting > 1 ? "s" : ""
      } en attente`,
      priority: demo.running ? "Suivi" : "Aucune donnée",
    },
    {
      icon: "🚪",
      title: `${occupiedDocks}/6 quais occupés`,
      priority: demo.running ? "Temps réel" : "Aucune donnée",
    },
    {
      icon: "📦",
      title: `${activeReceptions} réception${
        activeReceptions > 1 ? "s" : ""
      } active${activeReceptions > 1 ? "s" : ""}`,
      priority: demo.running ? "Suivi" : "Aucune donnée",
    },
    {
      icon: "✅",
      title: `${completedToday} opération${
        completedToday > 1 ? "s" : ""
      } terminée${completedToday > 1 ? "s" : ""}`,
      priority: demo.running ? "Aujourd'hui" : "Aucune donnée",
    },
  ];

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
              {demo.running
                ? "Vue en temps réel de l'activité simulée."
                : "Aucune activité sans ERP ou mode Démo."}
            </p>
          </div>

          <div
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              demo.running
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-slate-800 text-slate-400"
            }`}
          >
            IA {demo.running ? "ACTIVE" : "EN ATTENTE"} · {health}%
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
              className="rounded-lg border-l-4 border-cyan-500 bg-[#0d1d31] p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{action.icon}</span>

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
          Santé de l'entrepôt : {health} %
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          Statut : {demo.running ? "Simulation active" : "En attente"}
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-red-900 bg-red-950/30 p-4">
            <h3 className="mb-2 font-semibold text-red-400">
              Alertes
            </h3>

            <p className="text-sm text-slate-300">
              {demo.running
                ? "Surveiller la disponibilité des quais."
                : "Aucune alerte disponible."}
            </p>
          </div>

          <div className="rounded-xl border border-emerald-900 bg-emerald-950/30 p-4">
            <h3 className="mb-2 font-semibold text-emerald-400">
              Priorités
            </h3>

            <p className="text-sm text-slate-300">
              {demo.running
                ? "Anticiper les prochaines arrivées."
                : "Aucune priorité disponible."}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-slate-800 p-4">
          <h3 className="mb-1 font-semibold text-white">
            Conseil IA
          </h3>

          <p className="text-sm text-slate-300">
            {demo.running
              ? "Répartir les ressources selon l'occupation simulée."
              : "Connectez un ERP ou lancez le mode Démo."}
          </p>
        </div>

        <p className="mt-4 text-sm font-medium text-slate-300">
          Productivité : {demo.running ? "91 %" : "0 %"}
        </p>
      </section>

      <section className="mb-8 rounded-2xl border border-blue-900 bg-slate-900 p-6">
        <h2 className="text-2xl font-bold text-white">
          🧠 Centre de commande IA
        </h2>

        <p
          className={`mt-3 font-bold ${
            demo.running
              ? "text-green-400"
              : "text-slate-400"
          }`}
        >
          État de l'entrepôt : {health} %
        </p>

        <p className="mt-2 text-gray-300">
          {demo.running
            ? "OptiFlow AI analyse l'activité simulée."
            : "Aucune donnée opérationnelle disponible."}
        </p>

        <div className="mt-5 rounded-xl border border-slate-700 bg-slate-800 p-4">
          <p className="font-bold text-orange-400">
            {demo.running ? "PRIORITÉ MOYENNE" : "AUCUNE ALERTE"}
          </p>

          <h3 className="mt-1 text-xl font-bold text-white">
            {demo.running
              ? "Optimiser les quais"
              : "En attente de données"}
          </h3>

          <p className="mt-2 text-gray-300">
            {demo.running
              ? "Anticiper les prochaines arrivées transporteurs."
              : "Aucune décision ne peut être proposée."}
          </p>

          <p className="mt-3 font-bold text-blue-400">
            Gain estimé : {demo.running ? "1 h 18" : "0 min"}
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
                  : "Aucune commande disponible"}
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
            value={demo.running ? 65 : 0}
          />

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-5 text-2xl font-bold text-white">
              🤖 Recommandations de l'IA
            </h2>

            {demo.running ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
                  <h3 className="font-bold text-blue-400">
                    Optimiser les ressources
                  </h3>

                  <p className="mt-1 text-gray-300">
                    Renforcer temporairement la zone prioritaire.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
                  <h3 className="font-bold text-blue-400">
                    Anticiper les quais
                  </h3>

                  <p className="mt-1 text-gray-300">
                    Préparer un quai avant la prochaine arrivée.
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
          message={
            demo.running
              ? "Le mode Démo est actif. OptiFlow AI analyse actuellement les données simulées."
              : "Connectez votre ERP ou lancez le mode Démo pour recevoir un conseil."
          }
          gain={demo.running ? "1 h 18" : "0 min"}
        />
      </div>
    </>
  );
}