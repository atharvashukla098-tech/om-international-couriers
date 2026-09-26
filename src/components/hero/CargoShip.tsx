"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function CargoShip() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.03;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.6) * 0.02;
    }
  });

  const containers = useMemo(() => {
    const items = [];
    const colors = ["#e11d48", "#0284c7", "#16a34a", "#eab308"];
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 2; y++) {
        for (let z = 0; z < 2; z++) {
          items.push(
            <mesh
              key={`container-${x}-${y}-${z}`}
              position={[-0.8 + x * 0.55, 0.5 + y * 0.42, -0.25 + z * 0.5]}
            >
              <boxGeometry args={[0.5, 0.4, 0.45]} />
              <meshStandardMaterial
                color={colors[(x + y + z) % colors.length]}
                metalness={0.2}
                roughness={0.8}
              />
            </mesh>
          );
        }
      }
    }
    return items;
  }, []);

  return (
    <group ref={groupRef} position={[6, 0.1, -4]}>
      {/* Hull */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[3.5, 0.6, 1.2]} />
        <meshStandardMaterial color="#334155" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Bridge / Superstructure */}
      <mesh position={[1.3, 0.8, 0]}>
        <boxGeometry args={[0.6, 0.8, 0.8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.3} roughness={0.5} />
      </mesh>

      {/* Cargo Containers */}
      <group position={[-0.2, 0, 0]}>
        {containers}
      </group>
    </group>
  );
}
