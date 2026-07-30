import type { ErpConnector } from "./erpConnector";
import type { ErpDataSource } from "./types";

export class LocalDatabaseConnector implements ErpConnector {
  async getDataSource(): Promise<ErpDataSource> {
    return {
      provider: "local",
      connected: false,
      lastSyncAt: null,
    };
  }
}