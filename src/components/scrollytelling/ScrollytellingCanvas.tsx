"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useScroll, useMotionValueEvent } from 'motion/react';
import dynamic from 'next/dynamic';
import type { GlobeEngineRef } from '@/components/dispatch/GlobeEngine';
import { WORLD_PLACES } from '@/lib/world-places';

function findNearestWorldPlace(lat: number, lng: number): string {
  let closest = WORLD_PLACES[0];
  let minD = Infinity;
  for (let i = 0; i < WORLD_PLACES.length; i++) {
    const p = WORLD_PLACES[i];
    const d = (p.lat - lat) ** 2 + (p.lng - lng) ** 2;
    if (d < minD) {
      minD = d;
      closest = p;
    }
  }
  if (minD < 36) {
    return `${closest.name}, ${closest.country}`;
  }
  return `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`;
}

const ExecutiveTopNavbar = dynamic(() => import('@/components/layout/ExecutiveTopNavbar'), { ssr: false });
const AirplaneHero = dynamic(() => import('./AirplaneHero'), { ssr: false });
const AboutHeroStage = dynamic(() => import('./AboutHeroStage'), { ssr: false });
const HangarTrackingHero = dynamic(() => import('@/components/hero/HangarTrackingHero'), { ssr: false });
const GlobeEngine = dynamic(() => import('@/components/dispatch/GlobeEngine'), { ssr: false });
const ProcessTracker3D = dynamic(() => import('./ProcessTracker3D'), { ssr: false });
const TestimonialDock = dynamic(() => import('./TestimonialDock'), { ssr: false });
const QuickActionDrawer = dynamic(() => import('./QuickActionDrawer'), { ssr: false });
const SearchHUD = dynamic(() => import('@/components/dispatch/SearchHUD'), { ssr: false });
const DropPinButton = dynamic(() => import('@/components/dispatch/DropPinButton'), { ssr: false });
const DestinationModal = dynamic(() => import('@/components/dispatch/DestinationModal'), { ssr: false });

/*
 * RE-SEQUENCED STAGE MAP (700vh total scroll height)
 * ──────────────────────────────────────────────────────────
 * 0.00 – 0.20 → Stage 1: Airplane Image Sequence (Runway takeoff)
 * 0.20 – 0.38 → Stage 2: Arc Carousel (Logistics Solutions)
 * 0.38 – 0.56 → Stage 3: 3D Globe / Earth (Routes & Corridor Telemetry)
 * 0.56 – 0.74 → Stage 4: Hangar Dispatch & Consignment Hub (AFTER EARTH!)
 * 0.74 – 0.88 → Stage 5: Process Timeline (Booking to Doorstep)
 * 0.88 – 1.00 → Stage 6: Testimonials & Trust Dock
 */

