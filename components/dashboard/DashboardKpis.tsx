"use client";

import useSimulationV2 from "../../hooks/useSimulationV2";
import useWarehouseSummary from "../../hooks/useWarehouseSummary";
import KpiCard from "./KpiCard";

export default function DashboardKpis() {
  const simulation = useSimulationV2();

  const {
    data: warehouse,
    loading,
    error,
  } = useWarehouseSummary();

  const receptionTotal =
    simulation.state.receptions.planned +
    simulation.state.receptions.atDock +
    simulation.state.receptions.unloading +
    simulation.state.receptions.inspection +
    simulation.state.receptions.completed;

  const receptionProgress =
    receptionTotal > 0
      ? Math.round(
          (simulation.state.receptions.completed /
            receptionTotal) *
            100,
        )
      : 0;

  const trend = simulation.running
    ? `Scénario ${simulation.state.scenario}`
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
          simulation.running
            ? simulation.state.kpis.orders
            : warehouse.orders.total,
        )}
        trend={trend}
        progress={
          simulation.running
            ? simulation.state.kpis.productivity
            : warehouse.performance.preparation
        }
      />

      <KpiCard
        title="Expéditions"
        value={String(
          simulation.running
            ? simulation.state.kpis.shipments
            : warehouse.shipments.total,
        )}
        trend={trend}
        progress={
          simulation.running
            ? Math.min(
                100,
                Math.round(
                  (simulation.state.shipping.completedShipments /
                    Math.max(
                      1,
                      simulation.state.shipping.waitingShipments +
                        simulation.state.shipping.loadingShipments +
                        simulation.state.shipping.completedShipments,
                    )) *
                    100,
                ),
              )
            : warehouse.performance.shipping
        }
      />

      <KpiCard
        title="Réceptions"
        value={String(
          simulation.running
            ? simulation.state.kpis.receptions
            : warehouse.receptions.total,
        )}
        trend={trend}
        progress={
          simulation.running
            ? receptionProgress
            : warehouse.performance.reception
        }
      />

      <KpiCard
        title="Service"
        value={`${
          simulation.running
            ? simulation.state.kpis.serviceRate
            : warehouse.performance.service
        }%`}
        trend={trend}
        progress={
          simulation.running
            ? simulation.state.kpis.serviceRate
            : warehouse.performance.service
        }
      />

      <KpiCard
        title="Productivité"
        value={String(
          simulation.running
            ? simulation.state.kpis.productivity
            : warehouse.performance.productivity,
        )}
        trend={trend}
        progress={
          simulation.running
            ? simulation.state.kpis.productivity
            : Math.min(
                100,
                warehouse.performance.productivity,
              )
        }
      />

      <KpiCard
        title="Santé dépôt"
        value={`${
          simulation.running
            ? simulation.state.kpis.warehouseHealth
            : warehouse.healthScore
        }%`}
        trend={trend}
        progress={
          simulation.running
            ? simulation.state.kpis.warehouseHealth
            : warehouse.healthScore
        }
      />
    </div>
  );
}
