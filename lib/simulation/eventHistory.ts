import { demoEvents } from "./demoEvents";

export type EventHistoryItem = {
  id: number;
  time: string;
  title: string;
  message: string;
  category: "event" | "ai" | "alert" | "action";
};

let history: EventHistoryItem[] = [];

function getEventCategory(
  title: string
): EventHistoryItem["category"] {
  const normalizedTitle = title.toLowerCase();

  if (normalizedTitle.includes("ia")) {
    return "ai";
  }

  if (
    normalizedTitle.includes("saturation") ||
    normalizedTitle.includes("écart") ||
    normalizedTitle.includes("contrôle supplémentaire") ||
    normalizedTitle.includes("chargé")
  ) {
    return "alert";
  }

  if (
    normalizedTitle.includes("terminée") ||
    normalizedTitle.includes("résolu") ||
    normalizedTitle.includes("clôturée")
  ) {
    return "action";
  }

  return "event";
}

export function addHistoryEvent(index: number) {
  const event = demoEvents[index];

  if (!event) {
    return history;
  }

  const item: EventHistoryItem = {
    id: Date.now(),
    time: new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    title: event.title,
    message: event.message,
    category: getEventCategory(event.title),
  };

  history = [item, ...history].slice(0, 20);

  return history;
}

export function addWorkflowHistoryEvent(
  title: string,
  message: string,
  category?: EventHistoryItem["category"]
) {
  const item: EventHistoryItem = {
    id: Date.now(),
    time: new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    title,
    message,
    category: category ?? getEventCategory(title),
  };

  history = [item, ...history].slice(0, 20);

  return history;
}

export function getHistoryEvents() {
  return history;
}

export function resetHistory() {
  history = [];
}