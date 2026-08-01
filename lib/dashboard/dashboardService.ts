import { getDashboardData } from "./dashboardData";
import { getWarehouseState } from "../warehouse/warehouseEngine";
import { prisma } from "../prisma";
import { getErpConnector } from "../erp/erpConnectorFactory";

export async function getDashboardService() {
  const dashboard = await getDashboardData();
  const warehouse = getWarehouseState();

  const connection =
    await prisma.erpConnection.findFirst({
      orderBy: {
        updatedAt: "desc",
      },
    });

  const connector = getErpConnector(connection);

  const erp = {
    source: await connector.getDataSource(),
    summary: await connector.getSummary(),
  };

  return {
    receptions: dashboard,
    warehouse,
    erp,
  };
}
