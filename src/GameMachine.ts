import { Machine, send, assign } from "xstate";
import { log } from "xstate/lib/actions";

const INITIAL_POINTS = 0;
const INITIAL_LIVES = 3;

export interface GameStateSchema {
  states: {
    splashscreen: {};
    menu: {};
    playing: {};
    gameover: {};
  };
}

export interface EVENT_AWARD_POINTS {
  total: number;
}
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
  initial: "walk",
  states: {
    idle: {
      on: {
        PED_COUNTDOWN: "wait"
      }
    },
    active: {
      on: {
        PED_COUNTDOWN: "stop"
      }
    },
    stop: {}
  }
};

export const gameMachine = Machine<GameContext, GameStateSchema, GameEvent>(
  {
    id: "game",
    initial: "playing",
    context: INITIAL_STATE,
    on: {
      EXIT_TO_MENU: {
        target: "menu"
      }
    },
    states: {
      win: {},
      lose: {},
      playing: {
        entry: assign<GameContext>({
          ...INITIAL_STATE
        }),
        on: {
          "": [{ target: "gameover", cond: "gameIsOver" }],
          AWARD_POINTS: {
            actions: assign<GameContext>({
              points: (context: GameContext, event: EVENT_AWARD_POINTS) =>
                context.points + event.total
            })
          }
        }
      }
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
        // check if player won
        return context.lives > 1;
      }
    }
  }
);

export default gameMachine;
