"use client";

import { useState } from "react";
import useDemo from "../../hooks/useDemo";

import ReceptionForm from "./ReceptionForm";
import ReceptionStats from "./ReceptionStats";
import ReceptionTable from "./ReceptionTable";
import ReceptionDemoTable from "./ReceptionDemoTable";
import DockPlanning from "./DockPlanning";

export default function ReceptionClientPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const demo = useDemo();

  function refresh() {
    setRefreshKey((prev) => prev + 1);
  }

  return (
    <div className="space-y-8">
      <ReceptionStats refreshKey={refreshKey} />

      {!demo.running && (
        <ReceptionForm onSaved={refresh} />
      )}

      <DockPlanning refreshKey={refreshKey} />

      {demo.running ? (
        <ReceptionDemoTable />
      ) : (
        <ReceptionTable
          refreshKey={refreshKey}
          onDeleted={refresh}
        />
      )}
    </div>
  );
}