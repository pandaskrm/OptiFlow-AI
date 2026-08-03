export type ErpProvider =
  | "local"
  | "sap"
  | "sage"
  | "odoo"
  | "dynamics"
  | "cegid"
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

export type ErpReception = {
  number: string;
  supplier: string;
  carrier: string;
  dock: string;
  pallets: number;
  status: string;
  scheduledAt: string;
};

export type ErpOrder = {
  number: string;
  customer: string;
  carrier?: string | null;
  priority: string;
  status: string;
  totalLines?: number;
  preparedLines?: number;
  scheduledAt?: string | null;
};

export type ErpShipment = {
  number: string;
  orderNumber?: string | null;
  customer: string;
  carrier: string;
  dock?: string | null;
  status: string;
  pallets?: number;
  packages?: number;
  scheduledAt?: string | null;
  shippedAt?: string | null;
};

export type ErpStockItem = {
  sku: string;
  label: string;
  location?: string | null;
  quantity: number;
  reserved?: number;
  minimum?: number;
};

export type ErpEmployee = {
  id: string;
  fullName: string;
  role: string;
  team?: string | null;
  zone?: string | null;
  status?: string;
  workedMinutes?: number;
  processedUnits?: number;
  workDate?: string | null;
};

export interface ErpConnectorData {
  orders: ErpOrder[];
  receptions: ErpReception[];
  shipments: ErpShipment[];
  stock: ErpStockItem[];
  employees: ErpEmployee[];
}

