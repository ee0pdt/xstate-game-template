import { Machine, MachineConfig, ActionFunctionMap } from "xstate";

const SPLASHSCREEN_SHOW_TIME = 1000;

export enum AppStates {
  Splashscreen = "Splashscreen",
  Menu = "Menu",
  Playing = "Playing",
  Gameover = "Gameover"
}

export interface AppStateSchema {
  states: {
    [AppStates.Splashscreen]: {};
    [AppStates.Menu]: {};
    [AppStates.Playing]: {};
    [AppStates.Gameover]: {};
  };
}

export enum AppEventType {
  StartNewGame = "StartNewGame",
  ExitToMenu = "ExitToMenu"
}

export type AppEvent =
  | { type: AppEventType.StartNewGame }
  | { type: AppEventType.ExitToMenu };

export type AppContext = {};

const INITIAL_APP_CONTEXT = {};

export enum GameActionType {
  AwardPoints = "AwardPoints"
}

const appActions: ActionFunctionMap<AppContext, AppEvent> = {};

const appConfig: MachineConfig<AppContext, AppStateSchema, AppEvent> = {
  id: "app",
  initial: AppStates.Splashscreen,
  context: INITIAL_APP_CONTEXT,
  states: {
    [AppStates.Splashscreen]: {
      after: {
        [SPLASHSCREEN_SHOW_TIME]: AppStates.Menu
      }
    },
    [AppStates.Menu]: {
      on: {
        [AppEventType.StartNewGame]: {
          target: AppStates.Playing
        }
      }
    },
    [AppStates.Playing]: {
      on: {
        [AppEventType.ExitToMenu]: {
          target: AppStates.Menu
        }
      }
    },
    [AppStates.Gameover]: {}
  }
};

const appGuards = {};

export const appMachine = Machine<AppContext, AppStateSchema, AppEvent>(
  appConfig,
  {
    actions: appActions,
    guards: appGuards
  }
);

export default appMachine;
