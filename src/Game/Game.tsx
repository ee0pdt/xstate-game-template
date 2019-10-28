import * as React from "react";
import Button from "@material-ui/core/Button";
import gameMachine, { GameEventType, GameStates } from "./GameMachine";
import { useMachine } from "@xstate/react";
import { AppEventType } from "../App/AppMachine";

interface IGameProps {}

export const GameStateIndicator = ({
  gameState
}: {
  gameState: GameStates;
}) => {
  switch (gameState) {
    case GameStates.Idle: {
      return <p>idle</p>;
    }
    default: {
      return <p>active</p>;
    }
  }
};

export const Game = ({ sendToApp }) => {
  const [current, sendToGameMachine] = useMachine(gameMachine);

  return (
    <div>
      <GameStateIndicator gameState={current.value as GameStates} />
      <Button
        variant="contained"
        onClick={() => sendToApp(AppEventType.ExitToMenu)}
      >
        Exit to Menu
      </Button>
    </div>
  );
};

export default Game;
