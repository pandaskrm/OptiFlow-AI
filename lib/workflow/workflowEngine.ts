export type WorkflowStatus =
  | "planned"
  | "arriving"
  | "dock"
  | "unloading"
  | "quality"
  | "completed";

export interface WorkflowReception {
  id: number;
  receptionNumber: string;
  supplier: string;
  carrier: string;
  dock: number;
  pallets: number;
  progress: number;
  status: WorkflowStatus;
}

export function nextStatus(
  reception: WorkflowReception
): WorkflowReception {
  switch (reception.status) {
    case "planned":
      return {
        ...reception,
        status: "arriving",
      };

    case "arriving":
      return {
        ...reception,
        status: "dock",
      };

    case "dock":
      return {
        ...reception,
        status: "unloading",
        progress: 5,
      };

    case "unloading": {
      const progress = Math.min(
        reception.progress + 20,
        100
      );

      if (progress >= 100) {
        return {
          ...reception,
          progress,
          status: "quality",
        };
      }

      return {
        ...reception,
        progress,
      };
    }

    case "quality":
      return {
        ...reception,
        status: "completed",
      };

    default:
      return reception;
  }
}