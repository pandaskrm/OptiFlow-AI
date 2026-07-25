import { WorkflowReception } from "../workflow/workflowEngine";

export type WarehouseReceptionAdapter = {
  id: number;
  number: string;
  supplier: string;
  carrier: string;
  dock: string;
  pallets: number;
  status: string;
  scheduledAt: string;
};

export function adaptWorkflowReception(
  reception: WorkflowReception
): WarehouseReceptionAdapter {
  const statusMap: Record<WorkflowReception["status"], string> = {
    planned: "Planifiée",
    arriving: "Planifiée",
    dock: "À quai",
    unloading: "Déchargement",
    quality: "Contrôle qualité",
    completed: "Terminée",
  };

  return {
    id: reception.id,
    number: reception.receptionNumber,
    supplier: reception.supplier,
    carrier: reception.carrier,
    dock: String(reception.dock),
    pallets: reception.pallets,
    status: statusMap[reception.status],
    scheduledAt: new Date().toISOString(),
  };
}