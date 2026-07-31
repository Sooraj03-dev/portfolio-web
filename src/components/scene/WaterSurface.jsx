import { MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function WaterSurface() {
  return (
    <group>
      {/* Asphalt base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[120, 80]} />
        <meshStandardMaterial
          color="#050A0F"
          roughness={0.85}
          metalness={0.15}
        />
      </mesh>

      {/* Wet reflective surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 5]}>
        <planeGeometry args={[60, 25]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={512}
          mixBlur={8}
          mixStrength={1.2}
          roughness={1.0}
          depthScale={1.0}
          color="#030A12"
          metalness={0.9}
          mirror={0.5}
        />
      </mesh>

      {/* Road markings - center dashes */}
      {Array.from({ length: 10 }, (_, i) => (
        <mesh
          key={`line-${i}`}
          position={[-15 + i * 3, 0.02, 3]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[2.0, 0.15]} />
          <meshStandardMaterial
            color="#000000"
            emissive="#332200"
            emissiveIntensity={0.4}
          />
        </mesh>
      ))}

      {/* Sidewalk left */}
      <mesh position={[-5, 0.07, 10]}>
        <boxGeometry args={[30, 0.15, 6]} />
        <meshStandardMaterial color="#080C12" roughness={0.95} metalness={0.05} />
      </mesh>

      {/* Sidewalk right */}
      <mesh position={[20, 0.07, 10]}>
        <boxGeometry args={[30, 0.15, 6]} />
        <meshStandardMaterial color="#080C12" roughness={0.95} metalness={0.05} />
      </mesh>
    </group>
  );
}
