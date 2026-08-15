import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ── Single wireframe shape ── */
function WireShape({ geometry, position, scale = 1, color = 0x3a3a3a, opacity = 0.25, scrollProgress }) {
  const meshRef = useRef();

  // Stable random per-instance values
  const rand = useMemo(() => ({
    rotSpeedX: (Math.random() - 0.5) * 0.004,
    rotSpeedY: (Math.random() - 0.5) * 0.004,
    rotSpeedZ: (Math.random() - 0.5) * 0.002,
    floatSpeed: 0.3 + Math.random() * 0.4,
    floatAmp: 0.4 + Math.random() * 0.6,
    phase: Math.random() * Math.PI * 2,
    baseZ: position[2],
  }), [position]);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.getElapsedTime();

    // Auto-rotation
    mesh.rotation.x += rand.rotSpeedX;
    mesh.rotation.y += rand.rotSpeedY;
    mesh.rotation.z += rand.rotSpeedZ;

    // Floating bob
    mesh.position.y = position[1] + Math.sin(t * rand.floatSpeed + rand.phase) * rand.floatAmp;

    // 3D scroll parallax — shapes rush toward the camera
    const scrollVal = scrollProgress.current;
    mesh.position.z = rand.baseZ + scrollVal * 18; // shapes fly forward as user scrolls
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <primitive object={geometry} attach="geometry" />
      <meshBasicMaterial color={color} wireframe transparent opacity={opacity} />
    </mesh>
  );
}

/* ── Mouse-parallax camera controller ── */
function CameraRig({ mouse }) {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.x += (mouse.current.x * 2 - camera.position.x) * 0.02;
    camera.position.y += (-mouse.current.y * 2 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ── Main exported component ── */
export default function FloatingShapes() {
  const mouse = useRef({ x: 0, y: 0 });
  const scrollProgress = useRef(0);

  // Mouse tracking
  useEffect(() => {
    const handleMouse = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  // Scroll tracking (normalized 0–1)
  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.current = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pre-build geometries once
  const geometries = useMemo(() => ({
    sphere1: new THREE.SphereGeometry(3, 16, 16),
    sphere2: new THREE.SphereGeometry(2, 12, 12),
    torus1: new THREE.TorusGeometry(3, 1, 12, 40),
    torus2: new THREE.TorusGeometry(2, 0.7, 10, 30),
    ico1: new THREE.IcosahedronGeometry(3, 0),
    ico2: new THREE.IcosahedronGeometry(2.5, 0),
    oct1: new THREE.OctahedronGeometry(2.5, 0),
    oct2: new THREE.OctahedronGeometry(2, 0),
    dodec: new THREE.DodecahedronGeometry(2, 0),
  }), []);

  const shapes = useMemo(() => [
    { geo: 'sphere1', pos: [-14, 6, -5], color: 0x3a3a3a, opacity: 0.25 },
    { geo: 'sphere2', pos: [16, -4, -8], color: 0x505050, opacity: 0.18 },
    { geo: 'torus1', pos: [12, 8, -10], color: 0x3a3a3a, opacity: 0.25 },
    { geo: 'torus2', pos: [-10, -8, -6], color: 0x505050, opacity: 0.18 },
    { geo: 'ico1', pos: [0, -10, -12], color: 0x3a3a3a, opacity: 0.25 },
    { geo: 'ico2', pos: [-18, 0, -14], color: 0x505050, opacity: 0.18 },
    { geo: 'oct1', pos: [18, -8, -10], color: 0x3a3a3a, opacity: 0.25 },
    { geo: 'oct2', pos: [-6, 12, -8], color: 0x505050, opacity: 0.18 },
    { geo: 'dodec', pos: [8, -14, -6], color: 0x3a3a3a, opacity: 0.25 },
  ], []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 30], fov: 55, near: 0.1, far: 1000 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <CameraRig mouse={mouse} />
        {shapes.map((s, i) => (
          <WireShape
            key={i}
            geometry={geometries[s.geo]}
            position={s.pos}
            color={s.color}
            opacity={s.opacity}
            scrollProgress={scrollProgress}
          />
        ))}
      </Canvas>
    </div>
  );
}
