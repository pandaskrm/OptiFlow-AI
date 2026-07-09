"use client";

import { useState } from "react";

import useDemo from "../hooks/useDemo";

import MainLayout from "../components/layout/MainLayout";

import AICopilot from "../components/dashboard/AICopilot";
import CommandCenter from "../components/dashboard/CommandCenter";
import DashboardActivity from "../components/dashboard/DashboardActivity";
import DashboardAlerts from "../components/dashboard/DashboardAlerts";
import DashboardCharts from "../components/dashboard/DashboardCharts";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardHero from "../components/dashboard/DashboardHero";
import DashboardStats from "../components/dashboard/DashboardStats";
import FloatingNotification from "../components/dashboard/FloatingNotification";
import LiveActivityFeed from "../components/dashboard/LiveActivityFeed";
import LiveWarehouseMap from "../components/dashboard/livewarehouse/LiveWarehouseMap";
import MissionControlBar from "../components/dashboard/MissionControlBar";
import NotificationCenter from "../components/dashboard/NotificationCenter";
import ScenarioSelector from "../components/dashboard/ScenarioSelector";

import DockPlanning from "../components/reception/DockPlanning";
import ReceptionDemoTable from "../components/reception/ReceptionDemoTable";
import ReceptionForm from "../components/reception/ReceptionForm";
import ReceptionStats from "../components/reception/ReceptionStats";
import ReceptionTable from "../components/reception/ReceptionTable";

export default function ReceptionPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const demo = useDemo();

  function refreshData() {
    setRefreshKey((prev) => prev + 1);
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <DashboardHeader />
        <FloatingNotification />

        <DashboardHero />

        <MissionControlBar />

        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <LiveWarehouseMap />
          <CommandCenter />
        </div>

        <ScenarioSelector />

        <DashboardStats refreshKey={refreshKey} />

        <div className="grid gap-6 xl:grid-cols-3">
          <DashboardCharts />
          <DashboardAlerts />
          <NotificationCenter />
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <DashboardActivity />
          <AICopilot />
          <LiveActivityFeed />
        </div>

        <ReceptionStats refreshKey={refreshKey} />

        <DockPlanning refreshKey={refreshKey} />

        {!demo.running && <ReceptionForm onSaved={refreshData} />}

        {demo.running ? (
          <ReceptionDemoTable />
        ) : (
          <ReceptionTable refreshKey={refreshKey} onDeleted={refreshData} />
        )}
      </div>
    </MainLayout>
  );
}