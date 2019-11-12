import { Machine, assign, MachineConfig, ActionFunctionMap } from "xstate";
import { ThingEventType } from "../Thing/ThingMachine";

const INITIAL_POINTS = 0;
const INITIAL_LIVES = 3;

const IDLE_TIME = 800;
const ACTIVE_TIME = 3000;
const EXPLODE_TIME = 1000;

export enum GameStates {
  Active = "Active",
  Success = "Success",
  Explode = "Explode",
  Gameover = "Gameover",
}

export interface GameStateSchema {
  states: {
    [GameStates.Active]: {};
    [GameStates.Success]: {};
    [GameStates.Explode]: {};
    [GameStates.Gameover]: {};
  };
}

export enum GameEventType {
  AwardPoints = "AwardPoints",
  ExitToMenu = "ExitToMenu",
  Clicked = "Clicked",
  LoseLife = "LoseLife",
}

export type EVENT_AWARD_POINTS = {
  type: GameEventType.AwardPoints;
  total: number;
};

export type GameEvent =
  | EVENT_AWARD_POINTS
  | { type: GameEventType.ExitToMenu }
  | { type: GameEventType.Clicked }
  | { type: GameEventType.LoseLife };

export type GameContext = {
  points: number;
  lives: number;
};

const INITIAL_CONTEXT = {
  points: INITIAL_POINTS,
  lives: INITIAL_LIVES,
};

export enum GameActionType {
  AwardPoints = "AwardPoints",
  LoseLife = "LoseLife",
}

const gameActions: ActionFunctionMap<GameContext, GameEvent> = {
  [GameActionType.AwardPoints]: assign<GameContext>({
    points: (context: GameContext, event: GameEvent) => context.points + 10,
  }),

  [GameActionType.LoseLife]: assign<GameContext>({
    lives: (context: GameContext) => context.lives - 1,
  }),
};

export enum GameGuardType {
  GameIsOver = "GameIsOver",
}

const gameGuards = {
  [GameGuardType.GameIsOver]: (context: GameContext, event: GameEvent) => {
    return context.lives < 1;
  },
};

const gameConfig: MachineConfig<GameContext, GameStateSchema, GameEvent> = {
  id: "game",
  initial: GameStates.Active,
  context: INITIAL_CONTEXT,
  states: {
    // [GameStates.Idle]: {
    //   after: {
    //     [IDLE_TIME]: GameStates.Active,
    //   },
    //   on: {
    //     [ThingEventType.Clicked]: {
    //       target: [GameStates.Success],
    //     },
    //   },
    // },
    [GameStates.Active]: {
      on: {
        "": [{ target: GameStates.Gameover, cond: GameGuardType.GameIsOver }],
        [GameEventType.AwardPoints]: {
          actions: [GameActionType.AwardPoints],
        },
      },
    },
    [GameStates.Explode]: {
      after: {
        [EXPLODE_TIME]: GameStates.Active,
      },
      entry: [GameActionType.LoseLife],
    },
    [GameStates.Success]: {
      after: {
        [EXPLODE_TIME]: GameStates.Active,
      },
      entry: [GameActionType.AwardPoints],
    },
    [GameStates.Gameover]: {},
  },
};

export const gameMachine = Machine<GameContext, GameStateSchema, GameEvent>(
  gameConfig,
  {
    actions: gameActions,
    guards: gameGuards,
  },
);

export default gameMachine;
