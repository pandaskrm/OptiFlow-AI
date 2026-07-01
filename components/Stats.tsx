export default function Stats() {
  return (
    <section className="px-8 py-16 bg-slate-950">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-slate-800 rounded-2xl p-6">
          <h3 className="text-4xl font-bold text-blue-500">+27%</h3>
          <p className="text-gray-400 mt-2">Productivité</p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6">
          <h3 className="text-4xl font-bold text-green-500">18 540 €</h3>
          <p className="text-gray-400 mt-2">Économies</p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6">
          <h3 className="text-4xl font-bold text-orange-400">12</h3>
          <p className="text-gray-400 mt-2">Tâches du jour</p>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6">
          <h3 className="text-4xl font-bold text-purple-500">IA</h3>
          <p className="text-gray-400 mt-2">Assistant actif</p>
        </div>

      </div>
    </section>
  );
}