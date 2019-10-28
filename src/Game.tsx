import * as React from "react";
import { useMachine } from "@xstate/react";
import gameMachine, { GameStates } from "./GameMachine";
import Splashscreen from "./Components/Splashscreen";
import Menu from "./Components/Menu";
import Playing from "./Components/Playing";

export const Game = () => {
  const [current, send] = useMachine(gameMachine);

  // console.table(current.value);
  const state =
    typeof current.value === "object"
      ? Object.keys(current.value)[0]
      : current.value;

  switch (state) {
    case GameStates.Splashscreen: {
      return <Splashscreen />;
    }
    case GameStates.Menu: {
      return <Menu send={send} />;
    }
    case GameStates.Playing: {
      return (
        <Playing gameState={current.value[GameStates.Playing]} send={send} />
      );
    }
    default: {
      return <p>State not known</p>;
    }
  }
};

export default Game;
