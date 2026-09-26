"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, PanInfo } from "motion/react";
import { Anchor, Plane, Truck, Warehouse } from "lucide-react";

interface ArcCarouselProps {
  progress?: number; // 0 to 1
}

const CARDS = [
  {
    id: "sea",
    number: "01",
    tag: "OCEAN FREIGHT",
    title: "Sea Cargo Solutions",
    description:
      "Global maritime corridors with real-time port telemetry, FCL/LCL consolidation, and climate-regulated cargo containers.",
    icon: Anchor,
    glow: "shadow-[0_0_35px_rgba(16,185,129,0.25)]",
    border: "border-emerald-500/40",
    borderInactive: "border-emerald-500/15",
    accent: "text-emerald-400",
    bgAccent: "bg-emerald-400",
  },
  {
    id: "air",
    number: "02",
    tag: "AIR EXPRESS",
    title: "Air Freight Logistics",
    description:
      "Priority global dispatch with expedited customs clearance and scheduled cargo flights for high-value freight.",
    icon: Plane,
    glow: "shadow-[0_0_35px_rgba(0,240,255,0.25)]",
    border: "border-[#00F0FF]/40",
    borderInactive: "border-[#00F0FF]/15",
    accent: "text-[#00F0FF]",
    bgAccent: "bg-[#00F0FF]",
  },
  {
    id: "express",
    number: "03",
    tag: "LAST MILE",
    title: "Express Door-to-Door",
    description:
      "Hyper-local delivery networks seamlessly connected to international trunk corridors for rapid, guaranteed delivery windows.",
    icon: Truck,
    glow: "shadow-[0_0_35px_rgba(16, 185, 129,0.25)]",
    border: "border-[#10B981]/40",
    borderInactive: "border-[#10B981]/15",
    accent: "text-[#10B981]",
    bgAccent: "bg-[#10B981]",
  },
  {
    id: "warehouse",
    number: "04",
    tag: "HAZMAT & STORAGE",
    title: "Warehousing & DGR",
    description:
      "IATA/IMDG certified storage facilities, dangerous goods classification, temperature-controlled vaulting, and secure logistics.",
    icon: Warehouse,
    glow: "shadow-[0_0_35px_rgba(245,158,11,0.25)]",
    border: "border-amber-500/40",
    borderInactive: "border-amber-500/15",
    accent: "text-amber-400",
    bgAccent: "bg-amber-400",
  },
];

