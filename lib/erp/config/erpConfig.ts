import type { ErpProvider } from "../types";

export type ErpConnectionConfig = {
  provider: ErpProvider;
  name: string;
  apiUrl: string;
  apiKey: string;
  companyId: string;
  enabled: boolean;
};

export const defaultErpConnectionConfig: ErpConnectionConfig = {
  provider: "local",
  name: "Base locale",
  apiUrl: "",
  apiKey: "",
  companyId: "",
  enabled: false,
};