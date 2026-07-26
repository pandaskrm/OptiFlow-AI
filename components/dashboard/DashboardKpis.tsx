"use client";

import useDemo from "../../hooks/useDemo";
import useDemoWarehouseSummary from "../../hooks/useDemoWarehouseSummary";
import useScenario from "../../hooks/useScenario";
import useWarehouseSummary from "../../hooks/useWarehouseSummary";
import KpiCard from "./KpiCard";

export default function DashboardKpis() {
  const demo = useDemo();
  const demoWarehouse = useDemoWarehouseSummary();
  const { data: scenario } = useScenario();

  const {
    data: warehouse,
    loading,
    error,
  } = useWarehouseSummary();

  const dashboard = scenario.dashboard;

  const demoReceptionProgress =
    demoWarehouse.total > 0
      ? Math.round(
          (demoWarehouse.completed / demoWarehouse.total) * 100
        )
      : 0;

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
            ? demoWarehouse.total
            : warehouse.receptions.total
        )}
        trend={trend}
        progress={
          demo.running
            ? demoReceptionProgress
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
      ? demo.state.warehouseHealth
      : warehouse.healthScore
  }%`}
  trend={trend}
  progress={
    demo.running
      ? demo.state.warehouseHealth
      : warehouse.healthScore
  }
  />
    </div>
  );
}