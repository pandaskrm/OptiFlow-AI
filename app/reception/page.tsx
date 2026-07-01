export default function ReceptionPage() {
  const receptions = [
    {
      heure: "08:30",
      transporteur: "DHL",
      palettes: 5,
      statut: "Arrivé",
      couleur: "text-green-400",
    },
    {
      heure: "09:00",
      transporteur: "Geodis",
      palettes: 12,
      statut: "Déchargement",
      couleur: "text-orange-400",
    },
    {
      heure: "09:30",
      transporteur: "Chronopost",
      palettes: 2,
      statut: "En retard",
      couleur: "text-red-500",
    },
    {
      heure: "10:15",
      transporteur: "DB Schenker",
      palettes: 8,
      statut: "Prévu",
      couleur: "text-blue-400",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-5xl font-bold mb-2">
        📦 Réception Marchandises
      </h1>

      <p className="text-gray-400 mb-10">
        Gestion intelligente des arrivées transporteurs.
      </p>

      <div className="grid md:grid-cols-4 gap-6 mb-10">

        <div className="bg-slate-900 rounded-2xl p-6">
          <h2 className="text-4xl font-bold text-blue-500">12</h2>
          <p className="text-gray-400">Camions attendus</p>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6">
          <h2 className="text-4xl font-bold text-orange-400">3</h2>
          <p className="text-gray-400">En cours</p>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6">
          <h2 className="text-4xl font-bold text-green-500">9</h2>
          <p className="text-gray-400">Terminés</p>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6">
          <h2 className="text-4xl font-bold text-red-500">1</h2>
          <p className="text-gray-400">Retard</p>
        </div>

      </div>

      <div className="bg-slate-900 rounded-2xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-800">

            <tr>

              <th className="text-left p-4">Heure</th>

              <th className="text-left p-4">Transporteur</th>

              <th className="text-left p-4">Palettes</th>

              <th className="text-left p-4">Statut</th>

            </tr>

          </thead>

          <tbody>

            {receptions.map((r, i) => (

              <tr
                key={i}
                className="border-t border-slate-800 hover:bg-slate-800 transition"
              >

                <td className="p-4">{r.heure}</td>

                <td className="p-4 font-semibold">{r.transporteur}</td>

                <td className="p-4">{r.palettes}</td>

                <td className={`p-4 font-bold ${r.couleur}`}>
                  {r.statut}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="bg-slate-900 rounded-2xl p-8 mt-10">

        <h2 className="text-2xl font-bold mb-5">
          🤖 Recommandations IA
        </h2>

        <ul className="space-y-3 text-gray-300">

          <li>✅ Prioriser le déchargement du camion Geodis.</li>

          <li>⚠️ Le BL 45897 semble incomplet (1 palette manquante).</li>

          <li>🚛 Le quai 4 est disponible.</li>

          <li>📈 Charge réception estimée : 82 %.</li>

        </ul>

      </div>

    </main>
  );
}