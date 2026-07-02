"use client";

import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import ReceptionForm from "../components/reception/ReceptionForm";
import ReceptionStats from "../components/reception/ReceptionStats";
import ReceptionTable from "../components/reception/ReceptionTable";

export default function ReceptionPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshData = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <ReceptionStats refreshKey={refreshKey} />
        <ReceptionForm onSaved={refreshData} />
        <ReceptionTable
          refreshKey={refreshKey}
          onDeleted={refreshData}
        />
      </div>
    </MainLayout>
  );
}