import MainLayout from "../../components/layout/MainLayout";
import StatCard from "../../components/ui/StatCard";
import AIRecommendation from "../../components/ui/AIRecommendation";
import ProgressCard from "../../components/ui/ProgressCard";

export default function DashboardPage() {
  return (
    <MainLayout>
      <h1 className="text-4xl font-bold mb-2">Bonjour Kevin 👋</h1>
      <p className="text-gray-400 mb-8">
        Voici le résumé intelligent de votre activité logistique aujourd'hui.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard icon="📦" title="Commandes du jour" value="486" subtitle="+12%" color="text-blue-500" />
        <StatCard icon="🚚" title="Expéditions" value="32" subtitle="Aujourd'hui" color="text-green-500" />
        <StatCard icon="👥" title="Collaborateurs" value="55" subtitle="Actifs" color="text-orange-400" />
        <StatCard icon="📈" title="Productivité" value="97%" subtitle="+27%" color="text-purple-500" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-6">
          <ProgressCard title="Préparation" value={78} />
          <ProgressCard title="Expédition" value={92} />
          <ProgressCard title="Réception" value={65} />
        </div>

        <AIRecommendation
          title="Conseil IA du jour"
          message="Les commandes Chronopost représentent 41% du volume aujourd'hui. Je recommande d'automatiser les impressions par vague et de renforcer l'allée 12."
          gain="1 h 18"
        />
      </div>
    </MainLayout>
  );
}