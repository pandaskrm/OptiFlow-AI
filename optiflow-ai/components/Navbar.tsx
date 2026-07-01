export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-6 border-b border-slate-800">
      <h1 className="text-2xl font-bold text-blue-500">
        OptiFlow AI
      </h1>

      <div className="flex gap-6 items-center">
        <button className="hover:text-blue-400">
          Fonctionnalités
        </button>

        <button className="hover:text-blue-400">
          Tarifs
        </button>

        <button className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-700">
          Connexion
        </button>
      </div>
    </nav>
  );
}