import { redirect } from "next/navigation";
import { getCurrentSession } from "../../lib/auth/session";
import MainLayout from "../../components/layout/MainLayout";
import AuditTable from "../../components/audit/AuditTable";

export default async function AuditPage() {
  const auth = await getCurrentSession();

  if (!auth) {
    redirect("/login");
  }

  if (auth.membership.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Administration
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Journal d&apos;audit
          </h1>

          <p className="mt-2 text-slate-500">
            Consultez les actions réalisées dans votre entreprise,
            identifiez les utilisateurs concernés et suivez les
            modifications importantes.
          </p>
        </div>

        <AuditTable />
      </div>
    </MainLayout>
  );
}