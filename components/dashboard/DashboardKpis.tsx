"use client";

import useDemo from "../../hooks/useDemo";
import useScenario from "../../hooks/useScenario";
import useWarehouseSummary from "../../hooks/useWarehouseSummary";
import KpiCard from "./KpiCard";

export default function DashboardKpis() {
  const demo = useDemo();
  const { data: scenario } = useScenario();

  const {
    data: warehouse,
    loading,
    error,
  } = useWarehouseSummary();

  const dashboard = scenario.dashboard;

  const trend = demo.running
    ? scenario.label
    : error
      ? "Données indisponibles"
      : loading
        ? "Actualisation..."
        : warehouse.dataConnected
          ? "Données ERP synchronisées"
          : "En attente de données ERP";

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
      <KpiCard
        title="Commandes"
        value={String(
          demo.running
            ? dashboard.commandes
            : warehouse.orders.total
        )}
        trend={trend}
        progress={
          demo.running
            ? dashboard.productivite
            : warehouse.performance.preparation
        }
      />

      <KpiCard
        title="Expéditions"
        value={String(
          demo.running
            ? dashboard.expeditions
            : warehouse.shipments.total
        )}
        trend={trend}
        progress={
          demo.running
            ? dashboard.shippingProgress
            : warehouse.performance.shipping
        }
      />

      <KpiCard
        title="Réceptions"
        value={String(
          demo.running
            ? dashboard.receptions
            : warehouse.receptions.total
        )}
        trend={trend}
        progress={
          demo.running
            ? dashboard.receptionProgress
            : warehouse.performance.reception
        }
      />

      <KpiCard
        title="Service"
        value={`${
          demo.running
            ? dashboard.service
            : warehouse.performance.service
        }%`}
        trend={trend}
        progress={
          demo.running
            ? dashboard.service
            : warehouse.performance.service
        }
      />

      <KpiCard
        title="Productivité"
        value={`${
          demo.running
            ? dashboard.productivite
            : warehouse.performance.productivity
        }`}
        trend={trend}
        progress={
          demo.running
            ? dashboard.productivite
            : Math.min(
                100,
                warehouse.performance.productivity
              )
        }
      />

      <KpiCard
        title="Santé dépôt"
        value={`${
          demo.running
            ? dashboard.health
            : warehouse.healthScore
        }%`}
        trend={trend}
        progress={
          demo.running
            ? dashboard.health
            : warehouse.healthScore
        }
      />
    </div>
  );
}