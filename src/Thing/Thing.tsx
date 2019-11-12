import * as React from "react";
import { GameStates, GameEvent, GameContext } from "../Game/GameMachine";
import { useFrame, ReactThreeFiber } from "react-three-fiber";
import { useRef } from "react";
import { Mesh } from "three";
import { useMachine } from "@xstate/react";
import { thingMachine, ThingEventType, ThingStates } from "./ThingMachine";
import { SingleOrArray, OmniEvent, State } from "xstate";

export interface ThingModel {
  id: number;
  type: string;
  position: ReactThreeFiber.Vector3;
}

export interface IThingProps {
  model: ThingModel;
  sendToGame: (
    event: SingleOrArray<OmniEvent<GameEvent>>,
    payload?: Record<string, any> & {
      type?: undefined;
    },
  ) => State<GameContext, GameEvent>;
}

export function Thing({ model, sendToGame }: IThingProps) {
  const [current, send] = useMachine(
    thingMachine(sendToGame, Math.random() * 3000 + 2000),
  );

  const posRef = useRef({
    x: Math.random() * 10 - 5,
    y: Math.random() * 4 - 2,
    z: Math.random() * 3 - 2,
  });
  const ref = useRef<ReactThreeFiber.Object3DNode<Mesh, typeof Mesh>>();

  useFrame(state => {
    ref.current.position.x =
      posRef.current.x + Math.sin(state.clock.elapsedTime) * 2;
    ref.current.position.y =
      posRef.current.y + Math.cos(state.clock.elapsedTime) * 2;
    ref.current.position.z = posRef.current.z;
    ref.current.rotation.x = ref.current.rotation.y += 0.02;

    switch (current.value) {
      case ThingStates.Active: {
        ref.current.material.opacity = Math.sin(state.clock.elapsedTime) / 2;
        ref.current.scale.x = 1;
        ref.current.scale.y = 1;
        ref.current.scale.z = 1;
        break;
      }
      case ThingStates.Idle: {
        ref.current.material.opacity = 1;
        // ref.current.scale.x = 0.5;
        // ref.current.scale.y = 0.5;
        // ref.current.scale.z = 0.5;
        break;
      }
      case ThingStates.Success: {
        ref.current.scale.x = ref.current.scale.y = ref.current.scale.z =
          ref.current.scale.x * 0.9;
        break;
      }
      case ThingStates.Explode: {
        ref.current.rotation.x = ref.current.rotation.y += 0.2;
      }
    }

    return null;
  });

  return (
    <mesh
      ref={ref}
      onClick={() => {
        console.log("clicked");
        send({ type: ThingEventType.Clicked });
      }}
      onPointerOver={() => console.log("hover")}
      onPointerOut={() => console.log("unhover")}
    >
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshNormalMaterial attach="material" transparent={true} />
    </mesh>
  );
}

export default Thing;
