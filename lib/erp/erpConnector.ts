import type { ErpDataSource } from "./types";
import type { ErpSyncSummary } from "./erpSyncService";

export interface ErpConnector {
  getDataSource(): Promise<ErpDataSource>;
  getSummary(): Promise<ErpSyncSummary>;

  getOrders(): Promise<unknown[]>;
  getReceptions(): Promise<unknown[]>;
  getShipments(): Promise<unknown[]>;
  getStock(): Promise<unknown[]>;
  getEmployees(): Promise<unknown[]>;

}
