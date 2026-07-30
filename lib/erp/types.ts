export type ErpProvider =
  | "local"
  | "sap"
  | "sage"
  | "odoo"
  | "dynamics"
  | "api"
  | "csv";

export type ErpConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

export type ErpConnection = {
  provider: ErpProvider;
  status: ErpConnectionStatus;
  name: string;
  lastSyncAt: string | null;
  errorMessage: string | null;
};

export type ErpDataSource = {
  provider: ErpProvider;
  connected: boolean;
  name: string;
  lastSyncAt: string | null;
};