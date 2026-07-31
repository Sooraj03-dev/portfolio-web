import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 300;

export default function Particles() {
  const pointsRef = useRef();

  const { positions, colors, seeds } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);
    const sds = new Float32Array(PARTICLE_COUNT);

    const cyanColor = new THREE.Color('#00FFFF');
    const pinkColor = new THREE.Color('#FF44AA');

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 80;
      pos[i3 + 1] = Math.random() * 60;
      pos[i3 + 2] = (Math.random() - 0.5) * 60;

      const c = Math.random() > 0.3 ? cyanColor : pinkColor;
      col[i3] = c.r;
      col[i3 + 1] = c.g;
      col[i3 + 2] = c.b;

      sds[i] = Math.random() * Math.PI * 2;
    }

    return { positions: pos, colors: col, seeds: sds };
  }, []);

  const sizes = useMemo(() => {
    const s = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      s[i] = 0.02 + Math.random() * 0.04;
    }
    return s;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const posArray = pointsRef.current.geometry.attributes.position.array;
    const t = clock.getElapsedTime();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      // Drift upward
      posArray[i3 + 1] += 0.008;
      // Horizontal drift
      posArray[i3] += Math.sin(t + seeds[i]) * 0.002;
      posArray[i3 + 2] += Math.cos(t * 0.7 + seeds[i]) * 0.001;

      // Reset when too high
      if (posArray[i3 + 1] > 60) {
        posArray[i3 + 1] = -5;
        posArray[i3] = (Math.random() - 0.5) * 80;
        posArray[i3 + 2] = (Math.random() - 0.5) * 60;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={PARTICLE_COUNT}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
