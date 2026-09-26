"use client";

import React, { useState, useEffect } from "react";
import { motion, useTransform, type MotionValue } from "motion/react";
import { Calculator, Package, Radio, ShieldCheck } from "lucide-react";

interface ProcessTracker3DProps {
  progress?: number;
  scrollProgress?: MotionValue<number>;
}

const steps = [
  {
    id: 1,
    title: "Book Shipment",
    description: "Online portal / Instant rate quote",
    icon: Calculator,
    threshold: 0.25,
  },
  {
    id: 2,
    title: "Pick-Up & Pack",
    description: "Expert multimodal handling",
    icon: Package,
    threshold: 0.5,
  },
  {
    id: 3,
    title: "In Transit",
    description: "Real-time GPS telemetry",
    icon: Radio,
    threshold: 0.75,
  },
  {
    id: 4,
    title: "Delivered",
    description: "Customs sign-off & proof",
    icon: ShieldCheck,
    threshold: 1.0,
  },
];

function ProcessTracker3D({ progress = 0, scrollProgress }: ProcessTracker3DProps) {
  const [activeStepCount, setActiveStepCount] = useState(1);
  const [telemetryPct, setTelemetryPct] = useState(0);

  // Directly transform scrollProgress on GPU compositor outside React render cycle
  const fallbackProgress = React.useRef(progress);
  fallbackProgress.current = progress;

  const transformedProgress = useTransform(
    scrollProgress || ({ get: () => fallbackProgress.current, on: () => () => {} } as unknown as MotionValue<number>),
    (p: number) => {
      if (scrollProgress) {
        if (p < 0.74) return 0;
        if (p > 0.88) return 1;
        return (p - 0.74) / (0.88 - 0.74);
      }
      return Math.max(0, Math.min(1, progress));
    }
  );

  useEffect(() => {
    if (scrollProgress) {
      const unsub = scrollProgress.on("change", (p) => {
        if (p < 0.74 || p >= 0.88) return;
        const localP = (p - 0.74) / (0.88 - 0.74);
        setTelemetryPct(Math.round(localP * 100));
        const activeCount = steps.filter((s) => localP >= s.threshold).length;
        setActiveStepCount((prev) => (prev !== activeCount ? activeCount : prev));
      });
      return unsub;
    }
  }, [scrollProgress]);

  // Clamp progress between 0 and 1 to prevent visual glitches
  const clampedProgress = Math.max(0, Math.min(1, progress));

  return (
    <div className="relative w-full max-w-2xl mx-auto p-4 sm:p-6 md:p-10 font-sans">
      {/* Background Panel - high-performance GPU friendly styling */}
      <div className="absolute inset-0 bg-slate-950/92 border border-white/[0.08] rounded-3xl shadow-2xl" />
      
      <div className="relative z-10">
        <div className="mb-4 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-[800] tracking-tight text-white mb-1.5 uppercase">
            Logistics Pipeline
          </h2>
          <div className="text-[#00F0FF] font-mono tabular-nums text-xs sm:text-sm uppercase tracking-widest flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F0FF]"></span>
            </span>
            <span>System Telemetry: {scrollProgress ? telemetryPct : (clampedProgress * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* Timeline Container */}
        <div className="relative h-[340px] sm:h-[450px] md:h-[500px] w-full mt-4 sm:mt-8">
          {/* SVG Line */}
          <div className="absolute top-0 bottom-0 left-6 sm:left-12 w-2 -translate-x-1/2">
            <svg 
              className="w-full h-full overflow-visible" 
              preserveAspectRatio="none" 
              viewBox="0 0 100 100"
            >
              {/* Background Track */}
              <line 
                x1="50" y1="0" x2="50" y2="100" 
                stroke="rgba(255,255,255,0.1)" 
                strokeWidth="2" 
                vectorEffect="non-scaling-stroke" 
              />
              {/* Animated Laser Beam */}
              <motion.line 
                x1="50" y1="0" x2="50" y2="100" 
                stroke="#00F0FF" 
                strokeWidth="4" 
                vectorEffect="non-scaling-stroke" 
                style={{ 
                  pathLength: scrollProgress ? transformedProgress : clampedProgress,
                  filter: "drop-shadow(0 0 8px #00F0FF)",
                }} 
              />
            </svg>
          </div>

          {/* Nodes */}
          {steps.map((step) => {
            const isActive = scrollProgress ? activeStepCount >= step.id : clampedProgress >= step.threshold;
            const Icon = step.icon;

            return (
              <div 
                key={step.id} 
                className="absolute w-full flex items-center -translate-y-1/2"
                style={{ top: `${step.threshold * 100}%` }}
              >
                {/* Node Circle */}
                <div className="absolute left-6 sm:left-12 -translate-x-1/2 flex items-center justify-center">
                  <motion.div
                    className={`relative z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 bg-[#030712] transition-colors duration-500 ${
                      isActive 
                        ? "border-[#00F0FF] text-[#00F0FF]" 
                        : "border-white/10 text-white/30"
                    }`}
                    animate={{
                      boxShadow: isActive 
                        ? "0 0 20px 2px rgba(0, 240, 255, 0.4)" 
                        : "0 0 0px 0px rgba(0, 240, 255, 0)",
                    }}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    
                    {/* Pulse Effect */}
                    {isActive && (
                      <motion.span
                        className="absolute inset-0 rounded-full border border-[#00F0FF]"
                        animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                      />
                    )}
                  </motion.div>
                </div>

                {/* Content */}
                <div className="ml-16 sm:ml-28 pr-2 sm:pr-4">
                  <motion.div
                    initial={{ opacity: 0.3, x: -10 }}
                    animate={{ 
                      opacity: isActive ? 1 : 0.3,
                      x: isActive ? 0 : -10,
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <div className="flex items-baseline space-x-2 sm:space-x-3 mb-0.5 sm:mb-1">
                      <span className="font-mono tabular-nums text-[10px] sm:text-xs text-white/40">
                        0{step.id}
                      </span>
                      <h3 className={`text-sm sm:text-xl font-[800] tracking-tight ${isActive ? "text-white" : "text-white/50"}`}>
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-[11px] sm:text-sm text-white/60 leading-tight">
                      {step.description}
                    </p>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default React.memo(ProcessTracker3D);
