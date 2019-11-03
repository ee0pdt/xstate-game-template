import * as React from "react";
import Button from "@material-ui/core/Button";
import gameMachine, { GameEventType, GameStates } from "./GameMachine";
import Thing from "../Thing/Thing";
import { useMachine } from "@xstate/react";
import { AppEventType } from "../App/AppMachine";
import { Canvas } from "react-three-fiber";

export const GameStateIndicator = ({
  gameState,
}: {
  gameState: GameStates;
}) => {
  switch (gameState) {
    case GameStates.Idle: {
      return <p>🔵</p>;
    }
    default: {
      return <p>🔴</p>;
    }
  }
};

export const Game = ({ sendToApp }) => {
  const [current, send] = useMachine(gameMachine);
  // const things = Object.values(current.context.things);

  return (
    <div>
      <GameStateIndicator gameState={current.value as GameStates} />
      <p>Points: {current.context.points}</p>
      <p>Lives: {current.context.lives}</p>
      {current.value === GameStates.Gameover ? (
        <h1>GAME OVER</h1>
      ) : (
        <Canvas style={{ height: 400 }}>
          <Thing
            gameState={current.value as GameStates}
            onClick={() => {
              send({ type: GameEventType.Clicked });
            }}
          />
        </Canvas>
      )}
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
