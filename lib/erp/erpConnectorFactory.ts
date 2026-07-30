import { ConfiguredErpConnector } from "./configuredErpConnector";
import type { ErpConnector } from "./erpConnector";
import { LocalDatabaseConnector } from "./localDatabaseConnector";
import type { ErpProvider } from "./types";

type ErpConnectorFactoryConfig = {
  provider: string;
  name: string;
  status: string;
  isEnabled: boolean;
  lastSyncedAt: Date | null;
};

const supportedProviders: ErpProvider[] = [
  "local",
  "sap",
  "sage",
  "odoo",
  "dynamics",
  "cegid",
  "api",
  "csv",
];

function isErpProvider(value: string): value is ErpProvider {
  return supportedProviders.includes(value as ErpProvider);
}

export function getErpConnector(
  config?: ErpConnectorFactoryConfig | null
): ErpConnector {
  if (!config || !config.isEnabled) {
    return new LocalDatabaseConnector();
  }

  if (!isErpProvider(config.provider)) {
    return new LocalDatabaseConnector();
  }

  return new ConfiguredErpConnector({
    provider: config.provider,
    name: config.name,
    status: config.status,
    lastSyncAt: config.lastSyncedAt,
  });
}