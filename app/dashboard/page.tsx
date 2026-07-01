import MainLayout from "../../components/layout/MainLayout";
import StatCard from "../../components/ui/StatCard";
import AIRecommendation from "../../components/ui/AIRecommendation";
import ProgressCard from "../../components/ui/ProgressCard";
import { getDailyRecommendations } from "../../lib/ai";

export default function DashboardPage() {
  const recommendations = getDailyRecommendations();

  return (
    <MainLayout>
      <h1 className="text-4xl font-bold mb-2">
        Bonjour Kevin 👋
      </h1>

      <p className="text-gray-400 mb-8">
        Voici le résumé intelligent de votre activité logistique aujourd'hui.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon="📦"
          title="Commandes du jour"
          value="486"
          subtitle="+12%"
          color="text-blue-500"
        />

        <StatCard
          icon="🚚"
          title="Expéditions"
          value="32"
          subtitle="Aujourd'hui"
          color="text-green-500"
        />

        <StatCard
          icon="👥"
          title="Collaborateurs"
          value="55"
          subtitle="Actifs"
          color="text-orange-400"
        />

        <StatCard
          icon="📈"
          title="Productivité"
          value="97%"
          subtitle="+27%"
          color="text-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        <div className="xl:col-span-2 space-y-6">

          <ProgressCard title="Préparation" value={78} />

          <ProgressCard title="Expédition" value={92} />

          <ProgressCard title="Réception" value={65} />

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-6">
            <h2 className="text-2xl font-bold mb-5">
              🤖 Recommandations de l'IA
            </h2>

            <div className="space-y-4">
              {recommendations.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-slate-800 p-4 border border-slate-700"
                >
                  <h3 className="font-bold text-blue-400">
                    {item.title}
                  </h3>

                  <p className="text-gray-300 mt-1">
                    {item.message}
                  </p>
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
    </MainLayout>
  );
}