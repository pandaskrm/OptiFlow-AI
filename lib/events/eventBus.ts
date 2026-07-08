export type OptiFlowEvent =
  | "truck_arrived"
  | "dock_reserved"
  | "unloading_started"
  | "quality_started"
  | "reception_completed";

type EventCallback = (
  event: OptiFlowEvent,
  payload?: unknown
) => void;

const listeners = new Set<EventCallback>();

export function emitEvent(
  event: OptiFlowEvent,
  payload?: unknown
) {
  listeners.forEach((listener) => listener(event, payload));
}

export function subscribeEvents(
  callback: EventCallback
) {
  listeners.add(callback);

  return () => {
    listeners.delete(callback);
  };
}