import { useMemo } from 'react';
import * as THREE from 'three';
import {
  createPurpleFigureBillboard,
  createMultiScreenBillboard,
  createCorporateBillboard,
} from '../../utils/billboardTexture';

export default function Billboard({
  type = 'purple-figure',
  position = [0, 0, 0],
  scale = [10, 15, 1],
  colors,
}) {
  const texture = useMemo(() => {
    switch (type) {
      case 'purple-figure':
        return createPurpleFigureBillboard();
      case 'multi-screen':
        return createMultiScreenBillboard(512, 512, colors);
      case 'corporate':
        return createCorporateBillboard();
      default:
        return createPurpleFigureBillboard();
    }
  }, [type, colors]);

  return (
    <mesh position={position}>
      <planeGeometry args={[scale[0], scale[1]]} />
      <meshStandardMaterial
        map={texture}
        emissiveMap={texture}
        emissive="#FFFFFF"
        emissiveIntensity={2.5}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}
