import * as React from "react";
import { useMachine } from "@xstate/react";
import gameMachine, { GameContext } from "./GameMachine";
import ErrorBoundary from "./Components/ErrorBoundary";

export const Game = () => {
  const [current, send] = useMachine(gameMachine);
  const context = current.context as GameContext;

  return (
    <ErrorBoundary>
      <p>{context.points}</p>
    </ErrorBoundary>
  );
};

export default Game;
