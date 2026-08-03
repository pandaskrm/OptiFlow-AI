import { ErpApiClient } from "./erpApiClient";
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
  apiUrl: string;
  apiKey: string | null;
  externalCompanyId: string | null;
};

function normalizeConnectionStatus(
  status: string,
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

export class ConfiguredErpConnector
  implements ErpConnector
{
  private readonly client: ErpApiClient;

  constructor(
    private readonly options:
      ConfiguredErpConnectorOptions,
  ) {
    if (!options.apiUrl.trim()) {
      throw new Error(
        "L'URL de l'API ERP est absente.",
      );
    }

    this.client = new ErpApiClient({
      baseUrl: options.apiUrl,
      apiKey: options.apiKey,
      externalCompanyId:
        options.externalCompanyId,
    });
  }

  async getDataSource(): Promise<ErpDataSource> {
    const status = normalizeConnectionStatus(
      this.options.status,
    );

    return {
      provider: this.options.provider,
      connected: status === "connected",
      name: this.options.name,
      lastSyncAt:
        this.options.lastSyncAt?.toISOString() ??
        null,
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

  private getDeltaQuery() {
    return this.options.lastSyncAt
      ? {
          updatedSince:
            this.options.lastSyncAt.toISOString(),
        }
      : {};
  }

  async getOrders(): Promise<ErpOrder[]> {
    return this.client.get<ErpOrder[]>(
      "orders",
      this.getDeltaQuery(),
    );
  }

  async getReceptions(): Promise<ErpReception[]> {
    return this.client.get<ErpReception[]>(
      "receptions",
      this.getDeltaQuery(),
    );
  }

  async getShipments(): Promise<ErpShipment[]> {
    return this.client.get<ErpShipment[]>(
      "shipments",
      this.getDeltaQuery(),
    );
  }

  async getStock(): Promise<ErpStockItem[]> {
    return this.client.get<ErpStockItem[]>(
      "stock",
      this.getDeltaQuery(),
    );
  }

  async getEmployees(): Promise<ErpEmployee[]> {
    return this.client.get<ErpEmployee[]>(
      "employees",
      this.getDeltaQuery(),
    );
  }
}
