"use client";

import { useState } from "react";
import ReceptionForm from "./ReceptionForm";
import ReceptionStats from "./ReceptionStats";
import ReceptionTable from "./ReceptionTable";
import DockPlanning from "./DockPlanning";

export default function ReceptionClientPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-8">
      <ReceptionStats />

      <ReceptionForm onSaved={() => setRefreshKey((prev) => prev + 1)} />

      <DockPlanning />

      <ReceptionTable key={refreshKey} />
    </div>
  );
}