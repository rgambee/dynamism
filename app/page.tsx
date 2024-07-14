'use client';

import { Canvas } from '@react-three/fiber';

import LissajousArray from './systems/LissajousArray';

function MyCanvas() {

  return (
    <Canvas orthographic >
      <ambientLight intensity={0.1} />
      <LissajousArray />
    </Canvas>
  );
}

function App() {
  return <MyCanvas />;
}

export default App;
