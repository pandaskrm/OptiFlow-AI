"use client";

import useDemo from "../../hooks/useDemo";
import KpiCard from "./KpiCard";

export default function DashboardKpis() {
  const demo = useDemo();

  const commandes = demo.running ? 486 : 0;
  const expeditions = demo.running ? 32 : 0;
  const receptions = demo.running ? demo.state.activeReceptions : 0;
  const service = demo.running ? 97 : 0;
  const productivite = demo.running ? 91 : 0;
  const santeDepot = demo.running ? demo.state.warehouseHealth : 0;

  const trend = demo.running
    ? "Mode Démo"
    : "ERP non connecté";

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
      <KpiCard
        title="Commandes"
        value={String(commandes)}
        trend={trend}
        progress={demo.running ? 86 : 0}
      />

      <KpiCard
        title="Expéditions"
        value={String(expeditions)}
        trend={trend}
        progress={demo.running ? 74 : 0}
      />

      <KpiCard
        title="Réceptions"
        value={String(receptions)}
        trend={trend}
        progress={demo.running ? 65 : 0}
      />

      <KpiCard
        title="Service"
        value={`${service}%`}
        trend={trend}
        progress={service}
      />

      <KpiCard
        title="Productivité"
        value={`${productivite}%`}
        trend={trend}
        progress={productivite}
      />

      <KpiCard
        title="Santé dépôt"
        value={`${santeDepot}%`}
        trend={trend}
        progress={santeDepot}
      />
    </div>
  );
}