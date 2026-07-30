import type { ErpDataSource } from "./types";

export interface ErpConnector {
  getDataSource(): Promise<ErpDataSource>;
}