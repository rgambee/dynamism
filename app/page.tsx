'use client';

import { Canvas } from '@react-three/fiber';

import OscillatingCircle from './systems/SimpleHarmonicOscillator.tsx';

function MyCanvas() {
  return (
    <Canvas orthographic >
      <ambientLight intensity={0.1} />
      <OscillatingCircle />
    </Canvas>
  );
}

function App() {
  return <MyCanvas />;
}

export default App;
