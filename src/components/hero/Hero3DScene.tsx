"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import CameraRig from "./CameraRig";
import OceanPlane from "./OceanPlane";
import CargoShip from "./CargoShip";
import CargoAircraft from "./CargoAircraft";
import HeroOverlay from "./HeroOverlay";

// Fallback component while 3D assets load
function LoadingGlassSkeleton() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#030712]">
      <div className="w-16 h-16 border-4 border-[#00F0FF]/20 border-t-[#00F0FF] rounded-full animate-spin"></div>
    </div>
  );
}

export default function Hero3DScene() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#030712]">
      <Suspense fallback={<LoadingGlassSkeleton />}>
        <div className="canvas-container relative w-full h-full">
          <Canvas
            camera={{ position: [0, 8, 18], fov: 45 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: false }}
            style={{ background: "#030712" }}
          >
            <Suspense fallback={null}>
              <CameraRig />
              <OceanPlane />
              <CargoShip />
              <CargoAircraft />
              <ambientLight intensity={0.15} />
              <directionalLight position={[10, 15, 5]} intensity={0.8} color="#e0f0ff" />
              <pointLight position={[-5, 3, -8]} intensity={0.3} color="#00F0FF" />
              <fog attach="fog" args={["#030712", 15, 55]} />
            </Suspense>
          </Canvas>
        </div>
      </Suspense>
      <HeroOverlay />
    </section>
  );
}
