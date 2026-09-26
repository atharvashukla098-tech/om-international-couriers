"use client";

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { latLongToCartesian, MUMBAI_COORDS } from '@/lib/geo-utils';

export default function MumbaiAnchor() {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  const position = new THREE.Vector3(...latLongToCartesian(MUMBAI_COORDS.lat, MUMBAI_COORDS.lng, 4.5));
  
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    
    if (groupRef.current) {
      // Look away from origin
      groupRef.current.lookAt(position.clone().multiplyScalar(2));
    }

    const animateRing = (ref: React.RefObject<THREE.Mesh | null>, offset: number) => {
      if (ref.current) {
        const material = ref.current.material as THREE.MeshBasicMaterial;
        const phase = (t + offset) % 2;
        const scale = 1 + phase * 2;
        ref.current.scale.set(scale, scale, scale);
        material.opacity = 1 - (phase / 2);
      }
    };

    animateRing(ring1Ref, 0);
    animateRing(ring2Ref, 0.66);
    animateRing(ring3Ref, 1.33);
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={2} />
      </mesh>
      
      <mesh ref={ring1Ref}>
        <ringGeometry args={[0.1, 0.15, 32]} />
        <meshBasicMaterial color="#10B981" transparent opacity={1} side={THREE.DoubleSide} />
      </mesh>
      
      <mesh ref={ring2Ref}>
        <ringGeometry args={[0.1, 0.15, 32]} />
        <meshBasicMaterial color="#10B981" transparent opacity={1} side={THREE.DoubleSide} />
      </mesh>
      
      <mesh ref={ring3Ref}>
        <ringGeometry args={[0.1, 0.15, 32]} />
        <meshBasicMaterial color="#10B981" transparent opacity={1} side={THREE.DoubleSide} />
      </mesh>

      <Html position={[0, 0.2, 0]} center distanceFactor={8} className="pointer-events-none z-40">
        <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 whitespace-nowrap">
          <span className="text-[10px] font-bold text-[#10B981] tracking-wider uppercase">BOM / Mumbai</span>
        </div>
      </Html>
    </group>
  );
}
