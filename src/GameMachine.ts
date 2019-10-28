import { Machine, assign, MachineConfig, ActionFunctionMap } from "xstate";

const INITIAL_POINTS = 0;
const INITIAL_LIVES = 3;
const SPLASHSCREEN_SHOW_TIME = 1000;

const IDLE_TIME = 1000;
const ACTIVE_TIME = 3000;

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

const playingStates = {
  states: {
    [PlayingStates.Idle]: {
      after: {
        [IDLE_TIME]: PlayingStates.Active
      }
    },
    [PlayingStates.Active]: {
      after: {
        [ACTIVE_TIME]: PlayingStates.Idle
      }
    }
  }
};

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
  AwardPoints = "AwardPoints",
  StartNewGame = "StartNewGame",
  ExitToMenu = "ExitToMenu"
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
  initial: GameStates.Splashscreen,
  context: INITIAL_CONTEXT,
  states: {
    [GameStates.Splashscreen]: {
      after: {
        [SPLASHSCREEN_SHOW_TIME]: GameStates.Menu
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
      ...playingStates,
      on: {
        [GameEventType.ExitToMenu]: {
          target: GameStates.Menu
        },
        [GameEventType.AwardPoints]: {
          actions: [GameActionType.AwardPoints]
        }
      }
    },
    [GameStates.Gameover]: {}
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
