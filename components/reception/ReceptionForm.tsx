export default function ReceptionForm() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-2xl font-bold">
          ➕ Nouvelle réception
        </h2>

        <button className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl font-semibold transition">
          Enregistrer
        </button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Numéro de réception
          </label>

          <input
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:border-blue-500"
            placeholder="REC-0001"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Fournisseur
          </label>

          <input
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:border-blue-500"
            placeholder="Vaporesso"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Transporteur
          </label>

          <input
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:border-blue-500"
            placeholder="Chronopost"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Quai
          </label>

          <input
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:border-blue-500"
            placeholder="Quai 2"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Nombre de palettes
          </label>

          <input
            type="number"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:border-blue-500"
            placeholder="12"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Heure prévue
          </label>

          <input
            type="time"
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 outline-none focus:border-blue-500"
          />
        </div>

      </div>

    </div>
  );
}
