import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-72 min-h-screen bg-slate-900 border-r border-slate-800 p-6">

      <h1 className="text-3xl font-bold text-blue-500 mb-10">
        OptiFlow AI
      </h1>

      <nav className="space-y-2">

        <Link
          href="/dashboard"
          className="block bg-blue-600 hover:bg-blue-700 rounded-xl px-4 py-3 font-semibold transition"
        >
          📊 Dashboard
        </Link>

        <Link
          href="/reception"
          className="block text-gray-300 hover:text-white hover:bg-slate-800 rounded-xl px-4 py-3 transition"
        >
          📥 Réception
        </Link>

        <Link
          href="/preparation"
          className="block text-gray-300 hover:text-white hover:bg-slate-800 rounded-xl px-4 py-3 transition"
        >
          📋 Préparation
        </Link>

        <Link
          href="/expedition"
          className="block text-gray-300 hover:text-white hover:bg-slate-800 rounded-xl px-4 py-3 transition"
        >
          🚚 Expédition
        </Link>

        <Link
          href="/stock"
          className="block text-gray-300 hover:text-white hover:bg-slate-800 rounded-xl px-4 py-3 transition"
        >
          📦 Stock
        </Link>

        <Link
          href="/equipe"
          className="block text-gray-300 hover:text-white hover:bg-slate-800 rounded-xl px-4 py-3 transition"
        >
          👥 Équipe
        </Link>

        <Link
          href="/ia"
          className="block text-gray-300 hover:text-white hover:bg-slate-800 rounded-xl px-4 py-3 transition"
        >
          🤖 IA OptiFlow
        </Link>

        <Link
          href="/parametres"
          className="block text-gray-300 hover:text-white hover:bg-slate-800 rounded-xl px-4 py-3 transition"
        >
          ⚙️ Paramètres
        </Link>

      </nav>

    </aside>
  );
}