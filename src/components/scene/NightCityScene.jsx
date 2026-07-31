import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import * as THREE from 'three';

import Car from './Car';
import Character from './Character';
import Buildings from './Buildings';
import PalmTrees from './PalmTrees';
import StreetProps from './StreetProps';
import WaterSurface from './WaterSurface';
import Particles from './Particles';
import CameraController from './CameraController';
import PostProcessing from './PostProcessing';

export default function NightCityScene({ scrollProgress = 0 }) {
  return (
    <Canvas
      camera={{ fov: 60, position: [0, 3, 18], near: 0.1, far: 500 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.85,
      }}
      shadows={false}
      style={{ width: '100vw', height: '100vh', background: '#010308' }}
      dpr={[1, 1.5]}
    >
      <Suspense fallback={null}>
        {/* Minimal ambient — city is DARK */}
        <ambientLight intensity={0.04} color="#050818" />

        {/* Atmospheric blue from sky */}
        <hemisphereLight skyColor="#050A1A" groundColor="#000000" intensity={0.15} />

        {/* Cyan atmosphere from center towers */}
        <pointLight position={[2, 35, -30]} color="#00CCFF" intensity={4} distance={80} />

        {/* Purple/pink from billboard area */}
        <pointLight position={[-18, 25, -22]} color="#9900FF" intensity={3} distance={60} />

        {/* Pink from left cluster */}
        <pointLight position={[-40, 18, -20]} color="#FF2288" intensity={2.5} distance={50} />

        {/* Car exhaust heat glow */}
        <pointLight position={[0, 0.5, 8.5]} color="#FF4400" intensity={1.2} distance={6} />

        {/* Car underglow fill */}
        <pointLight position={[0, -0.2, 6]} color="#00FFFF" intensity={1.5} distance={8} />

        {/* Street level warm spots */}
        <pointLight position={[-6, 2, 8]} color="#FF6600" intensity={0.8} distance={12} />

        {/* Headlight fill forward */}
        <spotLight
          position={[-1, 1.2, 5]}
          target-position={[0, 0, -5]}
          color="#AAFFFF"
          intensity={3}
          angle={0.25}
          penumbra={0.6}
          distance={30}
        />

        {/* Water/puddle teal reflection fill */}
        <pointLight position={[5, 0.2, 5]} color="#00AACC" intensity={1} distance={15} />

        {/* Scene objects */}
        <WaterSurface />
        <Car />
        <Character />
        <Buildings />
        <PalmTrees />
        <StreetProps />
        <Particles />

        {/* Camera controls */}
        <CameraController scrollProgress={scrollProgress} />

        {/* Post processing */}
        <PostProcessing />

        <Preload all />
      </Suspense>
    </Canvas>
  );
}
