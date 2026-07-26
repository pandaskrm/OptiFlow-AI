"use client";

import { useState } from "react";
import useSimulationV2 from "../../hooks/useSimulationV2";

import ReceptionForm from "./ReceptionForm";
import ReceptionStats from "./ReceptionStats";
import ReceptionTable from "./ReceptionTable";
import ReceptionDemoTable from "./ReceptionDemoTable";
import DockPlanning from "./DockPlanning";

export default function ReceptionClientPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const simulation = useSimulationV2();

  function refresh() {
    setRefreshKey((prev) => prev + 1);
  }

  return (
    <div className="space-y-8">
      <ReceptionStats refreshKey={refreshKey} />

      {!simulation.running && (
        <ReceptionForm onSaved={refresh} />
      )}

      <DockPlanning refreshKey={refreshKey} />

      {simulation.running ? (
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
