import { Machine } from "xstate";
import { GameEventType } from "../Game/GameMachine";

const EXPLODE_TIME = 1000;

export enum ThingStates {
  Idle = "Idle",
  Active = "Active",
  Success = "Success",
  Explode = "Explode",
}

export interface ThingStateSchema {
  states: {
    [ThingStates.Idle]: {};
    [ThingStates.Active]: {};
    [ThingStates.Success]: {};
    [ThingStates.Explode]: {};
  };
}

export enum ThingEventType {
  Clicked = "Clicked",
}

export type ThingEvent = { type: ThingEventType.Clicked };

export type ThingContext = {};

const INITIAL_CONTEXT = {};

export enum ThingActionType {
  AwardPoints = "AwardPoints",
  LoseLife = "LoseLife",
}

export const thingMachine = (sendToGame, activeTime: number) =>
  Machine<ThingContext, ThingStateSchema, ThingEvent>({
    id: "thing",
    initial: ThingStates.Active,
    context: INITIAL_CONTEXT,
    states: {
      [ThingStates.Idle]: {
        after: {
          [Math.random() * 5000 + 2000]: ThingStates.Active,
        },
        on: {
          [ThingEventType.Clicked]: {
            actions: () => console.log("clicked: success"),
            target: [ThingStates.Success],
          },
        },
      },
      [ThingStates.Active]: {
        after: {
          [activeTime]: ThingStates.Idle,
        },
        on: {
          [ThingEventType.Clicked]: {
            actions: () => console.log("clicked: fail"),
            target: ThingStates.Explode,
          },
        },
      },
      [ThingStates.Explode]: {
        after: {
          [EXPLODE_TIME]: ThingStates.Active,
        },
        entry: [() => sendToGame({ type: GameEventType.LoseLife })],
      },
      [ThingStates.Success]: {
        after: {
          [EXPLODE_TIME]: ThingStates.Active,
        },
        entry: [
          () => console.log("success sending award points"),
          () => console.log(sendToGame),
          () =>
            sendToGame({
              type: GameEventType.AwardPoints,
              total: 10,
            }),
        ],
      },
    },
  });

export default thingMachine;