function ArcCarousel({ progress }: ArcCarouselProps) {
  const [prevProgress, setPrevProgress] = useState(progress);
  const [manualIndex, setManualIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  if (progress !== prevProgress) {
    setPrevProgress(progress);
    setManualIndex(null);
  }

  // Responsive mobile check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Active index dynamically driven by scroll or manual selection
  const activeIndex = manualIndex !== null
    ? manualIndex
    : (progress !== undefined ? progress * (CARDS.length - 1) : 0);

  // Handle touch swipe / drag navigation
  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -40 || velocity < -400) {
      setManualIndex(Math.min(CARDS.length - 1, Math.round(activeIndex + 1)));
    } else if (offset > 40 || velocity > 400) {
      setManualIndex(Math.max(0, Math.round(activeIndex - 1)));
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[410px] md:h-[470px] flex flex-col items-center justify-center overflow-hidden select-none"
      style={{ perspective: "1400px" }}
    >
      {/* Interactive Drag Layer */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.08}
        onDragEnd={handleDragEnd}
        className="absolute inset-0 z-50 cursor-grab active:cursor-grabbing touch-pan-y"
      />

      {/* 3D Carousel Stage */}
      <div
        className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[380px] h-[360px] md:h-[410px] flex items-center justify-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        {CARDS.map((card, index) => {
          const offset = index - activeIndex;
          const absOffset = Math.abs(offset);

          // Card spacing: optimal separation ensuring active card text is 100% visible & unblocked
          const spacing = isMobile ? 175 : 330;
          const xPos = offset * spacing;
          const zPos = (isMobile ? -130 : -100) * absOffset; // 3D pushback for inactive cards
          const rotY = offset * (isMobile ? -16 : -12); // Subtle 3D tilt
          const scale = Math.max(0.75, 1 - absOffset * (isMobile ? 0.16 : 0.12));
          
          // Center card is always top-most with highest zIndex
          const zIndex = Math.round(60 - absOffset * 20);
          const isCenter = Math.round(activeIndex) === index;
          const opacity = isCenter ? 1 : (isMobile ? Math.max(0, 0.30 - (absOffset - 0.5) * 0.25) : Math.max(0, 0.45 - (absOffset - 0.5) * 0.25));

          // Render only cards within active viewing cone
          if (absOffset > 2.0) return null;

          return (
            <motion.div
              key={card.id}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={false}
              animate={{
                x: xPos,
                z: zPos,
                rotateY: rotY,
                scale: scale,
                opacity: opacity,
                zIndex: zIndex,
              }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 28,
                mass: 0.6,
              }}
              style={{
                transformStyle: "preserve-3d",
                willChange: "transform, opacity",
              }}
            >
              {/* Card Surface: 100% opaque obsidian to completely block background bleed */}
              <div
                className={`relative w-full h-full p-6 md:p-8 rounded-3xl bg-[#070E1C] border ${
                  isCenter ? `${card.border} ${card.glow}` : `${card.borderInactive} shadow-xl`
                } flex flex-col justify-between overflow-hidden transition-all duration-300`}
                style={{
                  boxShadow: isCenter
                    ? "0 30px 60px -15px rgba(0, 0, 0, 0.95), 0 0 35px rgba(0, 0, 0, 0.8)"
                    : "0 15px 30px -10px rgba(0, 0, 0, 0.7)",
                }}
              >
                {/* Background Ambient Radial Glow */}
                <div
                  className={`absolute -top-24 -right-24 w-52 h-52 rounded-full blur-[80px] pointer-events-none transition-opacity duration-300 ${
                    isCenter ? "opacity-25" : "opacity-10"
                  } ${card.bgAccent}`}
                />

                {/* Card Header & Content */}
                <div className="relative z-10 flex flex-col gap-4 md:gap-5">
                  <div className="flex items-center justify-between">
                    <div
                      className={`p-3 md:p-3.5 rounded-2xl bg-[#030712] w-fit border border-white/10 shadow-inner ${card.accent}`}
                    >
                      <card.icon className="w-6 h-6 md:w-7 md:h-7" />
                    </div>
                    <span className="font-mono text-xs text-white/40 tracking-widest uppercase">
                      {card.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2 leading-snug">
                      {card.title}
                    </h3>
                    <p
                      className={`text-xs md:text-sm leading-relaxed transition-opacity duration-200 ${
                        isCenter ? "text-gray-200 opacity-100" : "text-gray-400 opacity-20 line-clamp-1"
                      }`}
                    >
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer Status Telemetry */}
                <div className="relative z-10 mt-auto pt-4">
                  <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                    <span className="text-white/40">SYS_CORRIDOR</span>
                    <span className={`font-semibold tracking-wider ${isCenter ? card.accent : "text-white/30"}`}>
                      {isCenter ? "ACTIVE" : "STANDBY"}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className={`h-full ${card.bgAccent}`}
                      initial={{ width: "25%" }}
                      animate={{ width: isCenter ? "100%" : "25%" }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Watermark Number */}
                <div className="absolute bottom-4 right-5 opacity-10 pointer-events-none select-none">
                  <span className="font-mono text-5xl md:text-6xl font-extrabold tracking-tighter text-white">
                    {card.number}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pagination Dot Indicators */}
      <div className="relative z-40 mt-6 flex items-center gap-2 pointer-events-auto">
        {CARDS.map((card, idx) => {
          const isActive = Math.round(activeIndex) === idx;
          return (
            <button
              key={card.id}
              onClick={() => setManualIndex(idx)}
              aria-label={`Go to ${card.title}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isActive
                  ? `w-8 ${card.bgAccent} shadow-[0_0_10px_currentColor]`
                  : "w-2 bg-white/20 hover:bg-white/40"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}

export default React.memo(ArcCarousel);
