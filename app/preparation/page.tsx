import MainLayout from "../../components/layout/MainLayout";

const orders = [
  {
    id: "CMD-254871",
    client: "Pharmacie Marseille",
    priority: "Haute",
    carrier: "Chronopost",
    picker: "Lucas",
    progress: 80,
  },
  {
    id: "CMD-254872",
    client: "Vape Store Lyon",
    priority: "Normale",
    carrier: "DHL",
    picker: "Sarah",
    progress: 45,
  },
  {
    id: "CMD-254873",
    client: "CBD Shop Paris",
    priority: "Urgente",
    carrier: "Geodis",
    picker: "En attente",
    progress: 0,
  },
];

export default function PreparationPage() {
  return (
    <MainLayout>
      <h1 className="text-4xl font-bold mb-2">
        📦 Préparation
      </h1>

      <p className="text-gray-400 mb-8">
        Gérez les commandes en préparation.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">

        <div className="bg-slate-900 rounded-2xl p-5">
          <p className="text-gray-400">Commandes</p>
          <p className="text-3xl font-bold">486</p>
        </div>

        <div className="bg-slate-900 rounded-2xl p-5">
          <p className="text-gray-400">Urgentes</p>
          <p className="text-3xl font-bold text-red-400">18</p>
        </div>

        <div className="bg-slate-900 rounded-2xl p-5">
          <p className="text-gray-400">Terminées</p>
          <p className="text-3xl font-bold text-green-400">302</p>
        </div>

        <div className="bg-slate-900 rounded-2xl p-5">
          <p className="text-gray-400">En cours</p>
          <p className="text-3xl font-bold text-blue-400">184</p>
        </div>

      </div>

      <div className="bg-slate-900 rounded-2xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-800">

            <tr>

              <th className="p-4 text-left">Commande</th>
              <th className="p-4 text-left">Client</th>
              <th className="p-4 text-left">Priorité</th>
              <th className="p-4 text-left">Préparateur</th>
              <th className="p-4 text-left">Progression</th>

            </tr>

          </thead>

          <tbody>

            {orders.map((order) => (

              <tr
                key={order.id}
                className="border-t border-slate-800 hover:bg-slate-800"
              >

                <td className="p-4 font-bold">
                  {order.id}
                </td>

                <td className="p-4">
                  {order.client}
                </td>

                <td className="p-4">
                  {order.priority}
                </td>

                <td className="p-4">
                  {order.picker}
                </td>

                <td className="p-4">

                  <div className="w-full bg-slate-700 rounded-full h-3">

                    <div
                      className="bg-blue-500 h-3 rounded-full"
                      style={{ width: `${order.progress}%` }}
                    />

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="bg-slate-900 rounded-2xl p-6 mt-8">

        <h2 className="text-2xl font-bold mb-4">
          🤖 IA Préparation
        </h2>

        <p className="text-gray-300">
          • 18 commandes Chronopost doivent partir avant 14h.
        </p>

        <p className="text-gray-300 mt-2">
          • L'allée 12 est actuellement la plus sollicitée.
        </p>

        <p className="text-green-400 mt-4 font-bold">
          ✔ Recommandation : affecter un préparateur supplémentaire à l'allée 12.
        </p>

      </div>

    </MainLayout>
  );
}