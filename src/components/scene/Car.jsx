import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Car() {
  const groupRef = useRef();
  const exhaustRefs = useRef([]);
  const underglowRef = useRef([]);
  const wheelLightRefs = useRef([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Exhaust shimmer
    exhaustRefs.current.forEach((mat) => {
      if (mat) mat.emissiveIntensity = 0.4 + Math.sin(t * 3.0) * 0.3;
    });
    // Underglow pulse
    underglowRef.current.forEach((mat) => {
      if (mat) mat.emissiveIntensity = 2.5 + Math.sin(t * 1.2) * 0.8;
    });
  });

  const wheelPositions = [
    [-1.6, 0.55, 0.9],
    [-1.6, 0.55, -0.9],
    [1.6, 0.55, 0.9],
    [1.6, 0.55, -0.9],
  ];

  const exhaustPositions = [
    [-2.2, 0.55, 0.25],
    [-2.2, 0.55, -0.25],
    [-2.2, 0.72, 0.25],
    [-2.2, 0.72, -0.25],
  ];

  return (
    <group ref={groupRef} position={[0, 0, 6]}>
      {/* Main body */}
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[4.2, 0.7, 2.0]} />
        <meshStandardMaterial color="#0A1218" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Lower skirt */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[4.0, 0.25, 2.1]} />
        <meshStandardMaterial color="#080E14" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Roof/cabin */}
      <mesh position={[0.2, 1.35, 0]}>
        <boxGeometry args={[1.8, 0.55, 1.6]} />
        <meshStandardMaterial color="#060C12" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Front hood */}
      <mesh position={[1.4, 1.05, 0]} rotation={[-0.06, 0, 0]}>
        <boxGeometry args={[1.4, 0.15, 1.8]} />
        <meshStandardMaterial color="#0A1218" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Rear spoiler */}
      <mesh position={[-1.8, 1.55, 0]}>
        <boxGeometry args={[2.2, 0.08, 0.12]} />
        <meshStandardMaterial color="#080E14" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Spoiler supports */}
      <mesh position={[-1.2, 1.4, 0.5]}>
        <boxGeometry args={[0.08, 0.25, 0.08]} />
        <meshStandardMaterial color="#080E14" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-1.2, 1.4, -0.5]}>
        <boxGeometry args={[0.08, 0.25, 0.08]} />
        <meshStandardMaterial color="#080E14" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Windshield */}
      <mesh position={[0.9, 1.35, 0]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.05, 0.5, 1.5]} />
        <meshStandardMaterial
          color="#0A2030"
          metalness={0.9}
          roughness={0}
          opacity={0.6}
          transparent
        />
      </mesh>

      {/* HUD strip */}
      <mesh position={[0.5, 1.15, 0]}>
        <boxGeometry args={[0.6, 0.03, 1.0]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#00FFFF"
          emissiveIntensity={2.0}
        />
      </mesh>

      {/* Wheels */}
      {wheelPositions.map((pos, i) => (
        <group key={`wheel-${i}`} position={pos}>
          {/* Tire */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.55, 0.55, 0.45, 16]} />
            <meshStandardMaterial color="#080C10" metalness={0.3} roughness={0.8} />
          </mesh>
          {/* Wheel cap */}
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, pos[2] > 0 ? 0.01 : -0.01]}>
            <cylinderGeometry args={[0.3, 0.3, 0.46, 6]} />
            <meshStandardMaterial
              color="#00E5CC"
              emissive="#00E5CC"
              emissiveIntensity={1.5}
            />
          </mesh>
          <pointLight
            color="#00DDCC"
            intensity={0.4}
            distance={2}
            position={[0, -0.3, 0]}
          />
        </group>
      ))}

      {/* Exhaust pipes */}
      {exhaustPositions.map((pos, i) => (
        <mesh
          key={`exhaust-${i}`}
          position={pos}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.12, 0.12, 0.6, 12]} />
          <meshStandardMaterial
            color="#1A2830"
            metalness={1}
            roughness={0.2}
            emissive="#FF4400"
            emissiveIntensity={0.6}
            ref={(el) => { exhaustRefs.current[i] = el; }}
          />
        </mesh>
      ))}
      <pointLight position={[-2.4, 0.6, 0]} color="#FF4400" intensity={1.2} distance={6} />

      {/* Underglow strips */}
      {[0.95, -0.95].map((z, i) => (
        <mesh key={`ug-${i}`} position={[0, 0.42, z]}>
          <boxGeometry args={[3.5, 0.02, 0.05]} />
          <meshStandardMaterial
            color="#000000"
            emissive="#00FFFF"
            emissiveIntensity={3.0}
            ref={(el) => { underglowRef.current[i] = el; }}
          />
        </mesh>
      ))}
      <pointLight position={[0, 0.3, 0]} color="#00CCFF" intensity={1.2} distance={5} />

      {/* Headlights */}
      {[0.7, -0.7].map((z, i) => (
        <group key={`hl-${i}`}>
          <mesh position={[2.1, 0.9, z]}>
            <planeGeometry args={[0.3, 0.1]} />
            <meshStandardMaterial
              color="#000000"
              emissive="#AAEEFF"
              emissiveIntensity={5.0}
              side={THREE.DoubleSide}
            />
          </mesh>
          <spotLight
            position={[2.3, 0.9, z]}
            target-position={[10, 0, z]}
            color="#BBFFFF"
            intensity={3}
            angle={0.3}
            penumbra={0.5}
            distance={25}
          />
        </group>
      ))}

      {/* Tail lights */}
      {[0.7, -0.7].map((z, i) => (
        <mesh key={`tl-${i}`} position={[-2.1, 0.9, z]}>
          <planeGeometry args={[0.05, 0.15]} />
          <meshStandardMaterial
            color="#000000"
            emissive="#FF2244"
            emissiveIntensity={4.0}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
