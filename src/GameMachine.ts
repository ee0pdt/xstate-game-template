import { Machine, send, assign } from "xstate";
import { log } from "xstate/lib/actions";

const INITIAL_POINTS = 0;
const INITIAL_LIVES = 3;

export interface PlayingStatesSchema {
  states: {
    idle: {};
    active: {};
  };
}

export interface GameStateSchema {
  states: {
    splashscreen: {};
    menu: {};
    playing: PlayingStatesSchema;
    gameover: {};
  };
}

export type EVENT_AWARD_POINTS = { type: "AWARD_POINTS"; total: number };

export type GameEvent =
  | EVENT_AWARD_POINTS
  | { type: "START_NEW_GAME" }
  | { type: "EXIT_TO_MENU" };

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
    idle: {},
    active: {},
    stop: {}
  }
};

export const gameMachine = Machine<GameContext, GameStateSchema, GameEvent>(
  {
    id: "game",
    initial: "splashscreen",
    context: INITIAL_STATE,
    on: {
      EXIT_TO_MENU: {
        target: "menu"
      }
    },
    states: {
      splashscreen: {},
      menu: {},
      playing: {
        initial: "idle",
        ...playingStates
      },
      gameover: {}
    }
  },
  {
    actions: {
      awardPoints: assign<GameContext>({
        points: (context: GameContext, event: EVENT_AWARD_POINTS) =>
          context.points + event.total
      })
    },
    guards: {
      gameIsOver: (context: GameContext, event: GameEvent) => {
        return context.lives > 1;
      }
    }
  }
);

export default gameMachine;
