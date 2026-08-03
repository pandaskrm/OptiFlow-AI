import type { ErpConnector } from "./erpConnector";
import type {
  ErpDataSource,
  ErpEmployee,
  ErpOrder,
  ErpReception,
  ErpShipment,
  ErpStockItem,
} from "./types";
import type { ErpSyncSummary } from "./erpSyncService";

export class LocalDatabaseConnector implements ErpConnector {
  async getDataSource(): Promise<ErpDataSource> {
    return {
      provider: "local",
      connected: false,
      name: "Base locale",
      lastSyncAt: null,
    };
  }

  async getSummary(): Promise<ErpSyncSummary> {
    return {
      orders: 0,
      shipments: 0,
      receptions: 0,
      stockItems: 0,
      employees: 0,
    };
  }

  async getOrders(): Promise<ErpOrder[]> {
    return [];
  }

  async getReceptions(): Promise<ErpReception[]> {
    return [];
  }

  async getShipments(): Promise<ErpShipment[]> {
    return [];
  }

  async getStock(): Promise<ErpStockItem[]> {
    return [];
  }

  async getEmployees(): Promise<ErpEmployee[]> {
    return [];
  }
}
