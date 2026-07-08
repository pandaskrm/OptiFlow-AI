import {
  WorkflowReception,
  nextStatus,
  WorkflowStatus,
} from "./workflowEngine";

import { emitEvent } from "../events/eventBus";
import { addWorkflowHistoryEvent } from "../simulation/eventHistory";
import { getScenario, subscribeScenario } from "../scenarios/scenarioStore";

let receptions: WorkflowReception[] = [];
let timer: NodeJS.Timeout | null = null;

const listeners = new Set<(data: WorkflowReception[]) => void>();

function getScenarioDelay() {
  const scenario = getScenario();

  switch (scenario) {
    case "peak":
      return 2200;
    case "black_friday":
      return 1400;
    case "transport_issue":
      return 5000;
    case "quality_alert":
      return 3000;
    default:
      return 3000;
  }
}

function notify() {
  listeners.forEach((callback) => callback([...receptions]));
}

function publishWorkflowEvent(
  status: WorkflowStatus,
  updated: WorkflowReception
) {
  switch (status) {
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

function tickWorkflow() {
  receptions = receptions.map((reception) => {
    const previousStatus: WorkflowStatus = reception.status;
    let updated = nextStatus(reception);

    if (getScenario() === "quality_alert" && updated.status === "completed") {
      updated = {
        ...updated,
        status: "quality",
        progress: 95,
      };
    }

    if (updated.status !== previousStatus) {
      publishWorkflowEvent(updated.status, updated);
    }

    return updated;
  });

  notify();
}

function restartWorkflowTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }

  timer = setInterval(tickWorkflow, getScenarioDelay());
}

subscribeScenario(() => {
  if (timer) {
    restartWorkflowTimer();
  }

  addWorkflowHistoryEvent(
    "🎬 Scénario changé",
    `Nouveau scénario actif : ${getScenario()}.`,
    "ai"
  );

  notify();
});

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

export function initWorkflow(data: WorkflowReception[]) {
  receptions = [...data];
  notify();
}

export function startWorkflow() {
  if (timer) return;

  restartWorkflowTimer();
}

export function stopWorkflow() {
  if (!timer) return;

  clearInterval(timer);
  timer = null;
}