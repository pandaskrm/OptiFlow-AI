import {
  WorkflowReception,
  nextStatus,
} from "./workflowEngine";

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
    receptions = receptions.map(nextStatus);
    notify();
  }, 3000);
}

export function stopWorkflow() {
  if (!timer) return;

  clearInterval(timer);
  timer = null;
}