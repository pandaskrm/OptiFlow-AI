import { getDashboardData } from "./dashboardData";
import { getWarehouseState } from "../warehouse/warehouseEngine";

export async function getDashboardService() {
  const dashboard = await getDashboardData();
  const warehouse = getWarehouseState();

  return {
    receptions: dashboard,
    warehouse,
  };
}