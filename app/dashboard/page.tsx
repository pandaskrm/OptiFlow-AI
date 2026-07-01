import Sidebar from "../../components/Sidebar";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex">
      <Sidebar />

      <section className="flex-1 p-8">
        <h1 className="text-4xl font-bold mb-2">Bonjour Kevin 👋</h1>
        <p className="text-gray-400 mb-8">
          Voici le résumé intelligent de votre entreprise aujourd'hui.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-3xl font-bold text-blue-500">+27%</h2>
            <p className="text-gray-400">Productivité</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-3xl font-bold text-green-500">18 540 €</h2>
            <p className="text-gray-400">Économies détectées</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-3xl font-bold text-orange-400">12</h2>
            <p className="text-gray-400">Tâches prioritaires</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-3xl font-bold text-purple-500">IA</h2>
            <p className="text-gray-400">Assistant actif</p>
          </div>
        </div>

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">🤖 Recommandations IA</h2>
          <p className="text-gray-300">
            J'ai détecté 3 actions prioritaires pour améliorer votre performance aujourd'hui.
          </p>
        </section>
      </section>
    </main>
  );
}
