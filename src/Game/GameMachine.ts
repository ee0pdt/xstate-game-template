import { Machine, assign, MachineConfig, ActionFunctionMap } from "xstate";

const INITIAL_POINTS = 0;
const INITIAL_LIVES = 3;

const IDLE_TIME = 1000;
const ACTIVE_TIME = 3000;

export enum GameStates {
  Idle = "Idle",
  Active = "Active"
}

export interface GameStateSchema {
  states: {
    [GameStates.Idle]: {};
    [GameStates.Active]: {};
  };
}

export enum GameEventType {
  AwardPoints = "AwardPoints",
  ExitToMenu = "ExitToMenu"
}

export type EVENT_AWARD_POINTS = {
  type: GameEventType.AwardPoints;
  total: number;
};

export type GameEvent = EVENT_AWARD_POINTS | { type: GameEventType.ExitToMenu };

export type GameContext = {
  points: number;
  lives: number;
};

const INITIAL_CONTEXT = {
  points: INITIAL_POINTS,
  lives: INITIAL_LIVES
};

export enum GameActionType {
  AwardPoints = "AwardPoints"
}

const gameActions: ActionFunctionMap<GameContext, GameEvent> = {
  [GameActionType.AwardPoints]: assign<GameContext>({
    points: (context: GameContext, event: EVENT_AWARD_POINTS) =>
      context.points + event.total
  })
};

const gameConfig: MachineConfig<GameContext, GameStateSchema, GameEvent> = {
  id: "game",
  initial: GameStates.Idle,
  context: INITIAL_CONTEXT,
  states: {
    [GameStates.Idle]: {
      after: {
        [IDLE_TIME]: GameStates.Active
      }
    },
    [GameStates.Active]: {
      after: {
        [ACTIVE_TIME]: GameStates.Idle
      }
    }
  }
};

const gameGuards = {
  gameIsOver: (context: GameContext, event: GameEvent) => {
    return context.lives > 1;
  }
};

export const gameMachine = Machine<GameContext, GameStateSchema, GameEvent>(
  gameConfig,
  {
    actions: gameActions,
    guards: gameGuards
  }
);

export default gameMachine;
