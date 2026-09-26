"use client";

import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { WORLD_PLACES, type WorldPlace } from '@/lib/world-places';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false }) as any;

export interface GlobeEngineRef {
  flyTo: (lng: number, lat: number, zoom?: number, pitch?: number, bearing?: number) => void;
  addDestinationPin: (lng: number, lat: number) => void;
  drawFlightArc: (destLng: number, destLat: number) => void;
  removeDestination: () => void;
  setScrollStage: (progress: number) => void;
  enablePinMode: (enabled: boolean) => void;
  enableTouchRotate: (enabled: boolean) => void;
  pauseAnimation: () => void;
  resumeAnimation: () => void;
}

export interface GlobeEngineProps {
  onPinDrop?: (lng: number, lat: number) => void;
  active?: boolean;
}

const MUMBAI_LNG = 72.8353;
const MUMBAI_LAT = 18.9438;

// Top 6 primary intercontinental freight gateways for butter-smooth 60fps performance
const KEY_CODES = new Set(['BOM', 'DEL', 'LHR', 'JFK', 'DXB', 'SIN']);

export const GlobeEngine = forwardRef<GlobeEngineRef, GlobeEngineProps>(({ onPinDrop, active = true }, ref) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null);
  const lastScrollPRef = useRef<number>(-1);
  
  const [pins, setPins] = useState<{lat: number, lng: number, label: string, color: string, size: number}[]>([
    { lat: MUMBAI_LAT, lng: MUMBAI_LNG, label: 'Mumbai HQ', color: '#10B981', size: 0.1 }
  ]);
  const [arcs, setArcs] = useState<{startLat: number, startLng: number, endLat: number, endLng: number, color: string}[]>([]);
  const [isPinMode, setIsPinMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTouchRotateEnabled, setIsTouchRotateEnabled] = useState(false);
  const isTouchRotateEnabledRef = useRef(false);

  // Curated 6 gateways: featherweight, zero raycast overhead, crystal clear
  const displayPlaces = React.useMemo(() => {
    return WORLD_PLACES.filter(p => p.type === 'HQ Gateway' || (p.code ? KEY_CODES.has(p.code) : false));
  }, []);

  // Responsive device check & DPR tuning
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (globeRef.current?.renderer) {
        const renderer = globeRef.current.renderer();
        const maxDpr = mobile ? 1.0 : 1.25;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Pause Three.js render loop when off-screen to save 100% GPU
  useEffect(() => {
    if (!globeRef.current) return;
    if (active === false) {
      globeRef.current.pauseAnimation?.();
    } else {
      globeRef.current.resumeAnimation?.();
    }
  }, [active]);

  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGlobeReady = React.useCallback(() => {
    if (!globeRef.current) return;
    
    const mobile = typeof window !== 'undefined' && window.innerWidth < 768;
    setIsMobile(mobile);

    // Initial camera focus on Mumbai/South Asia (higher altitude on mobile to fit vertical viewport)
    const initialAlt = mobile ? 3.3 : 2.5;
    globeRef.current.pointOfView({ lat: 20, lng: 72.8, altitude: initialAlt }, 600);

    if (globeRef.current.renderer) {
      const renderer = globeRef.current.renderer();
      renderer.powerPreference = "high-performance";
      const maxDpr = mobile ? 1.0 : 1.25;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    }

    if (globeRef.current.controls) {
      const controls = globeRef.current.controls();
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.enablePan = false; // Prevents panning the globe off-screen
      controls.enableZoom = false; // Prevents mousewheel hijacking so page scrollytelling works seamlessly
      controls.minDistance = 140; // Prevents clipping inside the earth
      controls.maxDistance = 420; // Prevents extreme zoom-out
      controls.rotateSpeed = 0.75;
      // On mobile, disable OrbitControls touch rotation by default so vertical swiping scrolls the page!
      const canRotate = !mobile || isTouchRotateEnabledRef.current;
      controls.enableRotate = canRotate;
      controls.enabled = canRotate;
    }

    if (!activeRef.current) {
      globeRef.current.pauseAnimation?.();
    }
  }, []);

  const triggerDestination = (lng: number, lat: number) => {
    setPins([
      { lat: MUMBAI_LAT, lng: MUMBAI_LNG, label: 'Mumbai HQ', color: '#10B981', size: 0.1 },
      { lat, lng, label: 'Destination', color: '#00F0FF', size: 0.1 }
    ]);
    setArcs([{
      startLat: MUMBAI_LAT,
      startLng: MUMBAI_LNG,
      endLat: lat,
      endLng: lng,
      color: '#00F0FF'
    }]);
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat, lng, altitude: 1.1 }, 1800);
    }
    if (onPinDrop) {
      onPinDrop(lng, lat);
    }
  };

  useImperativeHandle(ref, () => ({
    flyTo: (lng, lat, zoom = 16) => {
      if (!globeRef.current) return;
      const altitude = Math.max(0.2, 5 / zoom);
      globeRef.current.pointOfView({ lat, lng, altitude }, 2000);
    },
    addDestinationPin: (lng, lat) => {
      setPins([
        { lat: MUMBAI_LAT, lng: MUMBAI_LNG, label: 'Mumbai HQ', color: '#10B981', size: 0.1 },
        { lat, lng, label: 'Destination', color: '#00F0FF', size: 0.1 }
      ]);
      if (globeRef.current) {
        globeRef.current.pointOfView({ lat, lng, altitude: 0.9 }, 2000);
      }
    },
    drawFlightArc: (destLng, destLat) => {
      setArcs([{
        startLat: MUMBAI_LAT,
        startLng: MUMBAI_LNG,
        endLat: destLat,
        endLng: destLng,
        color: '#00F0FF'
      }]);
    },
    removeDestination: () => {
      setPins([{ lat: MUMBAI_LAT, lng: MUMBAI_LNG, label: 'Mumbai HQ', color: '#10B981', size: 0.1 }]);
      setArcs([]);
    },
    setScrollStage: (localP: number) => {
      if (!globeRef.current) return;
      // Throttle camera updates during fast scroll to prevent projection stalls
      if (Math.abs(localP - lastScrollPRef.current) < 0.04) return;
      lastScrollPRef.current = localP;
      
      const mobile = isMobile || (typeof window !== 'undefined' && window.innerWidth < 768);
      const baseAlt = mobile ? 3.3 : 2.4;
      const altitude = baseAlt - (localP * 1.0); 
      globeRef.current.pointOfView({ lat: 18.9, lng: 72.8 + (localP * 20), altitude }, 0);
    },
    enablePinMode: (enabled: boolean) => {
      setIsPinMode(enabled);
      if (enabled && globeRef.current?.controls) {
        const controls = globeRef.current.controls();
        controls.enableRotate = true;
        controls.enabled = true;
      }
    },
    enableTouchRotate: (enabled: boolean) => {
      setIsTouchRotateEnabled(enabled);
      isTouchRotateEnabledRef.current = enabled;
      if (globeRef.current?.controls) {
        const controls = globeRef.current.controls();
        controls.enableRotate = enabled;
        controls.enabled = enabled;
      }
    },
    pauseAnimation: () => {
      globeRef.current?.pauseAnimation?.();
    },
    resumeAnimation: () => {
      globeRef.current?.resumeAnimation?.();
    }
  }));

  if (!mounted) return <div className="absolute inset-0 bg-[#030712]" />;

  return (
    <div 
      className="relative w-full h-full"
      style={{ cursor: isPinMode ? 'crosshair' : 'grab', touchAction: isTouchRotateEnabled ? 'none' : 'pan-y' }}
    >
      <Globe
        ref={globeRef}
        onGlobeReady={handleGlobeReady}
        globeImageUrl={isMobile ? "/textures/earth-blue-marble-mobile.jpg" : "/textures/earth-blue-marble.jpg"}
        backgroundColor="#030712"
        showAtmosphere={true}
        atmosphereColor="#3a88fe"
        atmosphereAltitude={0.15}
        enablePointerInteraction={active}
        rendererConfig={{
          antialias: false,
          powerPreference: "high-performance",
          precision: "mediump",
        }}

        // ─── Streamlined Gateways (6 top nodes, zero raycast overhead) ───
        labelsData={displayPlaces}
        labelLat="lat"
        labelLng="lng"
        labelText={(d: WorldPlace) => d.name}
        labelSize={(d: WorldPlace) => (d.type === 'HQ Gateway' ? 1.1 : 0.75)}
        labelColor={(d: WorldPlace) => d.color}
        labelDotRadius={(d: WorldPlace) => (d.type === 'HQ Gateway' ? 0.5 : 0.3)}
        labelAltitude={0.015}
        labelResolution={1.2}
        onLabelClick={(place: WorldPlace) => {
          triggerDestination(place.lng, place.lat);
        }}

        // ─── Destination Pins & HQ Beacon ───
        pointsData={pins}
        pointLat="lat"
        pointLng="lng"
        pointColor="color"
        pointAltitude="size"
        pointRadius={0.5}
        pointsMerge={false}

        // ─── Flight Arcs from Mumbai BOM HQ ───
        arcsData={arcs}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor="color"
        arcCurveResolution={32}
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={1400}

        // ─── Fast Pointer Handling: Only active during pin-drop mode ───
        onGlobeClick={isPinMode ? (coords: { lat: number; lng: number }) => {
          triggerDestination(coords.lng, coords.lat);
        } : undefined}
      />
    </div>
  );
});

GlobeEngine.displayName = 'GlobeEngine';
export default React.memo(GlobeEngine);
