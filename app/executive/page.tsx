import { redirect } from "next/navigation";
import { getCurrentSession } from "../../lib/auth/session";

const EXECUTIVE_ROLES = new Set([
  "OWNER",
  "ADMIN",
  "LOGISTICS_MANAGER",
]);
import MainLayout from "../../components/layout/MainLayout";
import ExecutiveModeContent from "@/components/executive/ExecutiveModeContent";

export default async function ExecutivePage() {
  const auth = await getCurrentSession();

  if (!auth) {
    redirect("/login");
  }

  if (!EXECUTIVE_ROLES.has(auth.membership.role)) {
    redirect("/");
  }

  return (
    <MainLayout>
      <ExecutiveModeContent />
    </MainLayout>
  );
}