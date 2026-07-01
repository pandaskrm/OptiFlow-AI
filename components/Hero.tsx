export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-6 py-32">
      <h2 className="text-6xl font-extrabold mb-6">
        L'IA qui fait gagner du temps aux entreprises.
      </h2>

      <p className="text-gray-400 text-xl max-w-3xl mb-10">
        Automatisez vos tâches, pilotez votre activité et laissez
        OptiFlow AI vous aider à prendre de meilleures décisions.
      </p>

      <div className="flex gap-5">
        <button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-semibold">
          Commencer gratuitement
        </button>

        <button className="border border-gray-600 px-8 py-4 rounded-xl hover:bg-slate-800">
          Voir la démonstration
        </button>
      </div>
    </section>
  );
}