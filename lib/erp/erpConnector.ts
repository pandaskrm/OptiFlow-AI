import type {
  ErpDataSource,
  ErpEmployee,
  ErpOrder,
  ErpReception,
  ErpShipment,
  ErpStockItem,
} from "./types";
import type { ErpSyncSummary } from "./erpSyncService";

export interface ErpConnector {
  getDataSource(): Promise<ErpDataSource>;
  getSummary(): Promise<ErpSyncSummary>;
  getOrders(): Promise<ErpOrder[]>;
  getReceptions(): Promise<ErpReception[]>;
  getShipments(): Promise<ErpShipment[]>;
  getStock(): Promise<ErpStockItem[]>;
  getEmployees(): Promise<ErpEmployee[]>;
}
