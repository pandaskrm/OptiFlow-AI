import {
  WorkflowReception,
  nextStatus,
} from "./workflowEngine";
import { emitEvent } from "../events/eventBus";
import { WorkflowStatus } from "./workflowEngine";

let receptions: WorkflowReception[] = [];

let timer: NodeJS.Timeout | null = null;

const listeners = new Set<(data: WorkflowReception[]) => void>();

export function getWorkflowReceptions() {
  return receptions;
}

export function subscribeWorkflow(
  callback: (data: WorkflowReception[]) => void
) {
  listeners.add(callback);

  return () => {
    listeners.delete(callback);
  };
}

function notify() {
  listeners.forEach((callback) => callback([...receptions]));
}

export function initWorkflow(data: WorkflowReception[]) {
  receptions = [...data];
  notify();
}

export function startWorkflow() {
  if (timer) return;

  timer = setInterval(() => {
    receptions = receptions.map((reception) => {
      const previousStatus: WorkflowStatus = reception.status;
      const updated = nextStatus(reception);

      if (updated.status !== previousStatus) {
        switch (updated.status) {
          case "arriving":
            emitEvent("truck_arrived", updated);
            break;

          case "dock":
            emitEvent("dock_reserved", updated);
            break;

          case "unloading":
            emitEvent("unloading_started", updated);
            break;

          case "quality":
            emitEvent("quality_started", updated);
            break;

          case "completed":
            emitEvent("reception_completed", updated);
            break;
        }
      }

      return updated;
    });

    notify();
  }, 3000);
}

export function stopWorkflow() {
  if (!timer) return;

  clearInterval(timer);
  timer = null;
}