export type LibotGesture =
  | "idle"
  | "talk"
  | "wave"
  | "point"
  | "present"
  | "confirm";

export type LibotBehavior = {
  speaking: boolean;
  thinking: boolean;
  gesture: LibotGesture;
};

export const LIBOT_BEHAVIOR_EVENT =
  "optiflow:libot-behavior";

export function emitLibotBehavior(
  behavior: Partial<LibotBehavior>,
) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent<Partial<LibotBehavior>>(
      LIBOT_BEHAVIOR_EVENT,
      {
        detail: behavior,
      },
    ),
  );
}