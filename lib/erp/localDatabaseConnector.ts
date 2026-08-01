import type { ErpConnector } from "./erpConnector";
import type { ErpDataSource } from "./types";
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

  async getOrders(): Promise<any[]> {
    return [];
  }

  async getReceptions(): Promise<any[]> {
    return [];
  }

  async getShipments(): Promise<any[]> {
    return [];
  }

  async getStock(): Promise<any[]> {
    return [];
  }

  async getEmployees(): Promise<any[]> {
    return [];
  }
}
