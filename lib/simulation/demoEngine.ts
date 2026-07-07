import { getDemoEvents } from "./eventGenerator";

let currentIndex = 0;

export function resetDemo() {
  currentIndex = 0;
}

export function nextDemoEvent() {
  const events = getDemoEvents();

  if (currentIndex >= events.length) {
    currentIndex = 0;
  }

  return events[currentIndex++];
}