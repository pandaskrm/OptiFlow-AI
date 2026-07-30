import type { ErpProvider } from "../types";

export type ErpProviderOption = {
  value: ErpProvider;
  label: string;
  description: string;
};

export const erpProviderOptions: ErpProviderOption[] = [
  {
    value: "local",
    label: "Base locale",
    description: "Données locales OptiFlow AI sans connexion ERP externe.",
  },
  {
    value: "odoo",
    label: "Odoo",
    description: "Connexion à Odoo via son API.",
  },
  {
    value: "sage",
    label: "Sage",
    description: "Connexion aux solutions Sage compatibles.",
  },
  {
    value: "sap",
    label: "SAP",
    description: "Connexion aux environnements SAP.",
  },
  {
    value: "dynamics",
    label: "Microsoft Dynamics",
    description: "Connexion à Microsoft Dynamics 365.",
  },
  {
    value: "cegid",
    label: "Cegid",
    description: "Connexion aux solutions Cegid.",
  },
  {
    value: "api",
    label: "API personnalisée",
    description: "Connexion à une API métier ou à un ERP non référencé.",
  },
  {
    value: "csv",
    label: "Import CSV",
    description: "Import manuel de données à partir de fichiers CSV.",
  },
];
