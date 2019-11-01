import { Machine, assign, MachineConfig, ActionFunctionMap } from "xstate";

const INITIAL_POINTS = 0;
const INITIAL_LIVES = 3;

const IDLE_TIME = 500;
const ACTIVE_TIME = 3000;
const EXPLODE_TIME = 1000;

export enum GameStates {
  Idle = "Idle",
  Active = "Active",
  Explode = "Explode",
  Gameover = "Gameover",
}

export interface GameStateSchema {
  states: {
    [GameStates.Idle]: {};
    [GameStates.Active]: {};
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
  initial: GameStates.Idle,
  context: INITIAL_CONTEXT,
  states: {
    [GameStates.Idle]: {
      after: {
        [IDLE_TIME]: GameStates.Active,
      },
      on: {
        [GameEventType.Clicked]: {
          actions: [GameActionType.AwardPoints],
        },
        "": [{ target: GameStates.Gameover, cond: GameGuardType.GameIsOver }],
      },
    },
    [GameStates.Active]: {
      after: {
        [ACTIVE_TIME]: GameStates.Idle,
      },
      on: {
        [GameEventType.Clicked]: {
          target: GameStates.Explode,
        },
      },
    },
    [GameStates.Explode]: {
      after: {
        [EXPLODE_TIME]: GameStates.Idle,
      },
      entry: [GameActionType.LoseLife],
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
