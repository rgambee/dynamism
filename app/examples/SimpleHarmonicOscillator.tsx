import { RootState, useFrame } from '@react-three/fiber';
import { RefObject, useRef } from 'react';
import { Mesh } from 'three';


function animate(
  meshRef: RefObject<Mesh>,
  initialVelocity: number,
  springConstant: number,
) {
  let velX = initialVelocity;

  return (_: RootState, timeStep: number) => {
    const mesh = meshRef.current as Mesh | null | undefined;
    if (!mesh) {
      return;
    }
    velX -= mesh.position.x * springConstant * timeStep;
    mesh.position.x += velX * timeStep;
  };
}

interface OscillatingCircleParams {
  circleRadius: number;
  initialVelocity: number;
  springConstant: number;
}

function OscillatingCircle({
  circleRadius = 10.0,
  initialVelocity = 100.0,
  springConstant = 1.0,
} : OscillatingCircleParams) {
  const meshRef = useRef<Mesh>(null);

  useFrame(animate(meshRef, initialVelocity, springConstant));

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <circleGeometry args={[circleRadius]} />
      <meshBasicMaterial color="royalblue" />
    </mesh>
  );
}

export default OscillatingCircle;
