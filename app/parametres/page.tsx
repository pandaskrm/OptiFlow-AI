import MainLayout from "../../components/layout/MainLayout";

const roles = [
  "Administrateur",
  "Responsable Logistique",
  "Chef d'équipe",
  "Préparateur",
  "Lecture seule",
];

export default function ParametresPage() {
  return (
    <MainLayout>
      <div className="space-y-8">

        <div>
          <h1 className="text-4xl font-bold text-white">
            ⚙️ Administration
          </h1>

          <p className="mt-2 text-slate-400">
            Gérez votre entreprise, vos utilisateurs et les accès.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold text-cyan-400">
              🏢 Entreprise
            </h2>

            <div className="mt-6 space-y-4">

              <input
                placeholder="Nom de l'entreprise"
                className="w-full rounded-xl bg-slate-800 p-3 text-white"
              />

              <input
                placeholder="SIRET"
                className="w-full rounded-xl bg-slate-800 p-3 text-white"
              />

              <input
                placeholder="Adresse"
                className="w-full rounded-xl bg-slate-800 p-3 text-white"
              />

              <button className="rounded-xl bg-cyan-600 px-5 py-3 font-bold">
                Enregistrer
              </button>

            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <h2 className="text-2xl font-bold text-cyan-400">
              👤 Ajouter un collaborateur
            </h2>

            <div className="mt-6 space-y-4">

              <input
                placeholder="Nom"
                className="w-full rounded-xl bg-slate-800 p-3 text-white"
              />

              <input
                placeholder="Prénom"
                className="w-full rounded-xl bg-slate-800 p-3 text-white"
              />

              <input
                placeholder="Adresse e-mail"
                className="w-full rounded-xl bg-slate-800 p-3 text-white"
              />

              <select
                className="w-full rounded-xl bg-slate-800 p-3 text-white"
              >
                {roles.map((role) => (
                  <option key={role}>
                    {role}
                  </option>
                ))}
              </select>

              <button className="rounded-xl bg-emerald-600 px-5 py-3 font-bold">
                Créer le compte
              </button>

            </div>
          </div>

        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6">

          <h2 className="text-2xl font-bold text-cyan-400">
            👥 Collaborateurs
          </h2>

          <div className="mt-6 overflow-hidden rounded-xl border border-slate-700">

            <table className="w-full">

              <thead className="bg-slate-800">

                <tr>

                  <th className="p-3 text-left">
                    Nom
                  </th>

                  <th className="p-3 text-left">
                    Rôle
                  </th>

                  <th className="p-3 text-left">
                    Statut
                  </th>

                  <th className="p-3 text-left">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                <tr className="border-t border-slate-700">

                  <td className="p-3">
                    Kevin Rodrigues
                  </td>

                  <td className="p-3">
                    Administrateur
                  </td>

                  <td className="p-3 text-green-400">
                    Actif
                  </td>

                  <td className="p-3">

                    <button className="mr-2 rounded bg-yellow-600 px-3 py-1">
                      Modifier
                    </button>

                    <button className="rounded bg-red-600 px-3 py-1">
                      Désactiver
                    </button>

                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}