import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { farBuildings, midBuildings, nearBuildings } from '../../data/buildingConfigs';
import { createWindowTexture, flickerWindows } from '../../utils/windowTexture';
import Billboard from './Billboard';

function BuildingMesh({ config, isMid = false }) {
  const meshRef = useRef();
  const windowTex = useMemo(() => {
    if (!config.windows && !isMid) return null;
    const cols = Math.max(4, Math.floor(config.scale[0] * 0.6));
    const rows = Math.max(8, Math.floor(config.scale[1] * 0.4));
    return createWindowTexture(cols, rows);
  }, [config]);

  // Window flicker
  useEffect(() => {
    if (!windowTex) return;
    const interval = setInterval(() => {
      flickerWindows(windowTex, 8);
    }, 2500);
    return () => clearInterval(interval);
  }, [windowTex]);

  const [sx, sy, sz] = config.scale;
  const [px, py, pz] = config.position;

  return (
    <group position={[px, py + sy / 2, pz]}>
      {/* Main building body */}
      <mesh ref={meshRef}>
        <boxGeometry args={[sx, sy, sz]} />
        <meshStandardMaterial
          color={config.color}
          roughness={0.85}
          metalness={0.15}
          map={windowTex}
          emissive={config.color}
          emissiveIntensity={config.windowEmissive || 0.1}
          emissiveMap={windowTex}
        />
      </mesh>

      {/* LED strips */}
      {config.ledStrips?.map((strip, si) =>
        Array.from({ length: strip.count }, (_, i) => {
          const yPos = strip.full
            ? -sy / 2 + (sy / (strip.count + 1)) * (i + 1)
            : sy * 0.3 + i * (sy * 0.12);
          return (
            <mesh key={`led-${si}-${i}`} position={[sx / 2 + 0.05, yPos, 0]}>
              <boxGeometry args={[0.1, 0.15, sz * 0.8]} />
              <meshStandardMaterial
                color="#000000"
                emissive={strip.color}
                emissiveIntensity={2.0}
              />
            </mesh>
          );
        })
      )}

      {/* Sign text */}
      {config.sign && (
        <mesh position={[sx / 2 + 0.1, sy * (config.sign.yRatio - 0.5), 0]}>
          <planeGeometry args={[sx * 0.7, sy * 0.06]} />
          <meshStandardMaterial
            color="#000000"
            emissive={config.sign.color}
            emissiveIntensity={3.0}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Roof light */}
      {config.roofLight && (
        <pointLight
          position={[0, sy / 2 + 1, 0]}
          color={config.roofLight.color}
          intensity={config.roofLight.intensity}
          distance={40}
        />
      )}

      {/* Billboards */}
      {config.billboard === 'purple-figure' && (
        <Billboard
          type="purple-figure"
          position={[sx / 2 + 0.2, sy * 0.15, 0]}
          scale={[sx * 0.6, sy * 0.55, 1]}
        />
      )}
      {config.multiScreens && (
        <Billboard
          type="multi-screen"
          position={[sx / 2 + 0.2, sy * 0.1, 0]}
          scale={[sx * 0.7, sx * 0.7, 1]}
          colors={config.screenColors}
        />
      )}
    </group>
  );
}

// Far buildings with InstancedMesh for performance
function FarBuildingRow() {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!meshRef.current) return;
    farBuildings.forEach((b, i) => {
      dummy.position.set(b.position[0], b.scale[1] / 2, b.position[2]);
      dummy.scale.set(b.scale[0], b.scale[1], b.scale[2]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <instancedMesh ref={meshRef} args={[null, null, farBuildings.length]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#040810"
        roughness={0.9}
        metalness={0.1}
        emissive="#020408"
        emissiveIntensity={0.2}
      />
    </instancedMesh>
  );
}

export default function Buildings() {
  return (
    <group>
      {/* Far background */}
      <FarBuildingRow />

      {/* Mid background - key buildings */}
      {midBuildings.map((config) => (
        <BuildingMesh key={config.id} config={config} isMid />
      ))}

      {/* Near midground silhouettes */}
      {nearBuildings.map((config, i) => (
        <BuildingMesh key={`near-${i}`} config={config} />
      ))}
    </group>
  );
}
