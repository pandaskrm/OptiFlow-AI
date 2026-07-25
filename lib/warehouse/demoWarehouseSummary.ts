import { WorkflowReception } from "../workflow/workflowEngine";

export type DemoWarehouseSummary = {
  total: number;
  planned: number;
  atDock: number;
  unloading: number;
  inspection: number;
  completed: number;
  occupiedDocks: number;
  totalPallets: number;
};

export function buildDemoWarehouseSummary(
  receptions: WorkflowReception[]
): DemoWarehouseSummary {
  return {
    total: receptions.length,

    planned: receptions.filter(
      (r) => r.status === "planned" || r.status === "arriving"
    ).length,

    atDock: receptions.filter(
      (r) => r.status === "dock"
    ).length,

    unloading: receptions.filter(
      (r) => r.status === "unloading"
    ).length,

    inspection: receptions.filter(
      (r) => r.status === "quality"
    ).length,

    completed: receptions.filter(
      (r) => r.status === "completed"
    ).length,

    occupiedDocks: new Set(
      receptions
        .filter((r) =>
          ["dock", "unloading", "quality"].includes(r.status)
        )
        .map((r) => r.dock)
    ).size,

    totalPallets: receptions.reduce(
      (total, r) => total + r.pallets,
      0
    ),
  };
}