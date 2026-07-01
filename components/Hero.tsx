import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-32">

      {/* Fond lumineux */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 to-slate-950"></div>

      <div className="relative max-w-7xl mx-auto">

        <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-blue-400 text-sm mb-8">
          🚀 L'IA pensée pour les entreprises et la logistique
        </div>

        <h1 className="text-6xl md:text-7xl font-extrabold leading-tight mb-8">
          Gagnez du temps.
          <br />
          <span className="text-blue-500">
            Automatisez votre entreprise.
          </span>
        </h1>

        <p className="text-xl text-gray-400 max-w-3xl mb-12 leading-9">
          OptiFlow AI analyse vos données, détecte automatiquement les pertes
          de temps, optimise votre organisation et vous aide à prendre les
          meilleures décisions grâce à l'intelligence artificielle.
        </p>

        <div className="flex flex-wrap gap-5 mb-16">

          <Link href="/login">
            <button className="bg-blue-600 hover:bg-blue-700 transition px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-blue-500/20">
              Commencer gratuitement →
            </button>
          </Link>

          <Link href="/dashboard">
            <button className="border border-slate-700 hover:border-blue-500 hover:bg-slate-900 transition px-8 py-4 rounded-xl text-lg">
              Voir la démonstration
            </button>
          </Link>

        </div>

        {/* Statistiques */}

        <div className="grid md:grid-cols-4 gap-6">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-4xl font-bold text-blue-500">+30%</h3>
            <p className="text-gray-400 mt-2">
              Productivité moyenne
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-4xl font-bold text-green-500">50 h</h3>
            <p className="text-gray-400 mt-2">
              Gagnées chaque mois
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-4xl font-bold text-orange-400">24/7</h3>
            <p className="text-gray-400 mt-2">
              Assistant IA disponible
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-4xl font-bold text-purple-500">100%</h3>
            <p className="text-gray-400 mt-2">
              Hébergé dans le cloud
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}