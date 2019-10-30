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

function Thing({ active, onClick }: { active: Boolean; onClick: () => void }) {
  const ref = useRef<ReactThreeFiber.Object3DNode<Mesh, typeof Mesh>>();
  useFrame(() => {
    if (active) {
      return (ref.current.rotation.x = ref.current.rotation.y += 0.02);
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
      <meshNormalMaterial attach="material" />
    </mesh>
  );
}

export const Game = ({ sendToApp }) => {
  const [current, send] = useMachine(gameMachine);

  return (
    <div>
      <GameStateIndicator gameState={current.value as GameStates} />
      <p>Points: {current.context.points}</p>
      <Canvas style={{ height: 400 }}>
        <Thing
          active={current.value === GameStates.Active}
          onClick={() => {
            console.log("clicked");
            send({ type: GameEventType.AwardPoints, total: 10 });
          }}
        />
      </Canvas>
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
