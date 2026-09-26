"use client";

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { latLongToCartesian } from '@/lib/geo-utils';

interface FlightArcProps {
  startCoords: { lat: number; lng: number };
  endCoords: { lat: number; lng: number };
  color?: string;
}

export default function FlightArc({ startCoords, endCoords, color = "#00F0FF" }: FlightArcProps) {
  const particleRef = useRef<THREE.Mesh>(null);
  
  const { curve, endPosition } = useMemo(() => {
    const start = new THREE.Vector3(...latLongToCartesian(startCoords.lat, startCoords.lng, 4.5));
    const end = new THREE.Vector3(...latLongToCartesian(endCoords.lat, endCoords.lng, 4.5));
    
    // Calculate midpoint and push it outward
    const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const distance = start.distanceTo(end);
    // Push factor depends on distance to make long routes arc higher
    midPoint.normalize().multiplyScalar(4.5 + distance * 0.3);
    
    const bezierCurve = new THREE.QuadraticBezierCurve3(start, midPoint, end);
    return { curve: bezierCurve, endPosition: end };
  }, [startCoords, endCoords]);

  const linePoints = useMemo(() => curve.getPoints(64), [curve]);

  useFrame(({ clock }) => {
    if (particleRef.current) {
      // Loop the particle animation
      const t = (clock.elapsedTime * 0.15) % 1;
      const point = curve.getPointAt(t);
      particleRef.current.position.copy(point);
    }
  });

  return (
    <group>
      <Line
        points={linePoints}
        color={color}
        lineWidth={1.5}
        transparent
        opacity={0.4}
      />
      
      {/* Traveling Particle */}
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color={color} />
        <pointLight color={color} intensity={0.5} distance={1} />
      </mesh>
      
      {/* Destination Marker */}
      <mesh position={endPosition}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}
