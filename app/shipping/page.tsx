import MainLayout from "../../components/layout/MainLayout";

import ShippingHero from "@/components/shipping/ShippingHero";
import ShippingStats from "@/components/shipping/ShippingStats";
import ShippingAnalytics from "@/components/shipping/ShippingAnalytics";
import ShippingTeamStatus from "@/components/shipping/ShippingTeamStatus";
import ShippingTable from "@/components/shipping/ShippingTable";
import ShippingAi from "@/components/shipping/ShippingAi";
import ShippingDecisionPanel from "@/components/shipping/ShippingDecisionPanel";
import ShippingTimeline from "@/components/shipping/ShippingTimeline";

export default function ShippingPage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <ShippingHero />
        <ShippingStats />

        <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <ShippingAnalytics />
          <ShippingAi />
        </div>

        <ShippingTeamStatus />

        <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <ShippingTable />

          <div className="flex flex-col gap-6">
            <ShippingDecisionPanel />
            <ShippingTimeline />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}