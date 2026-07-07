import { demoEvents } from "./demoEvents";
import { demoMessages } from "./demoMessages";
import type { DemoEvent, DemoState } from "./demoTypes";

const initialState: DemoState = {
  status: "stopped",
  currentStep: 0,
  kpi: {
    trucks: 2,
    occupiedDocks: 1,
    receptions: 18,
    finished: 12,
    health: 98,
    alerts: 0,
    pallets: 142,
  },
  events: [],
  aiMessage: demoMessages[0],
};

export class DemoEngine {
  private state: DemoState = structuredClone(initialState);

  public reset() {
    this.state = structuredClone(initialState);
    return this.state;
  }

  public getState() {
    return this.state;
  }

  public next(): DemoState {
    if (this.state.currentStep >= demoEvents.length) {
      this.state.status = "stopped";
      return this.state;
    }

    this.state.status = "running";

    const event: DemoEvent = demoEvents[this.state.currentStep];

    this.state.events.unshift(event);

    switch (event.type) {
      case "truck-arrival":
        this.state.kpi.trucks++;
        break;

      case "unloading":
        this.state.kpi.occupiedDocks++;
        break;

      case "finished":
        this.state.kpi.finished++;
        this.state.kpi.receptions++;
        this.state.kpi.occupiedDocks = Math.max(
          0,
          this.state.kpi.occupiedDocks - 1
        );
        break;

      case "alert":
        this.state.kpi.alerts++;
        this.state.kpi.health -= 2;
        break;

      case "quality":
        this.state.kpi.health = Math.min(100, this.state.kpi.health + 1);
        break;
    }

    this.state.aiMessage =
      demoMessages[this.state.currentStep % demoMessages.length];

    this.state.currentStep++;

    return this.state;
  }
}

export const demoEngine = new DemoEngine();