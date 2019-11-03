import { Machine, assign, MachineConfig, ActionFunctionMap } from "xstate";
import { ReactThreeFiber } from "react-three-fiber";

const INITIAL_POINTS = 0;
const INITIAL_LIVES = 3;

const IDLE_TIME = 800;
const ACTIVE_TIME = 3000;
const EXPLODE_TIME = 1000;

export enum GameStates {
  Idle = "Idle",
  Active = "Active",
  Success = "Success",
  Explode = "Explode",
  Gameover = "Gameover",
}

export interface GameStateSchema {
  states: {
    [GameStates.Idle]: {};
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
}

export type EVENT_AWARD_POINTS = {
  type: GameEventType.AwardPoints;
  total: number;
};

export type GameEvent =
  | EVENT_AWARD_POINTS
  | { type: GameEventType.ExitToMenu }
  | { type: GameEventType.Clicked };

export interface ThingModel {
  id: number;
  type: string;
  position: ReactThreeFiber.Vector3;
}

export type GameContext = {
  points: number;
  lives: number;
  things: { [key: number]: ThingModel };
};

const INITIAL_CONTEXT = {
  points: INITIAL_POINTS,
  lives: INITIAL_LIVES,
  things: {
    1: { id: 1, type: "cube", position: [0.1, 0, 0] },
    2: { id: 2, type: "cube", position: [0, 0.1, 0] },
    3: { id: 3, type: "cube", position: [0, 0, 0.1] },
  },
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
    [GameStates.Idle]: {
      after: {
        [IDLE_TIME]: GameStates.Active,
      },
      on: {
        [GameEventType.Clicked]: {
          target: [GameStates.Success],
        },
      },
    },
    [GameStates.Active]: {
      after: {
        [ACTIVE_TIME]: GameStates.Idle,
      },
      on: {
        "": [{ target: GameStates.Gameover, cond: GameGuardType.GameIsOver }],
        [GameEventType.Clicked]: {
          target: GameStates.Explode,
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
