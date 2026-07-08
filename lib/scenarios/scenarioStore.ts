export type DemoScenario =
  | "normal"
  | "peak"
  | "black_friday"
  | "transport_issue"
  | "quality_alert";

const autoplaySequence: DemoScenario[] = [
  "normal",
  "peak",
  "black_friday",
  "transport_issue",
  "quality_alert",
];

let currentScenario: DemoScenario = "normal";

let autoplay = false;
let autoplayTimer: NodeJS.Timeout | null = null;

const listeners = new Set<(scenario: DemoScenario) => void>();

function notify() {
  listeners.forEach((listener) => listener(currentScenario));
}

export function getScenario() {
  return currentScenario;
}

export function isAutoplayRunning() {
  return autoplay;
}

export function setScenario(scenario: DemoScenario) {
  currentScenario = scenario;
  notify();
}

export function subscribeScenario(
  callback: (scenario: DemoScenario) => void
) {
  listeners.add(callback);

  return () => {
    listeners.delete(callback);
  };
}

export function startScenarioAutoplay() {
  if (autoplay) return;

  autoplay = true;

  let index = autoplaySequence.indexOf(currentScenario);

  autoplayTimer = setInterval(() => {
    index = (index + 1) % autoplaySequence.length;

    currentScenario = autoplaySequence[index];

    notify();
  }, 30000); // changement toutes les 30 secondes
}

export function stopScenarioAutoplay() {
  autoplay = false;

  if (autoplayTimer) {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
}