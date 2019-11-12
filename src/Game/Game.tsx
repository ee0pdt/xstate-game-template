import * as React from "react";
import Button from "@material-ui/core/Button";
import gameMachine, { GameEventType, GameStates } from "./GameMachine";
import { useMachine } from "@xstate/react";
import { AppEventType } from "../App/AppMachine";
import { Canvas } from "react-three-fiber";
import Thing, { ThingModel } from "../Thing/Thing";

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

  const thingModel = {
    id: 1,
    type: "cube",
    position: { x: 1, y: 1, z: 1 },
  } as ThingModel;

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
            key="thing"
            gameState={current.value as GameStates}
            onClick={() => {
              send({ type: GameEventType.Clicked });
            }}
            model={thingModel}
            sendToGame={send}
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
