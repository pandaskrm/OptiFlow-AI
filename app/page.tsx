"use client";

import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import AICopilot from "../components/dashboard/AICopilot";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardStats from "../components/dashboard/DashboardStats";
import DashboardCharts from "../components/dashboard/DashboardCharts";
import DashboardAlerts from "../components/dashboard/DashboardAlerts";
import DashboardActivity from "../components/dashboard/DashboardActivity";
import ReceptionForm from "../components/reception/ReceptionForm";
import ReceptionStats from "../components/reception/ReceptionStats";
import ReceptionTable from "../components/reception/ReceptionTable";
import DockPlanning from "../components/reception/DockPlanning";

export default function ReceptionPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshData = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <DashboardHeader />
        <DashboardStats refreshKey={refreshKey} />

        <div className="grid gap-6 xl:grid-cols-2">
          <DashboardCharts />
          <DashboardAlerts />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <DashboardActivity />
          <AICopilot />
        </div>

        <ReceptionStats refreshKey={refreshKey} />
        <DockPlanning refreshKey={refreshKey} />
        <ReceptionForm onSaved={refreshData} />
        <ReceptionTable refreshKey={refreshKey} onDeleted={refreshData} />
      </div>
    </MainLayout>
  );
}