import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function CameraController({ scrollProgress = 0 }) {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ rotX: 0, rotY: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Mouse parallax targets (max ±6° yaw, ±3° pitch)
    const maxYaw = THREE.MathUtils.degToRad(6);
    const maxPitch = THREE.MathUtils.degToRad(3);

    target.current.rotY = mouse.current.x * -maxYaw;
    target.current.rotX = mouse.current.y * maxPitch;

    // Smooth lerp
    camera.rotation.y = THREE.MathUtils.lerp(
      camera.rotation.y,
      target.current.rotY,
      0.03
    );
    camera.rotation.x = THREE.MathUtils.lerp(
      camera.rotation.x,
      target.current.rotX,
      0.03
    );

    // Camera breathe
    camera.position.y = THREE.MathUtils.lerp(3, 1.8, scrollProgress) +
      Math.sin(t * 0.6) * 0.15;

    // Scroll dolly: z from 18 → 8
    camera.position.z = THREE.MathUtils.lerp(18, 8, scrollProgress);
  });

  return null;
}
