import * as THREE from 'three';

export default function Character() {
  const mat = (color) => (
    <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
  );

  // Position: leaning on driver-side rear quarter of car
  // Car is at [0, 0, 6], character leans on left-rear
  return (
    <group position={[-0.8, 0, 7.2]} rotation={[0, 0.3, 0]}>
      {/* Head */}
      <mesh position={[0, 1.85, 0]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        {mat('#1A1210')}
      </mesh>

      {/* Hair */}
      <mesh position={[0, 1.95, -0.02]}>
        <boxGeometry args={[0.22, 0.12, 0.25]} />
        {mat('#0A0808')}
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.7, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.15, 8]} />
        {mat('#1A1210')}
      </mesh>

      {/* Torso */}
      <mesh position={[0, 1.35, 0]}>
        <boxGeometry args={[0.45, 0.65, 0.28]} />
        {mat('#0D1218')}
      </mesh>

      {/* Jacket cyan trim */}
      <mesh position={[0.23, 1.35, 0]}>
        <boxGeometry args={[0.01, 0.6, 0.26]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#00FFFF"
          emissiveIntensity={1.0}
        />
      </mesh>

      {/* Left arm - hanging down */}
      <group position={[-0.3, 1.45, 0]}>
        <mesh rotation={[0.1, 0, 0.15]}>
          <cylinderGeometry args={[0.1, 0.09, 0.38, 8]} />
          {mat('#0D1218')}
        </mesh>
        <mesh position={[0.05, -0.35, 0]} rotation={[0.3, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.08, 0.35, 8]} />
          {mat('#1A1210')}
        </mesh>
      </group>

      {/* Right arm - resting on car roof */}
      <group position={[0.3, 1.5, 0]}>
        <mesh rotation={[0, 0, -0.8]}>
          <cylinderGeometry args={[0.1, 0.09, 0.38, 8]} />
          {mat('#0D1218')}
        </mesh>
        <mesh position={[0.3, 0.1, 0]} rotation={[0, 0, -1.2]}>
          <cylinderGeometry args={[0.09, 0.08, 0.35, 8]} />
          {mat('#1A1210')}
        </mesh>
      </group>

      {/* Left leg */}
      <group position={[-0.12, 0.75, 0]}>
        <mesh>
          <cylinderGeometry args={[0.12, 0.11, 0.42, 8]} />
          {mat('#0A0E14')}
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.1, 0.09, 0.4, 8]} />
          {mat('#0A0E14')}
        </mesh>
      </group>

      {/* Right leg - crossed/leaning */}
      <group position={[0.12, 0.75, 0.05]} rotation={[0, 0, 0.08]}>
        <mesh>
          <cylinderGeometry args={[0.12, 0.11, 0.42, 8]} />
          {mat('#0A0E14')}
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.1, 0.09, 0.4, 8]} />
          {mat('#0A0E14')}
        </mesh>
      </group>

      {/* Boots */}
      <mesh position={[-0.12, 0.12, 0.05]}>
        <boxGeometry args={[0.18, 0.12, 0.3]} />
        {mat('#0A0808')}
      </mesh>
      <mesh position={[0.14, 0.12, 0.05]}>
        <boxGeometry args={[0.18, 0.12, 0.3]} />
        {mat('#0A0808')}
      </mesh>
    </group>
  );
}
