import { redirect } from "next/navigation";

import MainLayout from "../../components/layout/MainLayout";
import { getCurrentSession } from "../../lib/auth/session";

const roleLabels: Record<string, string> = {
  ADMIN: "Administrateur",
  LOGISTICS_MANAGER: "Responsable logistique",
  TEAM_LEADER: "Chef d'équipe",
  OPERATOR: "Préparateur",
  READ_ONLY: "Lecture seule",
};

export default async function ParametresPage() {
  const auth = await getCurrentSession();

  if (!auth) {
    redirect("/login");
  }

  const company = auth.company;
  const memberships = auth.user.memberships;

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Centre d’administration
          </p>

          <h1 className="mt-2 text-4xl font-bold text-white">
            Paramètres de l’entreprise
          </h1>

          <p className="mt-2 text-slate-400">
            Gérez votre organisation, les collaborateurs et les droits d’accès.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-cyan-400">
                  Entreprise
                </p>

                <h2 className="mt-1 text-2xl font-bold text-white">
                  {company.name}
                </h2>
              </div>

              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                Active
              </span>
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <Info label="SIRET" value={company.siret ?? "Non renseigné"} />
              <Info label="E-mail" value={company.email ?? "Non renseigné"} />
              <Info label="Téléphone" value={company.phone ?? "Non renseigné"} />
              <Info
                label="Adresse"
                value={
                  [company.address, company.postalCode, company.city]
                    .filter(Boolean)
                    .join(" ") || "Non renseignée"
                }
              />
            </dl>
          </section>

          <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <p className="text-sm font-semibold text-cyan-400">
              Administrateur connecté
            </p>

            <h2 className="mt-1 text-2xl font-bold text-white">
              {auth.user.firstName} {auth.user.lastName}
            </h2>

            <div className="mt-6 space-y-4">
              <Info label="E-mail" value={auth.user.email} />
              <Info
                label="Rôle"
                value={roleLabels[auth.membership.role] ?? auth.membership.role}
              />
              <Info
                label="Dernière connexion"
                value={
                  auth.user.lastLoginAt
                    ? new Intl.DateTimeFormat("fr-FR", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(auth.user.lastLoginAt)
                    : "Première connexion"
                }
              />
            </div>
          </section>
        </div>

        <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-cyan-400">
                Collaborateurs
              </p>

              <h2 className="mt-1 text-2xl font-bold text-white">
                Utilisateurs de l’entreprise
              </h2>
            </div>

            <button
              type="button"
              className="rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-500"
            >
              Ajouter un collaborateur
            </button>
          </div>

          <div className="mt-6 overflow-x-auto rounded-xl border border-slate-700">
            <table className="min-w-full">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm text-slate-300">
                    Nom
                  </th>
                  <th className="px-4 py-3 text-left text-sm text-slate-300">
                    E-mail
                  </th>
                  <th className="px-4 py-3 text-left text-sm text-slate-300">
                    Rôle
                  </th>
                  <th className="px-4 py-3 text-left text-sm text-slate-300">
                    Statut
                  </th>
                </tr>
              </thead>

              <tbody>
                {memberships.map((membership) => (
                  <tr
                    key={membership.id}
                    className="border-t border-slate-700 bg-slate-900"
                  >
                    <td className="px-4 py-4 text-white">
                      {auth.user.firstName} {auth.user.lastName}
                    </td>

                    <td className="px-4 py-4 text-slate-300">
                      {auth.user.email}
                    </td>

                    <td className="px-4 py-4 text-slate-300">
                      {roleLabels[membership.role] ?? membership.role}
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                        Actif
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

type InfoProps = {
  label: string;
  value: string;
};

function Info({ label, value }: InfoProps) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-4">
      <dt className="text-xs uppercase tracking-wider text-slate-500">
        {label}
      </dt>

      <dd className="mt-2 font-semibold text-slate-100">
        {value}
      </dd>
    </div>
  );
}