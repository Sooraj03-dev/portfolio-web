import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// --- SHARED SHADER ---
const VERTEX = `
  attribute float size;
  attribute float seed;
  attribute vec3 aColor;
  varying vec3 vCol;
  varying float vSeed;

  void main() {
    vSeed = seed;
    vCol = aColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAG_DYNAMIC = `
  uniform float time;
  varying vec3 vCol;
  varying float vSeed;

  void main() {
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    
    // Default opacity oscillation based on seed
    float opacity = 0.3 + 0.7 * abs(sin(time * 1.5 + vSeed));
    gl_FragColor = vec4(vCol, opacity * (1.0 - dist * 2.0));
  }
`;

// --- CYAN DUST ---
function CyanDust({ count = 300, groupRef }) {
  const ref = useRef(null);
  const matRef = useRef(null);

  const { positions, colors, sizes, seeds, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const sd = new Float32Array(count);
    const spd = new Float32Array(count);
    const c = new THREE.Color('#00FFFF');
    
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
      sz[i] = 0.02 + Math.random() * 0.04;
      sd[i] = Math.random() * Math.PI * 2;
      spd[i] = 0.003 + Math.random() * 0.005;
    }
    return { positions: pos, colors: col, sizes: sz, seeds: sd, speeds: spd };
  }, [count]);

  useFrame(({ clock, pointer }) => {
    if (!ref.current || !matRef.current) return;
    const t = clock.getElapsedTime();
    matRef.current.uniforms.time.value = t;
    
    const pos = ref.current.geometry.attributes.position.array;
    
    // Repulsion logic vars
    const mx = (pointer.x * 20); // rough scale to world
    const my = (pointer.y * 15);
    
    for (let i = 0; i < count; i++) {
      let px = pos[i * 3];
      let py = pos[i * 3 + 1];
      
      // Upward drift
      py += speeds[i];
      // Random XZ wander
      px += Math.sin(t * 0.5 + seeds[i]) * 0.003;
      
      // Repulsion
      if (groupRef && groupRef.current) {
        // approximate absolute position including group offset
        const absX = px + groupRef.current.position.x;
        const absY = py + groupRef.current.position.y;
        const distSq = (absX - mx)**2 + (absY - my)**2;
        if (distSq < 9) { // radius 3 units squared
          const force = 0.02 / (distSq + 0.1);
          px += (absX - mx) * force;
          py += (absY - my) * force;
        }
      }

      if (py > 15) py = -15;
      if (px > 20 || px < -20) px = (Math.random() - 0.5) * 40;
      
      pos[i * 3] = px;
      pos[i * 3 + 1] = py;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aColor" count={count} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-seed" count={count} array={seeds} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial ref={matRef} transparent depthWrite={false} blending={THREE.AdditiveBlending}
        uniforms={{ time: { value: 0 } }} vertexShader={VERTEX} fragmentShader={FRAG_DYNAMIC} />
    </points>
  );
}

// --- PINK SPARKS ---
function PinkSparks({ count = 120 }) {
  const ref = useRef(null);
  const matRef = useRef(null);

  const { positions, colors, sizes, seeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const sd = new Float32Array(count);
    const c = new THREE.Color('#FF2D78');
    
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
      sz[i] = 0.03 + Math.random() * 0.05;
      sd[i] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, colors: col, sizes: sz, seeds: sd };
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current || !matRef.current) return;
    const t = clock.getElapsedTime();
    matRef.current.uniforms.time.value = t;
    const pos = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      pos[i * 3]     += 0.005 + Math.sin(t + seeds[i]) * 0.002;
      pos[i * 3 + 1] -= 0.002;
      if (pos[i * 3] > 20) pos[i * 3] = -20;
      if (pos[i * 3 + 1] < -15) pos[i * 3 + 1] = 15;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aColor" count={count} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-seed" count={count} array={seeds} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial ref={matRef} transparent depthWrite={false} blending={THREE.AdditiveBlending}
        uniforms={{ time: { value: 0 } }} vertexShader={VERTEX} fragmentShader={FRAG_DYNAMIC} />
    </points>
  );
}

// --- WHITE DATA POINTS ---
function WhiteData({ count = 80 }) {
  const ref = useRef(null);
  const matRef = useRef(null);

  const { positions, colors, sizes, seeds, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const sd = new Float32Array(count);
    const spd = new Float32Array(count);
    const c = new THREE.Color('#FFFFFF');
    
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
      sz[i] = 0.01 + Math.random() * 0.02;
      sd[i] = Math.random() * Math.PI * 2;
      spd[i] = (Math.random() > 0.5 ? 1 : -1) * (0.05 + Math.random() * 0.05); // Fast horizontal
    }
    return { positions: pos, colors: col, sizes: sz, seeds: sd, speeds: spd };
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current || !matRef.current) return;
    matRef.current.uniforms.time.value = clock.getElapsedTime();
    const pos = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      pos[i * 3] += speeds[i];
      if (Math.abs(pos[i * 3]) > 20) pos[i * 3] = -pos[i * 3];
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aColor" count={count} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-seed" count={count} array={seeds} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial ref={matRef} transparent depthWrite={false} blending={THREE.AdditiveBlending}
        uniforms={{ time: { value: 0 } }} vertexShader={VERTEX} fragmentShader={FRAG_DYNAMIC} />
    </points>
  );
}

// --- LIGHT STREAKS ---
function LightStreaks({ count = 10 }) {
  const groupRef = useRef(null);
  
  const streaks = useMemo(() => {
    const arr = [];
    const colors = ['#00FFFF', '#FF2D78', '#9D00FF'];
    for(let i = 0; i < count; i++) {
      arr.push({
        width: 0.5 + Math.random() * 2.5,
        y: (Math.random() - 0.5) * 30,
        z: (Math.random() - 0.5) * 15,
        x: (Math.random() - 0.5) * 40,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 0.02 + Math.random() * 0.04
      });
    }
    return arr;
  }, [count]);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((mesh, i) => {
      mesh.position.x += streaks[i].speed;
      if (mesh.position.x > 20) mesh.position.x = -20;
    });
  });

  return (
    <group ref={groupRef}>
      {streaks.map((s, i) => (
        <mesh key={i} position={[s.x, s.y, s.z]}>
          <boxGeometry args={[s.width, 0.005, 0.01]} />
          <meshBasicMaterial color={s.color} transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
}

// --- PARALLAX LAYERS ---
function ParallaxLayers() {
  const farRef  = useRef(null);
  const midRef  = useRef(null);
  const nearRef = useRef(null);

  useFrame(({ pointer }) => {
    const targetX = pointer.x; // maps to -1 to 1 inherently
    const targetY = pointer.y;

    if (farRef.current) {
      farRef.current.position.x += (targetX * 0.02 * 10 - farRef.current.position.x) * 0.05;
      farRef.current.position.y += (targetY * 0.02 * 10 - farRef.current.position.y) * 0.05;
    }
    if (midRef.current) {
      midRef.current.position.x += (targetX * 0.06 * 10 - midRef.current.position.x) * 0.05;
      midRef.current.position.y += (targetY * 0.06 * 10 - midRef.current.position.y) * 0.05;
    }
    if (nearRef.current) {
      nearRef.current.position.x += (targetX * 0.14 * 10 - nearRef.current.position.x) * 0.05;
      nearRef.current.position.y += (targetY * 0.14 * 10 - nearRef.current.position.y) * 0.05;
    }
  });

  return (
    <>
      <group ref={farRef} position={[0, 0, -15]}>
        <CyanDust count={100} groupRef={farRef} />
        <PinkSparks count={40} />
        <WhiteData count={20} />
      </group>
      <group ref={midRef} position={[0, 0, -7]}>
        <CyanDust count={100} groupRef={midRef} />
        <PinkSparks count={40} />
        <WhiteData count={30} />
        <LightStreaks count={5} />
      </group>
      <group ref={nearRef} position={[0, 0, 0]}>
        <CyanDust count={100} groupRef={nearRef} />
        <PinkSparks count={40} />
        <WhiteData count={30} />
        <LightStreaks count={5} />
      </group>
    </>
  );
}

// --- MAIN CANVAS ---
export default function ParticleCanvas() {
  return (
    <div className="hero-particle-canvas absolute inset-0 z-[5] pointer-events-none">
      <Canvas
        camera={{ fov: 60, position: [0, 0, 10], near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false }}
      >
        <ParallaxLayers />
      </Canvas>
    </div>
  );
}
