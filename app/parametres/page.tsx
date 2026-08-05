import { redirect } from "next/navigation";

import CarrierAdminPanel from "../../components/settings/CarrierAdminPanel";
import ErpConnectionForm from "../../components/erp/ErpConnectionForm";
import MailConnectionForm from "../../components/mail/MailConnectionForm";
import MainLayout from "../../components/layout/MainLayout";
import UsersAdminPanel from "../../components/settings/UsersAdminPanel";
import { getCurrentSession } from "../../lib/auth/session";

const roleLabels: Record<string, string> = {
  ADMIN: "Administrateur",
  OWNER: "Propriétaire",
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

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Centre d'administration
          </p>

          <h1 className="mt-2 text-4xl font-bold text-white">
            Paramètres de l'entreprise
          </h1>

          <p className="mt-2 text-slate-400">
            Gérez votre organisation, les collaborateurs et les droits d'accès.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-lg">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
                  Informations entreprise
                </p>

                <h2 className="mt-1 text-2xl font-bold text-white">
                  {company.name}
                </h2>
              </div>

              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
                Active
              </span>
            </div>

            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <Info label="SIRET" value={company.siret ?? "Non renseigné"} />
              <Info label="E-mail" value={company.email ?? "Non renseigné"} />
              <Info
                label="Téléphone"
                value={company.phone ?? "Non renseigné"}
              />
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

          <section className="rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 text-lg font-black text-cyan-300">
                {auth.user.firstName?.slice(0, 1).toUpperCase()}
                {auth.user.lastName?.slice(0, 1).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
                  Compte connecté
                </p>

                <h2 className="mt-1 truncate text-lg font-bold text-white">
                  {auth.user.email}
                </h2>
              </div>
            </div>

            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <Info
                label="Rôle"
                value={roleLabels[auth.membership.role] ?? auth.membership.role}
              />
              <Info
                label="Niveau d'accès"
                value="Compte administrateur"
              />
            </dl>
          </section>
        </div>

        <MailConnectionForm />

        <ErpConnectionForm />

        <CarrierAdminPanel />

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
    <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-3.5">
      <dt className="text-xs uppercase tracking-wider text-slate-500">
        {label}
      </dt>

      <dd className="mt-1.5 break-words font-semibold text-slate-100">{value}</dd>
    </div>
  );
}