import { redirect } from "next/navigation";

import DashboardPremium from "../../components/dashboard/DashboardPremium";
import MainLayout from "../../components/layout/MainLayout";
import { getCurrentSession } from "../../lib/auth/session";

export default async function DashboardPage() {
  const auth = await getCurrentSession();

  if (!auth) {
    redirect("/login");
  }

  return (
    <MainLayout>
      <DashboardPremium />
    </MainLayout>
  );
}