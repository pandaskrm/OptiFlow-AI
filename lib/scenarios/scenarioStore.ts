export type DemoScenario =
  | "normal"
  | "peak"
  | "black_friday"
  | "transport_issue"
  | "quality_alert";

let currentScenario: DemoScenario = "normal";

const listeners = new Set<(scenario: DemoScenario) => void>();

export function getScenario() {
  return currentScenario;
}

export function setScenario(scenario: DemoScenario) {
  currentScenario = scenario;

  listeners.forEach((listener) => listener(currentScenario));
}

export function subscribeScenario(
  callback: (scenario: DemoScenario) => void
) {
  listeners.add(callback);

  return () => listeners.delete(callback);
}