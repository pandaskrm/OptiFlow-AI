import type { ErpConnector } from "./erpConnector";
import { LocalDatabaseConnector } from "./localDatabaseConnector";

export function getErpConnector(): ErpConnector {
  return new LocalDatabaseConnector();
}
