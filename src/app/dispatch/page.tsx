"use client";

import { useRef, useState, useCallback } from 'react';
import { useScroll, useMotionValueEvent, motion } from 'motion/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ChevronDown, ArrowLeft } from 'lucide-react';
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

const GlobeEngine = dynamic(() => import('@/components/dispatch/GlobeEngine'), { ssr: false });
const SearchHUD = dynamic(() => import('@/components/dispatch/SearchHUD'), { ssr: false });
const DestinationModal = dynamic(() => import('@/components/dispatch/DestinationModal'), { ssr: false });
const DropPinButton = dynamic(() => import('@/components/dispatch/DropPinButton'), { ssr: false });

export default function DispatchGlobePage() {
  const [destination, setDestination] = useState<{ address: string; lat: number; lng: number; distanceKm: number } | null>(null);
  const [isPinMode, setIsPinMode] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const globeRef = useRef<GlobeEngineRef | null>(null);

  const { scrollYProgress } = useScroll();
  const rafIdRef = useRef<number | null>(null);
  const isInteractiveRef = useRef(false);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (rafIdRef.current !== null) return;
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      globeRef.current?.setScrollStage(v);
      const next = v >= 0.55;
      if (isInteractiveRef.current !== next) {
        isInteractiveRef.current = next;
        setIsInteractive(next);
      }
    });
  });

  const handlePinDrop = useCallback(async (lng: number, lat: number, customName?: string) => {
    // Calculate distance from Mumbai using haversine
    const R = 6371; // Earth radius in km
    const dLat = (lat - 18.9438) * Math.PI / 180;
    const dLon = (lng - 72.8353) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(18.9438 * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distanceKm = Math.round(R * c);
    
    // Draw arc and pin immediately
    globeRef.current?.addDestinationPin(lng, lat);
    globeRef.current?.drawFlightArc(lng, lat);
    
    const initialAddress = customName || findNearestWorldPlace(lat, lng);
    setDestination({ address: initialAddress, lat, lng, distanceKm });
    setIsPinMode(false);
    globeRef.current?.enablePinMode(false);

    if (!customName) {
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
        // Fallback already set without delay
      }
    }
  }, []);

  const handleSelectLocation = useCallback((lng: number, lat: number, placeName?: string) => {
    globeRef.current?.flyTo(lng, lat);
    handlePinDrop(lng, lat, placeName);
  }, [handlePinDrop]);

  const handlePinToggle = useCallback(() => {
    const newMode = !isPinMode;
    setIsPinMode(newMode);
    globeRef.current?.enablePinMode(newMode);
    if (newMode) {
      setDestination(null);
      globeRef.current?.removeDestination();
    }
  }, [isPinMode]);

  const handleCloseDestination = useCallback(() => {
    setDestination(null);
    globeRef.current?.removeDestination();
  }, []);

  return (
    <div className="relative min-h-[300vh] bg-[#030712]">
      {/* Fixed Globe Canvas */}
      <div className="fixed inset-0 w-full h-screen z-0">
        <GlobeEngine ref={globeRef} onPinDrop={handlePinDrop} />
      </div>

      {/* Top Left Back Navigation */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 backdrop-blur-xl border border-white/10 text-white/70 hover:text-white hover:border-[#10B981]/40 transition-all shadow-xl text-xs font-mono uppercase tracking-wider group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#10B981]" />
        <span>Hub Overview</span>
      </Link>

      {/* Scroll Spacer Content - transparent sections that drive scroll */}
      <div className="relative z-10 pointer-events-none">
        {/* Stage 0: Hero */}
        <div className="h-screen flex items-center justify-center">
          <div className="text-center pointer-events-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white">
              Dispatch <span className="text-[#10B981]">Globe</span>
            </h1>
            <p className="mt-4 text-lg text-white/50">Scroll to explore global shipping corridors</p>
            {/* Scroll indicator */}
            <div className="mt-12 flex flex-col items-center text-white/30">
              <span className="text-xs uppercase tracking-widest mb-2">Scroll</span>
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Stage 1: Global Coverage (scroll spacer) */}
        <div className="h-screen" />

        {/* Stage 2: Interactive (scroll spacer) */}
        <div className="h-screen" />
      </div>

      {/* Floating HUD Elements - only visible in interactive stage */}
      <SearchHUD onSelectLocation={handleSelectLocation} visible={isInteractive} />
      <DropPinButton active={isPinMode} onToggle={handlePinToggle} visible={isInteractive} />
      <DestinationModal 
        destination={destination} 
        onClose={handleCloseDestination} 
        onBook={() => alert('Booking initiated!')} 
      />
    </div>
  );
}
