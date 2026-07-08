import { getScenario } from "../scenarios/scenarioStore";

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

function getProgressIncrement() {
  switch (getScenario()) {
    case "peak":
      return 30;

    case "black_friday":
      return 40;

    case "transport_issue":
      return 10;

    case "quality_alert":
      return 20;

    default:
      return 20;
  }
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
        reception.progress + getProgressIncrement(),
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

    case "quality": {
      if (
        getScenario() === "quality_alert" &&
        Math.random() < 0.6
      ) {
        return reception;
      }

      return {
        ...reception,
        status: "completed",
      };
    }

    default:
      return reception;
  }
}