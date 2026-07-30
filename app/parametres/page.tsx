import { redirect } from "next/navigation";

import MainLayout from "../../components/layout/MainLayout";
import UsersAdminPanel from "../../components/settings/UsersAdminPanel";
import { getCurrentSession } from "../../lib/auth/session";
import { getErpConnector } from "../../lib/erp/erpConnectorFactory";

const roleLabels: Record<string, string> = {
  ADMIN: "Administrateur",
  LOGISTICS_MANAGER: "Responsable logistique",
  TEAM_LEADER: "Chef d'Ã©quipe",
  OPERATOR: "PrÃ©parateur",
  READ_ONLY: "Lecture seule",
};

export default async function ParametresPage() {
  const auth = await getCurrentSession();

  if (!auth) {
    redirect("/login");
  }

  const company = auth.company;
  const erpConnector = getErpConnector();
  const erpDataSource = await erpConnector.getDataSource();

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Centre d'administration
          </p>

          <h1 className="mt-2 text-4xl font-bold text-white">
            ParamÃ¨tres de l'entreprise
          </h1>

          <p className="mt-2 text-slate-400">
            GÃ©rez votre organisation, les collaborateurs et les droits d'accÃ¨s.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-cyan-400">
                  Entreprise
                </p>

                <h2 className="mt-1 text-2xl font-bold text-white">
                  {company.name}
                </h2>
              </div>
            </div>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <Info label="SIRET" value={company.siret ?? "Non renseignÃ©"} />
              <Info label="E-mail" value={company.email ?? "Non renseignÃ©"} />
              <Info label="TÃ©lÃ©phone" value={company.phone ?? "Non renseignÃ©"} />
              <Info
                label="Adresse"
                value={
                  [company.address, company.postalCode, company.city]
                    .filter(Boolean)
                    .join(" ") || "Non renseignÃ©e"
                }
              />
            </dl>
          </section>

          <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
            <p className="text-sm font-semibold text-cyan-400">
              Administrateur connectÃ©
            </p>

            <h2 className="mt-1 text-2xl font-bold text-white">
              {auth.user.firstName} {auth.user.lastName}
            </h2>

            <div className="mt-6 space-y-4">
              <Info label="E-mail" value={auth.user.email} />
              <Info
                label="RÃ´le"
                value={roleLabels[auth.membership.role] ?? auth.membership.role}
              />
            </div>
          </section>
        </div>

<section className="rounded-2xl border border-slate-700 bg-slate-900 p-6">
  <div className="flex items-center justify-between gap-4">
    <div>
      <p className="text-sm font-semibold text-cyan-400">
        Connexion ERP
      </p>

      <h2 className="mt-1 text-2xl font-bold text-white">
        {erpDataSource.name}
      </h2>
    </div>

    <span
      className={`rounded-full px-3 py-1 text-sm font-semibold ${
        erpDataSource.connected
          ? "bg-emerald-500/15 text-emerald-400"
          : "bg-amber-500/15 text-amber-400"
      }`}
    >
      {erpDataSource.connected ? "Connecté" : "Déconnecté"}
    </span>
  </div>

  <dl className="mt-6 grid gap-4 sm:grid-cols-3">
    <Info label="Fournisseur" value={erpDataSource.provider.toUpperCase()} />

    <Info
      label="État"
      value={erpDataSource.connected ? "Connecté" : "Déconnecté"}
    />

    <Info
      label="Dernière synchronisation"
      value={
        erpDataSource.lastSyncAt
          ? new Date(erpDataSource.lastSyncAt).toLocaleString("fr-FR")
          : "Jamais"
      }
    />
  </dl>
</section>
        <UsersAdminPanel />
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
