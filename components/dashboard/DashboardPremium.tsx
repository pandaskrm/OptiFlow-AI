import AIRecommendation from "../ui/AIRecommendation";
import ProgressCard from "../ui/ProgressCard";
import CommandCenter from "./CommandCenter";
import DashboardHeader from "./DashboardHeader";
import KpiCard from "./KpiCard";
import OrdersChart from "./OrdersChart";
import WarehouseAiAnalysis from "./WarehouseAiAnalysis";
import { getDailyRecommendations } from "../../lib/ai";
import {
  getPriorityAlert,
  getWarehouseHealth,
} from "../../lib/ai/recommendations";
import { getDashboardService } from "../../lib/dashboard/dashboardService";

export default async function DashboardPremium() {
  const data = await getDashboardService();

  const recommendations = getDailyRecommendations();
  const health = getWarehouseHealth();
  const priority = getPriorityAlert();

  return (
    <>
          <DashboardHeader />
          
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <KpiCard title="Commandes" value="486" trend="+12%" progress={86} />
        <KpiCard title="Expéditions" value="32" trend="+8%" progress={74} />

        <KpiCard
          title="Réceptions"
          value={String(data.receptions.totalReceptions)}
          trend={`${data.receptions.pendingReceptions} en attente`}
          progress={65}
        />

        <KpiCard title="Service" value="97%" trend="+3%" progress={97} />
        <KpiCard title="Productivité" value="91%" trend="+14%" progress={91} />
        <KpiCard
          title="Santé dépôt"
          value={`${data.warehouse.health.score}%`}
          trend={data.warehouse.health.status}
          progress={data.warehouse.health.score}
        />
      </div>

      <div className="mb-8">
        <CommandCenter />
      </div>

      <div className="mb-8">
        <WarehouseAiAnalysis />
      </div>

      <div className="bg-slate-900 border border-blue-900 rounded-2xl p-6 mb-8">
        <h2 className="text-2xl font-bold mb-3">🧠 Centre de Commande IA</h2>

        <p className="text-green-400 font-bold">
          État de l'entrepôt : {health.status} — {health.score}%
        </p>

        <p className="text-gray-300 mt-2">{health.message}</p>

        <div className="mt-5 rounded-xl bg-slate-800 border border-orange-500 p-4">
          <p className="text-orange-400 font-bold">{priority.level}</p>
          <h3 className="text-xl font-bold text-white mt-1">{priority.title}</h3>
          <p className="text-gray-300 mt-2">{priority.message}</p>
          <p className="text-blue-400 font-bold mt-3">
            Gain estimé : {priority.estimatedGain}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <OrdersChart />

          <ProgressCard title="Préparation" value={78} />
          <ProgressCard title="Expédition" value={92} />
          <ProgressCard title="Réception" value={65} />

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-6">
            <h2 className="text-2xl font-bold mb-5">🤖 Recommandations de l'IA</h2>

            <div className="space-y-4">
              {recommendations.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-slate-800 p-4 border border-slate-700"
                >
                  <h3 className="font-bold text-blue-400">{item.title}</h3>
                  <p className="text-gray-300 mt-1">{item.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <AIRecommendation
          title="Conseil IA du jour"
          message="Les commandes Chronopost représentent 41 % du volume aujourd'hui. Je recommande d'automatiser les impressions par vague et de renforcer l'allée 12."
          gain="1 h 18"
        />
      </div>
    </>
  );
}