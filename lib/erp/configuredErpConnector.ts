import type { ErpConnector } from "./erpConnector";
import type {
  ErpConnectionStatus,
  ErpDataSource,
  ErpEmployee,
  ErpOrder,
  ErpProvider,
  ErpReception,
  ErpShipment,
  ErpStockItem,
} from "./types";
import type { ErpSyncSummary } from "./erpSyncService";

type ConfiguredErpConnectorOptions = {
  provider: ErpProvider;
  name: string;
  status: string;
  lastSyncAt: Date | null;
};

function normalizeConnectionStatus(
  status: string
): ErpConnectionStatus {
  switch (status.toUpperCase()) {
    case "CONNECTED":
      return "connected";
    case "CONNECTING":
      return "connecting";
    case "ERROR":
      return "error";
    default:
      return "disconnected";
  }
}

export class ConfiguredErpConnector implements ErpConnector {
  constructor(
    private readonly options: ConfiguredErpConnectorOptions
  ) {}

  async getDataSource(): Promise<ErpDataSource> {
    const status = normalizeConnectionStatus(this.options.status);

    return {
      provider: this.options.provider,
      connected: status === "connected",
      name: this.options.name,
      lastSyncAt: this.options.lastSyncAt?.toISOString() ?? null,
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