export default function ScrollytellingCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeEngineRef>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [activeStage, setActiveStage] = useState(1);
  const [globeMounted, setGlobeMounted] = useState(false);
  const [isPinMode, setIsPinMode] = useState(false);
  const [isTouchRotate, setIsTouchRotate] = useState(false);

  // ── Mobile detection: use BOTH a ref (for synchronous scroll handler) and state (for JSX)
  const isMobileRef    = useRef(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const mobile = typeof window !== 'undefined' && window.innerWidth < 768;
    isMobileRef.current  = mobile;
    setIsMobileDevice(mobile);
    if (!mobile) setGlobeMounted(true);
  }, []);

  // 3D Globe State
  const [destination, setDestination] = useState<{ address: string; lat: number; lng: number; distanceKm: number } | null>(null);

  const activeStageRef = useRef(1);
  const globeMountedRef = useRef(false);

  // Keep globeMountedRef in sync
  useEffect(() => { globeMountedRef.current = globeMounted; }, [globeMounted]);

  const updateStage = (stage: number) => {
    if (activeStageRef.current !== stage) {
      activeStageRef.current = stage;
      setActiveStage(stage);
    }
  };

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    // Use REF (not state) — always reflects true mobile status synchronously
    const mob = isMobileRef.current;
    let nextStage: number;

    if (mob) {
      // Mobile: Globe (Stage 3) removed — 5 stages across 580vh
      // 0.00–0.20 → Stage 1 (Airplane)
      // 0.20–0.40 → Stage 2 (About)
      // 0.40–0.62 → Stage 4 (Hangar)
      // 0.62–0.80 → Stage 5 (Process)
      // 0.80–1.00 → Stage 6 (Testimonials)
      nextStage = p < 0.20 ? 1 : p < 0.40 ? 2 : p < 0.62 ? 4 : p < 0.80 ? 5 : 6;
    } else {
      // Desktop: full 6-stage sequence
      nextStage = p < 0.20 ? 1 : p < 0.38 ? 2 : p < 0.56 ? 3 : p < 0.74 ? 4 : p < 0.88 ? 5 : 6;

      if (p > 0.18 && !globeMountedRef.current) {
        globeMountedRef.current = true;
        setGlobeMounted(true);
      }
      if (nextStage === 3) {
        const localP = (p - 0.38) / (0.56 - 0.38);
        globeRef.current?.setScrollStage(localP);
      }
    }

    updateStage(nextStage);
  });

  const handlePinDrop = React.useCallback(async (lng: number, lat: number, placeName?: string) => {
    // Haversine calculation from Mumbai BOM HQ
    const R = 6371;
    const dLat = (lat - 18.9438) * Math.PI / 180;
    const dLon = (lng - 72.8353) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(18.9438 * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distanceKm = Math.round(R * c);

    globeRef.current?.addDestinationPin(lng, lat);
    globeRef.current?.drawFlightArc(lng, lat);

    const initialAddress = placeName || findNearestWorldPlace(lat, lng);
    setDestination({ address: initialAddress, lat, lng, distanceKm });

    if (!placeName) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 1200);
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`, { signal: controller.signal });
        clearTimeout(timer);
        if (res.ok) {
          const data = await res.json();
          if (data.display_name) {
            setDestination({ address: data.display_name, lat, lng, distanceKm });
          }
        }
      } catch {
        // Instant fallback already set without error
      }
    }
    setIsPinMode(false);
    globeRef.current?.enablePinMode(false);
  }, []);

  const handleSelectLocation = React.useCallback((lng: number, lat: number, placeName?: string) => {
    globeRef.current?.flyTo(lng, lat);
    handlePinDrop(lng, lat, placeName);
  }, [handlePinDrop]);

  const handlePinToggle = React.useCallback(() => {
    const next = !isPinMode;
    setIsPinMode(next);
    globeRef.current?.enablePinMode(next);
    if (next) {
      setDestination(null);
      globeRef.current?.removeDestination();
    }
  }, [isPinMode]);

  return (
    <div ref={containerRef} className={`relative bg-[#030712] touch-pan-y ${isMobileDevice ? 'h-[580vh]' : 'h-[700vh]'}`}>
      <div className="sticky top-0 left-0 w-full h-[100dvh] overflow-hidden touch-pan-y">
        {/* ═══ Persistent: Executive Top Navbar (Always Visible) ═══ */}
        <ExecutiveTopNavbar />

        {/* ═══ Stage 1: Airplane Runway Takeoff Sequence ═══ */}
        <div 
          style={{ 
            opacity: activeStage === 1 ? 1 : 0, 
            visibility: activeStage === 1 ? 'visible' : 'hidden',
            transition: 'opacity 0.3s ease-out, visibility 0.3s ease-out',
            pointerEvents: activeStage === 1 ? 'auto' : 'none',
          }} 
          className="absolute inset-0 z-10"
        >
          <AirplaneHero scrollProgress={scrollYProgress} active={activeStage === 1} />
        </div>

        {/* ═══ Stage 2: About Us & Heritage (Who We Are, Why Choose Us, 30-Year Timeline & Services) ═══ */}
        <div
          style={{ 
            opacity: activeStage === 2 ? 1 : 0, 
            visibility: activeStage === 2 ? 'visible' : 'hidden',
            transition: 'opacity 0.3s ease-out, visibility 0.3s ease-out',
            pointerEvents: activeStage === 2 ? 'auto' : 'none',
          }}
          className="absolute inset-0 z-20 flex items-center justify-center bg-[#030712]"
        >
          <AboutHeroStage scrollProgress={scrollYProgress} active={activeStage === 2} />
        </div>


        {/* ═══ Stage 3: 3D Globe / Earth (Desktop ONLY — removed on mobile) ═══ */}
        {!isMobileDevice && (
          <div 
            style={{ 
              opacity: activeStage === 3 ? 1 : 0, 
              visibility: activeStage === 3 ? 'visible' : 'hidden',
              transition: 'opacity 0.3s ease-out, visibility 0.3s ease-out',
              pointerEvents: activeStage === 3 ? 'auto' : 'none',
            }} 
            className="absolute inset-0 z-30"
          >
            <div className="relative w-full h-full">
              {globeMounted ? (
                <GlobeEngine ref={globeRef} active={activeStage === 3} onPinDrop={handlePinDrop} />
              ) : (
                <div className="absolute inset-0 bg-[#030712]" />
              )}

              {/* Stage Title Overlay */}
              <div className="absolute top-28 sm:top-20 left-3 sm:left-10 z-30 pointer-events-none max-w-sm">
                <div className="backdrop-blur-md bg-slate-950/85 border border-white/10 rounded-2xl p-3 sm:p-4 shadow-2xl pointer-events-auto">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] animate-pulse" />
                    <span className="text-[10px] sm:text-[11px] font-mono text-[#10B981] uppercase tracking-wider font-semibold">
                      Worldwide Corridor Dispatch
                    </span>
                  </div>
                  <h2 className="text-base sm:text-2xl font-extrabold text-white tracking-tight">3D Route Telemetry</h2>
                  <p className="text-xs text-white/60 mt-1 leading-relaxed hidden sm:block">
                    Explore 220+ countries and major hubs. Tap any nation or cargo gateway to generate real-time flight arcs from Mumbai BOM HQ.
                  </p>
                </div>
              </div>

              <SearchHUD
                visible={activeStage === 3}
                className="top-16 sm:top-20"
                onSelectLocation={handleSelectLocation}
              />

              <DropPinButton
                visible={activeStage === 3}
                active={isPinMode}
                onToggle={handlePinToggle}
                rotateMode={isTouchRotate}
                onToggleRotate={() => {
                  const next = !isTouchRotate;
                  setIsTouchRotate(next);
                  globeRef.current?.enableTouchRotate(next);
                }}
              />

              <DestinationModal 
                destination={destination} 
                onClose={() => {
                  setDestination(null);
                  globeRef.current?.removeDestination();
                }} 
                onBook={() => {
                  alert(`Instant dispatch request initialized for ${destination?.address || 'destination'}!`);
                }} 
              />
            </div>
          </div>
        )}

        {/* ═══ Stage 4: Hangar Dispatch & Consignment Hub (AFTER EARTH!) ═══ */}
        <div
          style={{ 
            opacity: activeStage === 4 ? 1 : 0, 
            visibility: activeStage === 4 ? 'visible' : 'hidden',
            transition: 'opacity 0.3s ease-out, visibility 0.3s ease-out',
            pointerEvents: activeStage === 4 ? 'auto' : 'none',
          }}
          className="absolute inset-0 z-35 flex items-center justify-center bg-[#030712]"
        >
          <HangarTrackingHero active={activeStage === 4} />
        </div>

        {/* ═══ Stage 5: Process Timeline ═══ */}
        <div
          style={{ 
            opacity: activeStage === 5 ? 1 : 0, 
            visibility: activeStage === 5 ? 'visible' : 'hidden',
            transition: 'opacity 0.3s ease-out, visibility 0.3s ease-out',
            pointerEvents: activeStage === 5 ? 'auto' : 'none',
          }}
          className="absolute inset-0 z-40 flex items-center justify-center bg-[#030712]"
        >
          <div className="w-full h-full max-w-5xl mx-auto px-4 flex flex-col justify-center">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-6 md:mb-16 tracking-tight">
              From Booking to Doorstep
            </h2>
            <ProcessTracker3D scrollProgress={scrollYProgress} />
          </div>
        </div>

        {/* ═══ Stage 6: Testimonials & Trust Dock ═══ */}
        <div
          style={{ 
            opacity: activeStage === 6 ? 1 : 0, 
            visibility: activeStage === 6 ? 'visible' : 'hidden',
            transition: 'opacity 0.3s ease-out, visibility 0.3s ease-out',
            pointerEvents: activeStage === 6 ? 'auto' : 'none',
          }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-[#030712]"
        >
          <TestimonialDock active={activeStage === 6} />
        </div>

        {/* ═══ Persistent: Quick Action Drawer (visible during flight & exploration) ═══ */}
        <div className="absolute bottom-0 left-0 w-full z-[100] pointer-events-none">
          <div className="pointer-events-auto">
            <QuickActionDrawer />
          </div>
        </div>
      </div>
    </div>
  );
}
