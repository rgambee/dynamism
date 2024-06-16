'use client';

import { Canvas } from '@react-three/fiber';
import { Vector3 } from 'three';

import GravitationalSystem from './systems/GravitationalSystem.tsx';

function MyCanvas() {
  const positions = [
    new Vector3(-50, 0, 0),
    new Vector3(50, 0, 0),
    new Vector3(0, 100, 0),
  ];

  return (
    <Canvas orthographic >
      <ambientLight intensity={0.1} />
      {/*<OscillatingCircle />*/}
      <GravitationalSystem
        initialPositions={positions}
      />
    </Canvas>
  );
}

function App() {
  return <MyCanvas />;
}

export default App;
