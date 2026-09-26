"use client";

import { Suspense, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import EarthSphere from './EarthSphere';
import MumbaiAnchor from './MumbaiAnchor';
import FlightArc from './FlightArc';
import RouteTooltip from './RouteTooltip';
import { ROUTE_DATA, MUMBAI_COORDS, latLongToCartesian } from '@/lib/geo-utils';

export default function RouteGlobe() {
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);

  // Pre-calculate positions for the interactive spheres
  const destinations = useMemo(() => {
    return ROUTE_DATA.map(route => ({
      ...route,
      position: latLongToCartesian(route.lat, route.lng, 4.5) as [number, number, number]
    }));
  }, []);

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 14], fov: 45 }}>
        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} intensity={0.3} />

        <Suspense fallback={null}>
          <group rotation={[0.2, -0.5, 0]}>
            <EarthSphere />
            <MumbaiAnchor />
            
            {destinations.map((route) => (
              <group key={route.id}>
                <FlightArc
                  startCoords={MUMBAI_COORDS}
                  endCoords={{ lat: route.lat, lng: route.lng }}
                />
                
                {/* Invisible larger sphere for easier hovering */}
                <mesh
                  position={route.position}
                  onPointerOver={(e) => {
                    e.stopPropagation();
                    setHoveredRoute(route.id);
                  }}
                  onPointerOut={(e) => {
                    e.stopPropagation();
                    setHoveredRoute(null);
                  }}
                >
                  <sphereGeometry args={[0.3, 16, 16]} />
                  <meshBasicMaterial visible={false} />
                </mesh>

                <RouteTooltip
                  name={route.name}
                  code={route.code}
                  transitTime={route.transitTime}
                  mode={route.mode}
                  position={route.position}
                  visible={hoveredRoute === route.id}
                />
              </group>
            ))}
          </group>
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI * 2 / 3}
        />
      </Canvas>
    </div>
  );
}
