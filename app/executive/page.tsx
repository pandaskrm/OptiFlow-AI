import MainLayout from "../../components/layout/MainLayout";

import ExecutiveHero from "@/components/executive/ExecutiveHero";
import ExecutiveStats from "@/components/executive/ExecutiveStats";
import ExecutiveHealthScore from "@/components/executive/ExecutiveHealthScore";
import ExecutiveOperations from "@/components/executive/ExecutiveOperations";
import ExecutiveAi from "@/components/executive/ExecutiveAi";
import ExecutiveDecisions from "@/components/executive/ExecutiveDecisions";

export default function ExecutivePage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <ExecutiveHero />
        <ExecutiveStats />

        <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
          <ExecutiveHealthScore />
          <ExecutiveOperations />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <ExecutiveAi />
          <ExecutiveDecisions />
        </div>
      </div>
    </MainLayout>
  );
}