import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Small neon sign configs
const neonSigns = [
  { text: 'NET CAFE', pos: [-6, 3.5, -4], color: '#00FFFF', size: [2, 0.5] },
  { text: 'RAMEN', pos: [-3, 2.8, -3], color: '#FF6600', size: [1.5, 0.4] },
  { text: 'CLINIC', pos: [5, 3.2, -5], color: '#FF2D78', size: [1.5, 0.4] },
  { text: 'DATA SHARK', pos: [8, 4, -6], color: '#00FFFF', size: [2.2, 0.5] },
  { text: 'CYBER MOD', pos: [12, 3, -4], color: '#9D00FF', size: [2, 0.5] },
];

function NeonSign({ text, pos, color, size }) {
  return (
    <group position={pos}>
      <mesh>
        <planeGeometry args={size} />
        <meshStandardMaterial
          color="#000000"
          emissive={color}
          emissiveIntensity={3.0}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
      <pointLight color={color} intensity={0.8} distance={5} />
    </group>
  );
}

function HologramPillar({ position }) {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.008;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <cylinderGeometry args={[0.4, 0.4, 2.5, 16]} />
        <meshStandardMaterial
          color="#00FFCC"
          emissive="#00FFCC"
          emissiveIntensity={2.0}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
      <pointLight color="#00FFCC" intensity={1.5} distance={4} />
      {/* Base */}
      <mesh position={[0, -1.35, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.15, 16]} />
        <meshStandardMaterial color="#0A1218" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

function BarrierRails() {
  const posts = 5;
  const spacing = 1.2;

  return (
    <group position={[-7, 0, 6]}>
      {Array.from({ length: posts }, (_, i) => (
        <mesh key={i} position={[i * spacing, 0.3, 0]}>
          <boxGeometry args={[0.08, 0.6, 0.08]} />
          <meshStandardMaterial
            color="#1A2A30"
            metalness={0.8}
            roughness={0.3}
            emissive="#003344"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
      {/* Horizontal bar */}
      <mesh position={[(posts - 1) * spacing / 2, 0.55, 0]}>
        <boxGeometry args={[(posts - 1) * spacing + 0.1, 0.05, 0.05]} />
        <meshStandardMaterial
          color="#1A2A30"
          metalness={0.8}
          roughness={0.3}
          emissive="#003344"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

function Debris() {
  const pieces = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      position: [
        -8 + Math.random() * 20,
        Math.random() * 0.15,
        4 + Math.random() * 6,
      ],
      scale: [
        0.1 + Math.random() * 0.3,
        0.05 + Math.random() * 0.15,
        0.1 + Math.random() * 0.25,
      ],
      rotation: [0, Math.random() * Math.PI, 0],
    })),
  []);

  return (
    <group>
      {pieces.map((p, i) => (
        <mesh key={i} position={p.position} rotation={p.rotation}>
          <boxGeometry args={p.scale} />
          <meshStandardMaterial color="#080C10" roughness={0.95} metalness={0.05} />
        </mesh>
      ))}
    </group>
  );
}

export default function StreetProps() {
  return (
    <group>
      {/* Neon signs */}
      {neonSigns.map((sign, i) => (
        <NeonSign key={i} {...sign} />
      ))}

      {/* Hologram pillars */}
      <HologramPillar position={[-4, 1.25, 8]} />
      <HologramPillar position={[6, 1.25, 9]} />
      <HologramPillar position={[15, 1.25, 7]} />

      {/* Barrier rails */}
      <BarrierRails />

      {/* Street debris */}
      <Debris />
    </group>
  );
}
