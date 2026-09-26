"use client";

import React, { useState, useRef } from "react";
import { motion, useSpring } from "motion/react";
import { ModeSegmentSwitcher } from "./ModeSegmentSwitcher";
import { TrackingInput } from "./TrackingInput";
import { MagneticSubmitButton } from "./MagneticSubmitButton";
import { StatusTelemetryRibbon } from "./StatusTelemetryRibbon";
import { TrackingResultModal } from "./TrackingResultModal";
import { queryTracking, type TrackingResult, type TrackingSearchType } from "@/lib/tracking-api";

export function TrackingConsole() {
  const [activeMode, setActiveMode] = useState("Express Courier");
  const [searchType, setSearchType] = useState<TrackingSearchType>("tracking_no");
  const [trackingId, setTrackingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Springs for smooth 3D rotation
  const rotateX = useSpring(0, { stiffness: 220, damping: 24 });
  const rotateY = useSpring(0, { stiffness: 220, damping: 24 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate mouse position relative to the center of the card
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Map to rotation angles (-7 to 7 degrees)
    const rY = (mouseX / (width / 2)) * 7;
    const rX = -(mouseY / (height / 2)) * 7;
    
    rotateY.set(rY);
    rotateX.set(rX);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const handleSubmit = async () => {
    if (!trackingId.trim()) return;
    setLoading(true);
    try {
      const res = await queryTracking(trackingId, searchType);
      setResult(res);
      setIsModalOpen(true);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to reach tracking server.";
      setResult({
        success: false,
        trackingNo: trackingId,
        status: "Error",
        events: [],
        error: errorMsg,
      });
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ perspective: "1000px" }} className="w-full max-w-md">
        <motion.div
          ref={cardRef}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="backdrop-blur-2xl bg-white/[0.03] border border-white/10 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col space-y-5"
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs uppercase tracking-widest text-white/40 font-mono">
              Official Dispatch Console
            </span>
            <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1">
              OM<span className="text-[#10B981]">.</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-white/60">LIVE</span>
            </span>
          </div>

          <ModeSegmentSwitcher activeMode={activeMode} onModeChange={setActiveMode} />

          {/* Search Type Selector */}
          <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/[0.06] text-xs font-mono">
            <button
              type="button"
              onClick={() => setSearchType("tracking_no")}
              className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all ${
                searchType === "tracking_no" ? "bg-[#00F0FF]/20 text-[#00F0FF] font-semibold" : "text-white/40 hover:text-white"
              }`}
            >
              AWB No.
            </button>
            <button
              type="button"
              onClick={() => setSearchType("forwarding_no1")}
              className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all ${
                searchType === "forwarding_no1" ? "bg-[#00F0FF]/20 text-[#00F0FF] font-semibold" : "text-white/40 hover:text-white"
              }`}
            >
              Forwarding
            </button>
            <button
              type="button"
              onClick={() => setSearchType("reference_no")}
              className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all ${
                searchType === "reference_no" ? "bg-[#00F0FF]/20 text-[#00F0FF] font-semibold" : "text-white/40 hover:text-white"
              }`}
            >
              Reference
            </button>
          </div>
          
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="space-y-4"
          >
            <TrackingInput value={trackingId} onChange={setTrackingId} />
            <MagneticSubmitButton onClick={handleSubmit} loading={loading} />
          </form>
          
          <div className="pt-2 border-t border-white/5">
            <StatusTelemetryRibbon />
          </div>
        </motion.div>
      </div>

      <TrackingResultModal
        result={result}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

