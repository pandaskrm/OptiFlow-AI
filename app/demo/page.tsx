import MainLayout from "../../components/layout/MainLayout";
import CommercialDemoPanel from "../../components/dashboard/CommercialDemoPanel";
import LiveWarehouseMap from "../../components/dashboard/livewarehouse/LiveWarehouseMap";
import MissionControlBar from "../../components/dashboard/MissionControlBar";

export default function DemoPage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <MissionControlBar />
        <CommercialDemoPanel />
        <LiveWarehouseMap />
      </div>
    </MainLayout>
  );
}