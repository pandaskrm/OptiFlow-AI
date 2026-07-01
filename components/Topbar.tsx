export default function Topbar() {
  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold">Bonjour Kevin 👋</h1>
        <p className="text-gray-400">
          Voici le résumé intelligent de votre entreprise.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl">
          🔔
        </button>

        <div className="bg-slate-800 px-4 py-2 rounded-xl">
          👤 Kevin
        </div>
      </div>
    </header>
  );
}