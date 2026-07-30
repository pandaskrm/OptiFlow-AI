import type { ErpConnector } from "./erpConnector";
import type {
  ErpConnectionStatus,
  ErpDataSource,
  ErpProvider,
} from "./types";

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
}