import * as React from "react";
import { GameStates } from "../Game/GameMachine";
import { useFrame, ReactThreeFiber } from "react-three-fiber";
import { useRef } from "react";
import { Mesh } from "three";

interface ThingModel {
  id: number;
  type: string;
  position: ReactThreeFiber.Vector3;
}

export interface IThingProps {
  gameState: GameStates;
  onClick: () => void;
  model: ThingModel;
}

export function Thing({ gameState, onClick, model }: IThingProps) {
  const ref = useRef<ReactThreeFiber.Object3DNode<Mesh, typeof Mesh>>();
  useFrame(state => {
    ref.current.position.x =
      model.position.x + Math.sin(state.clock.elapsedTime) * 2;
    ref.current.position.y =
      model.position.x + Math.cos(state.clock.elapsedTime) * 2;
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
      onPointerOver={() => console.log("hover")}
      onPointerOut={() => console.log("unhover")}
    >
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshNormalMaterial attach="material" transparent={true} />
    </mesh>
  );
}

export default Thing;
