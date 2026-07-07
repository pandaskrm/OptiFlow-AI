import { demoEvents } from "./demoEvents";

export type EventHistoryItem = {
  id: number;
  time: string;
  title: string;
  message: string;
  category: "event" | "ai" | "alert" | "action";
};

let history: EventHistoryItem[] = [];

export function addHistoryEvent(index: number) {
  const event = demoEvents[index];

  const item: EventHistoryItem = {
    id: Date.now(),
    time: new Date().toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    title: event.title,
    message: event.message,
    category: event.title.includes("IA")
      ? "ai"
      : event.title.includes("Saturation")
      ? "alert"
      : event.title.includes("terminée")
      ? "action"
      : "event",
  };

  history = [item, ...history].slice(0, 8);

  return history;
}

export function getHistoryEvents() {
  return history;
}

export function resetHistory() {
  history = [];
}