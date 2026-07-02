export default function ReceptionStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

      <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
        <p className="text-gray-400 text-sm">Réceptions prévues</p>
        <p className="text-3xl font-bold mt-2">17</p>
      </div>

      <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
        <p className="text-gray-400 text-sm">À quai</p>
        <p className="text-3xl font-bold text-green-400 mt-2">3</p>
      </div>

      <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
        <p className="text-gray-400 text-sm">En retard</p>
        <p className="text-3xl font-bold text-orange-400 mt-2">2</p>
      </div>

      <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
        <p className="text-gray-400 text-sm">Terminées</p>
        <p className="text-3xl font-bold text-blue-400 mt-2">12</p>
      </div>

    </div>
  );
}