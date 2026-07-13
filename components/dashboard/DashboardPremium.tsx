import DashboardHeader from "./DashboardHeader";
import DashboardKpis from "./DashboardKpis";
import DashboardLiveContent from "./DashboardLiveContent";

export default function DashboardPremium() {
  return (
    <>
      <DashboardHeader />
      <DashboardKpis />
      <DashboardLiveContent />
    </>
  );
}