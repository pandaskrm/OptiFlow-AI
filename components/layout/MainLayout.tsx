import { redirect } from "next/navigation";

import OptiFlowAssistant from "../OptiFlowAssistant";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import MobileNavigation from "./MobileNavigation";
import { getCurrentSession } from "../../lib/auth/session";
import { prisma } from "../../lib/prisma";

type Props = {
  children: React.ReactNode;
};

export default async function MainLayout({ children }: Props) {
  const auth = await getCurrentSession();

  if (!auth) {
    redirect("/login");
  }

  const employee = await prisma.workforce.findFirst({
    where: {
      membershipId: auth.membership.id,
      companyId: auth.company.id,
      isActive: true,
    },
    select: {
      id: true,
    },
  });

  if (employee) {
    redirect("/employee");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <MobileNavigation />

          <div className="hidden lg:block">
            <Topbar />
          </div>

          <div className="w-full min-w-0 px-3 pb-28 pt-3 sm:px-4 lg:px-6 lg:pb-6 lg:pt-5">
            {children}
          </div>
        </div>
      </div>

      <OptiFlowAssistant />
    </main>
  );
}
