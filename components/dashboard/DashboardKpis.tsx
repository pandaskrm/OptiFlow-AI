"use client";

import useDemo from "../../hooks/useDemo";
import useScenario from "../../hooks/useScenario";
import KpiCard from "./KpiCard";

export default function DashboardKpis() {
  const demo = useDemo();
  const { data } = useScenario();

  const dashboard = data.dashboard;

  const trend = demo.running
    ? data.label
    : "ERP non connecté";

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
      <KpiCard
        title="Commandes"
        value={String(
          demo.running ? dashboard.commandes : 0
        )}
        trend={trend}
        progress={demo.running ? dashboard.productivite : 0}
      />

      <KpiCard
        title="Expéditions"
        value={String(
          demo.running ? dashboard.expeditions : 0
        )}
        trend={trend}
        progress={demo.running ? dashboard.shippingProgress : 0}
      />

      <KpiCard
        title="Réceptions"
        value={String(
          demo.running ? dashboard.receptions : 0
        )}
        trend={trend}
        progress={demo.running ? dashboard.receptionProgress : 0}
      />

      <KpiCard
        title="Service"
        value={`${demo.running ? dashboard.service : 0}%`}
        trend={trend}
        progress={demo.running ? dashboard.service : 0}
      />

      <KpiCard
        title="Productivité"
        value={`${demo.running ? dashboard.productivite : 0}%`}
        trend={trend}
        progress={demo.running ? dashboard.productivite : 0}
      />

      <KpiCard
        title="Santé dépôt"
        value={`${demo.running ? dashboard.health : 0}%`}
        trend={trend}
        progress={demo.running ? dashboard.health : 0}
      />
    </div>
  );
}