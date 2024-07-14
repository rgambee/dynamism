import { Trail } from '@react-three/drei';
import { RootState, useFrame } from '@react-three/fiber';
import { RefObject, useRef } from 'react';
import { Color, Mesh } from 'three';

interface LissajousCurveParams {
  center: [number, number, number];
  scale: number;
  xFrequency: number;
  yFrequency: number;
  startingPhase: number;
  pointColor: Color;
  trailColor: Color;
  circleRadius: number;
  lineThickness: number;
}

function animate(
  meshRef: RefObject<Mesh>,
  center: [number, number, number],
  scale: number,
  xFrequency: number,
  yFrequency: number,
  startingPhase: number,
) {
  let time = 0;

  return (_: RootState, timeStep: number) => {
    const mesh = meshRef.current as Mesh | null | undefined;
    if (!mesh) {
      return;
    }
    mesh.position.x = scale * Math.sin(xFrequency * time) + center[0];
    mesh.position.y = scale * Math.sin(yFrequency * time + startingPhase) + center[1];
    time += timeStep;
  };
}

function LissajousCurve({
  center,
  scale,
  xFrequency,
  yFrequency,
  startingPhase,
  pointColor,
  trailColor,
  circleRadius,
  lineThickness,
} : LissajousCurveParams) {
  const meshRef: RefObject<Mesh> = useRef<Mesh>(null);

  useFrame(
    animate(
      meshRef,
      center,
      scale,
      xFrequency,
      yFrequency,
      startingPhase,
    ),
  );

  return (
    <Trail
      width={lineThickness}
      length={0.5 * scale}
      color={trailColor}
    >
      <mesh ref={meshRef} position={center} renderOrder={1}>
        <circleGeometry args={[circleRadius]} />
        <meshBasicMaterial color={pointColor} />
      </mesh>
    </Trail>
  );
}

function LissajousArray() {
  const xFrequencies = [1, 2, 3, 4, 5];
  const yFrequencies = [1, 2, 3, 4, 5];
  const scale = 50;
  const spacing = 2.5 * scale;
  const halfWidth = (spacing * (xFrequencies.length - 1) + scale) / 2;
  const halfHeight = (spacing * (xFrequencies.length - 1) + scale) / 2;

  return xFrequencies.map((xFrequency, xIndex) =>
    yFrequencies.map((yFrequency, yIndex) => (
      <LissajousCurve
        key={xFrequency * xFrequencies.length + yFrequency}
        center={[
          xIndex * spacing - halfWidth,
          halfHeight - yIndex * spacing,
          0,
        ]}
        scale={scale}
        xFrequency={xFrequency}
        yFrequency={yFrequency}
        startingPhase={xFrequency === yFrequency ? Math.PI / 2 : 0}
        pointColor={new Color(0xff0000)}
        trailColor={new Color(0x0000ff)}
        circleRadius={3.0}
        lineThickness={0.1}
      />
    )),
  );
}

export default LissajousArray;
