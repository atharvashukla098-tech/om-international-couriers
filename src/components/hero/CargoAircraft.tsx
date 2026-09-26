"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Points } from "@react-three/drei";
import * as THREE from "three";

export default function CargoAircraft() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle banking animation
      groupRef.current.position.y = 7 + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      groupRef.current.rotation.z = -0.2 + Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  const [positions] = useState(() => {
    const pos = new Float32Array(180);
    for (let i = 0; i < 60; i++) {
      pos[i * 3] = -i * 0.15 + (Math.random() - 0.5) * 0.1; // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.1; // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.1; // z
    }
    return pos;
  });

  return (
    <group ref={groupRef} position={[-8, 7, -10]} rotation={[0.1, -0.4, -0.2]}>
      {/* Fuselage */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 3, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Wings */}
      <mesh position={[0.2, 0, 0]}>
        <boxGeometry args={[0.6, 0.05, 2.5]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Tail Fin */}
      <mesh position={[-1.3, 0.4, 0]}>
        <boxGeometry args={[0.4, 0.6, 0.05]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Engine Trail */}
      <Points positions={positions} stride={3}>
        <pointsMaterial 
          size={0.03} 
          color="#00F0FF" 
          transparent 
          opacity={0.6} 
          sizeAttenuation 
        />
      </Points>
    </group>
  );
}
