import * as React from "react";
import Button from "@material-ui/core/Button";
import gameMachine, { GameEventType, GameStates } from "./GameMachine";
import { useMachine } from "@xstate/react";
import { AppEventType } from "../App/AppMachine";
import { Canvas, useFrame, ReactThreeFiber } from "react-three-fiber";
import { useRef } from "react";
import { Mesh } from "three";

interface IGameProps {}

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

interface IThingProps {
  gameState: GameStates;
  onClick: () => void;
}

function Thing({ gameState, onClick }: IThingProps) {
  const ref = useRef<ReactThreeFiber.Object3DNode<Mesh, typeof Mesh>>();
  useFrame((state, delta) => {
    ref.current.position.x = Math.sin(state.clock.elapsedTime) * 2;
    ref.current.position.y = Math.cos(state.clock.elapsedTime) * 2;
    ref.current.rotation.x = ref.current.rotation.y += 0.02;

    switch (gameState) {
      case GameStates.Active: {
        ref.current.material.opacity = 0.5;
        ref.current.scale.x = 1;
        ref.current.scale.y = 1;
        ref.current.scale.z = 1;
        break;
      }
      case GameStates.Idle: {
        ref.current.material.opacity = 1;
        // ref.current.scale.x = 0.5;
        // ref.current.scale.y = 0.5;
        // ref.current.scale.z = 0.5;
        break;
      }
      case GameStates.Success: {
        ref.current.scale.x = ref.current.scale.y = ref.current.scale.z =
          ref.current.scale.x * 0.9;
        break;
      }
      case GameStates.Explode: {
        ref.current.rotation.x = ref.current.rotation.y += 0.2;
      }
    }

    return null;
  });

  return (
    <mesh
      ref={ref}
      onClick={onClick}
      onPointerOver={e => console.log("hover")}
      onPointerOut={e => console.log("unhover")}
    >
      <boxBufferGeometry attach="geometry" args={[2, 2, 2]} />
      <meshNormalMaterial attach="material" transparent={true} />
    </mesh>
  );
}

export const Game = ({ sendToApp }) => {
  const [current, send] = useMachine(gameMachine);

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
