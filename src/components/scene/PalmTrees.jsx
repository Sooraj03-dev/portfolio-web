import { useMemo } from 'react';

const treeConfigs = [
  { position: [-8, 0, 8], tilt: 0.05, height: 3.5 },
  { position: [-10, 0, 9], tilt: -0.08, height: 4.0 },
  { position: [-12, 0, 7], tilt: 0.06, height: 3.2 },
  { position: [-14, 0, 10], tilt: -0.04, height: 3.8 },
];

function PalmTree({ position, tilt, height }) {
  const frondCount = 7;
  const fronds = useMemo(() =>
    Array.from({ length: frondCount }, (_, i) => {
      const angle = (i / frondCount) * Math.PI * 2;
      return {
        rotY: angle,
        rotX: -0.4 - Math.random() * 0.3,
        rotZ: 0.1 * (Math.random() - 0.5),
        length: 1.0 + Math.random() * 0.4,
      };
    }),
  [frondCount]);

  return (
    <group position={position}>
      {/* Trunk */}
      <mesh
        position={[0, height / 2, 0]}
        rotation={[0, 0, tilt]}
      >
        <cylinderGeometry args={[0.1, 0.18, height, 8]} />
        <meshStandardMaterial color="#1A1208" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Crown */}
      <group position={[tilt * height * 2, height, 0]}>
        {fronds.map((f, i) => (
          <mesh
            key={i}
            position={[0, 0.1, 0]}
            rotation={[f.rotX, f.rotY, f.rotZ]}
          >
            <boxGeometry args={[0.08, 0.06, f.length]} />
            <meshStandardMaterial
              color="#0A2010"
              emissive="#0A2A15"
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}
        {/* Crown light */}
        <pointLight color="#00AACC" intensity={0.6} distance={4} position={[0, -0.3, 0]} />
      </group>
    </group>
  );
}

export default function PalmTrees() {
  return (
    <group>
      {treeConfigs.map((config, i) => (
        <PalmTree key={i} {...config} />
      ))}
    </group>
  );
}
