import {
  Machine,
  send,
  assign,
  MachineConfig,
  ActionFunctionMap
} from "xstate";
import { log } from "xstate/lib/actions";

const INITIAL_POINTS = 0;
const INITIAL_LIVES = 3;

export enum PlayingStates {
  Idle = "Idle",
  Active = "Active"
}

export interface PlayingStatesSchema {
  states: {
    [PlayingStates.Idle]: {};
    [PlayingStates.Active]: {};
  };
}

export enum GameStates {
  Splashscreen = "Splashscreen",
  Menu = "Menu",
  Playing = "Playing",
  Gameover = "Gameover"
}

export interface GameStateSchema {
  states: {
    [GameStates.Splashscreen]: {};
    [GameStates.Menu]: {};
    [GameStates.Playing]: PlayingStatesSchema;
    [GameStates.Gameover]: {};
  };
}

export enum GameEventType {
  AwardPoints = "AWARD_POINTS",
  StartNewGame = "START_NEW_GAME",
  ExitToMenu = "EXIT_TO_MENU"
}

export type EVENT_AWARD_POINTS = {
  type: GameEventType.AwardPoints;
  total: number;
};

export type GameEvent =
  | EVENT_AWARD_POINTS
  | { type: GameEventType.StartNewGame }
  | { type: GameEventType.ExitToMenu };

export type GameContext = {
  points: number;
  lives: number;
};

const INITIAL_STATE = {
  points: INITIAL_POINTS,
  lives: INITIAL_LIVES
};

const playingStates = {
  states: {
    [PlayingStates.Idle]: {},
    [PlayingStates.Active]: {}
  }
};

const gameConfig: MachineConfig<GameContext, GameStateSchema, GameEvent> = {
  id: "game",
  initial: GameStates.Splashscreen,
  context: INITIAL_STATE,
  on: {
    EXIT_TO_MENU: {
      target: GameStates.Menu
    }
  },
  states: {
    [GameStates.Splashscreen]: {
      after: {
        1000: GameStates.Menu
      }
    },
    [GameStates.Menu]: {
      on: {
        [GameEventType.StartNewGame]: {
          target: GameStates.Playing
        }
      }
    },
    [GameStates.Playing]: {
      initial: PlayingStates.Idle,
      ...playingStates
    },
    [GameStates.Gameover]: {}
  }
};

const gameActions: ActionFunctionMap<GameContext, GameEvent> = {
  awardPoints: assign<GameContext>({
    points: (context: GameContext, event: EVENT_AWARD_POINTS) =>
      context.points + event.total
  })
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
