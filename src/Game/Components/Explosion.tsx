import * as THREE from "three";
import * as React from "react";
import { useRef, useMemo } from "react";
import { useFrame, ReactThreeFiber } from "react-three-fiber";

function make(color, speed) {
  return {
    ref: React.createRef(),
    color,
    data: new Array(20)
      .fill(1)
      .map(() => [
        new THREE.Vector3(),
        new THREE.Vector3(
          -1 + Math.random() * 2,
          -1 + Math.random() * 2,
          -1 + Math.random() * 2,
        )
          .normalize()
          .multiplyScalar(speed * 0.75),
      ]),
  };
}

export const Explosion = ({ position, scale }) => {
  const group = useRef<
    ReactThreeFiber.Object3DNode<THREE.Group, typeof THREE.Group>
  >();

  const particles = useMemo(
    () => [make("white", 0.8), make("orange", 0.6)],
    [],
  );

  // useEffect(() => void playAudio(new Audio(audio.mp3.explosion), 0.5), []);

  useFrame(() => {
    particles.forEach(({ data }, type) => {
      const mesh = group.current.children[type];
      data.forEach(([vec, normal], i) => {
        vec.add(normal);
        // dummy.position.copy(vec);
        // dummy.updateMatrix();
        // mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.material.opacity -= 0.025;
      mesh.instanceMatrix.needsUpdate = true;
    });
  });

  return (
    <group ref={group} position={position} scale={[scale, scale, scale]}>
      {particles.map(({ color, data }, index) => (
        <instancedMesh
          key={index}
          args={[null, null, data.length]}
          frustumCulled={false}
        >
          <dodecahedronBufferGeometry attach="geometry" args={[1, 0]} />
          <meshBasicMaterial
            attach="material"
            color={color}
            // transparent
            // opacity={1}
            fog={false}
          />
        </instancedMesh>
      ))}
    </group>
  );
};

export default Explosion;
