import {
  WorkflowReception,
  nextStatus,
  WorkflowStatus,
} from "./workflowEngine";

import { emitEvent } from "../events/eventBus";
import { addWorkflowHistoryEvent } from "../simulation/eventHistory";

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
            addWorkflowHistoryEvent(
              "🚚 Camion annoncé",
              `${updated.carrier} arrive au quai ${updated.dock}.`,
              "event"
            );
            break;

          case "dock":
            emitEvent("dock_reserved", updated);
            addWorkflowHistoryEvent(
              "🚪 Quai réservé",
              `${updated.receptionNumber} est maintenant à quai.`,
              "action"
            );
            break;

          case "unloading":
            emitEvent("unloading_started", updated);
            addWorkflowHistoryEvent(
              "📦 Déchargement",
              `Déchargement en cours pour ${updated.receptionNumber}.`,
              "event"
            );
            break;

          case "quality":
            emitEvent("quality_started", updated);
            addWorkflowHistoryEvent(
              "🔍 Contrôle qualité",
              `Contrôle qualité lancé pour ${updated.receptionNumber}.`,
              "alert"
            );
            break;

          case "completed":
            emitEvent("reception_completed", updated);
            addWorkflowHistoryEvent(
              "✅ Réception terminée",
              `${updated.receptionNumber} est terminée.`,
              "action"
            );
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