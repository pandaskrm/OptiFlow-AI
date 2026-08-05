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

  const hasRealData = warehouse.dataConnected;

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
        : hasRealData
          ? "Données ERP synchronisées"
          : "ERP non connecté";

  return (
    <div className="mb-4 grid grid-cols-2 gap-3 sm:gap-3 md:grid-cols-3 xl:mb-5 xl:grid-cols-6">
      <KpiCard
        title="Commandes"
        value={String(
          simulation.running
            ? simulation.state.kpis.orders
            : hasRealData
              ? warehouse.orders.total
              : 0,
        )}
        trend={trend}
        progress={
          simulation.running
            ? simulation.state.kpis.productivity
            : hasRealData
              ? warehouse.performance.preparation
              : 0
        }
      />

      <KpiCard
        title="Expéditions"
        value={String(
          simulation.running
            ? simulation.state.kpis.shipments
            : hasRealData
              ? warehouse.shipments.total
              : 0,
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
            : hasRealData
              ? warehouse.performance.shipping
              : 0
        }
      />

      <KpiCard
        title="Réceptions"
        value={String(
          simulation.running
            ? simulation.state.kpis.receptions
            : hasRealData
              ? warehouse.receptions.total
              : 0,
        )}
        trend={trend}
        progress={
          simulation.running
            ? receptionProgress
            : hasRealData
              ? warehouse.performance.reception
              : 0
        }
      />

      <KpiCard
        title="Service"
        value={`${
          simulation.running
            ? simulation.state.kpis.serviceRate
            : hasRealData
              ? warehouse.performance.service
              : 0
        }%`}
        trend={trend}
        progress={
          simulation.running
            ? simulation.state.kpis.serviceRate
            : hasRealData
              ? warehouse.performance.service
              : 0
        }
      />

      <KpiCard
        title="Productivité"
        value={String(
          simulation.running
            ? simulation.state.kpis.productivity
            : hasRealData
              ? warehouse.performance.productivity
              : 0,
        )}
        trend={trend}
        progress={
          simulation.running
            ? simulation.state.kpis.productivity
            : hasRealData
              ? Math.min(
                  100,
                  warehouse.performance.productivity,
                )
              : 0
        }
      />

      <KpiCard
        title="Santé dépôt"
        value={simulation.running ? `${simulation.state.kpis.warehouseHealth}%` : hasRealData ? `${warehouse.healthScore}%` : "--"}
        trend={trend}
        progress={
          simulation.running
            ? simulation.state.kpis.warehouseHealth
            : hasRealData
              ? warehouse.healthScore
              : 0
        }
      />
    </div>
  );
}



