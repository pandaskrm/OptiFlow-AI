import MainLayout from "../../components/layout/MainLayout";

const deliveries = [
  {
    id: "REC-001",
    supplier: "Chronopost",
    dock: "Quai 1",
    pallets: 12,
    status: "À quai",
  },
  {
    id: "REC-002",
    supplier: "DHL",
    dock: "Quai 2",
    pallets: 8,
    status: "En attente",
  },
  {
    id: "REC-003",
    supplier: "Geodis",
    dock: "Quai 3",
    pallets: 20,
    status: "Contrôle",
  },
];

export default function ReceptionPage() {
  return (
    <MainLayout>
      <h1 className="text-4xl font-bold mb-2">
        📥 Réception
      </h1>

      <p className="text-gray-400 mb-8">
        Gérez les arrivées fournisseurs et le suivi des quais.
      </p>

      {/* Barre d'actions */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Rechercher une réception..."
          className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 w-full md:w-96 text-white"
        />

        <button className="bg-blue-600 hover:bg-blue-700 transition rounded-xl px-6 py-3 font-semibold">
          + Nouvelle réception
        </button>
      </div>

      {/* Indicateurs */}
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

      {/* Tableau */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr>
              <th className="text-left p-4">Réception</th>
              <th className="text-left p-4">Transporteur</th>
              <th className="text-left p-4">Quai</th>
              <th className="text-left p-4">Palettes</th>
              <th className="text-left p-4">Statut</th>
            </tr>
          </thead>

          <tbody>
            {deliveries.map((delivery) => (
              <tr
                key={delivery.id}
                className="border-t border-slate-800 hover:bg-slate-800 transition"
              >
                <td className="p-4 font-bold">{delivery.id}</td>
                <td className="p-4">{delivery.supplier}</td>
                <td className="p-4">{delivery.dock}</td>
                <td className="p-4">{delivery.pallets}</td>

                <td className="p-4">
                  {delivery.status === "À quai" && (
                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400">
                      🟢 À quai
                    </span>
                  )}

                  {delivery.status === "En attente" && (
                    <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
                      🟡 En attente
                    </span>
                  )}

                  {delivery.status === "Contrôle" && (
                    <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400">
                      🟠 Contrôle
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* IA */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-8">
        <h2 className="text-2xl font-bold mb-4">
          🤖 Analyse IA
        </h2>

        <p className="text-gray-300">
          • Le camion DHL est annoncé avec 15 minutes de retard.
        </p>

        <p className="text-gray-300 mt-2">
          • Le quai 3 sera fortement sollicité entre 14h00 et 15h30.
        </p>

        <p className="text-green-400 font-semibold mt-4">
          ✔ Recommandation : ouvrir un quai supplémentaire à partir de 13h45.
        </p>
      </div>
    </MainLayout>
  );
}