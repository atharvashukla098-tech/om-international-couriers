"use client";

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function EarthSphere() {
  const groupRef = useRef<THREE.Group>(null);

  const points = useMemo(() => {
    const numPoints = 4000;
    const pts = new Float32Array(numPoints * 3);
    const radius = 4.5;
    const phi = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;

      pts[i * 3] = Math.cos(theta) * r * radius;
      pts[i * 3 + 1] = y * radius;
      pts[i * 3 + 2] = Math.sin(theta) * r * radius;
    }
    return pts;
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <Points positions={points}>
        <PointMaterial color="#1E293B" size={0.02} transparent opacity={0.6} sizeAttenuation />
      </Points>
      <mesh>
        <sphereGeometry args={[4.48, 36, 36]} />
        <meshBasicMaterial wireframe color="#0f172a" opacity={0.15} transparent />
      </mesh>
      <mesh>
        <sphereGeometry args={[4.7, 36, 36]} />
        <meshBasicMaterial color="#00F0FF" opacity={0.03} transparent side={THREE.BackSide} />
      </mesh>
    </group>
  );
}
