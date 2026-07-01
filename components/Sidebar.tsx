export default function Sidebar() {
  return (
    <aside className="w-72 min-h-screen bg-slate-900 border-r border-slate-800 p-6">
      <h1 className="text-2xl font-bold text-blue-500 mb-10">
        OptiFlow AI
      </h1>

      <nav className="space-y-3">
        <div className="bg-blue-600 rounded-xl px-4 py-3 font-semibold">
          🏠 Dashboard
        </div>
        <div className="text-gray-400 hover:text-white px-4 py-3 rounded-xl hover:bg-slate-800">
          📦 Commandes
        </div>
        <div className="text-gray-400 hover:text-white px-4 py-3 rounded-xl hover:bg-slate-800">
          👥 Employés
        </div>
        <div className="text-gray-400 hover:text-white px-4 py-3 rounded-xl hover:bg-slate-800">
          📊 Analyses
        </div>
        <div className="text-gray-400 hover:text-white px-4 py-3 rounded-xl hover:bg-slate-800">
          🤖 Assistant IA
        </div>
        <div className="text-gray-400 hover:text-white px-4 py-3 rounded-xl hover:bg-slate-800">
          ⚙️ Paramètres
        </div>
      </nav>
    </aside>
  );
}