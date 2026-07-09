import MainLayout from "../../components/layout/MainLayout";

import PreparationHero from "@/components/preparation/PreparationHero";
import PreparationStats from "@/components/preparation/PreparationStats";
import PreparationTable from "@/components/preparation/PreparationTable";
import PreparationAi from "@/components/preparation/PreparationAi";
import PreparationLiveChart from "@/components/preparation/PreparationLiveChart";
import PickerPerformance from "@/components/preparation/PickerPerformance";
import PreparationTimeline from "@/components/preparation/PreparationTimeline";
import PreparationAnalytics from "@/components/preparation/PreparationAnalytics";
import PreparationAnalyticsAi from "@/components/preparation/PreparationAnalyticsAi";
import PreparationTeamStatus from "@/components/preparation/PreparationTeamStatus";
import PreparationDecisionPanel from "@/components/preparation/PreparationDecisionPanel";

export default function PreparationPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <PreparationHero />
        <PreparationStats />

        <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <PreparationAnalytics />
          <PreparationAnalyticsAi />
        </div>

        <PreparationTeamStatus />

        <div className="grid gap-6 xl:grid-cols-2">
          <PreparationLiveChart />
          <PickerPerformance />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <PreparationTable />

          <div className="flex flex-col gap-6">
            <PreparationDecisionPanel />
            <PreparationAi />
            <PreparationTimeline />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}