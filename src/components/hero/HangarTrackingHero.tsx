"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Phone,
  Mail,
  Clock,
  Truck,
  FileCheck,
  PlaneTakeoff,
  Share2,
  ShieldCheck,
  CheckCircle2,
  Globe2,
  ArrowRight,
  ExternalLink,
  X,
  MapPin,
  Calendar,
  AlertCircle,
  Loader2,
  Radio,
  Lock,
  Sparkles,
} from "lucide-react";

interface HangarTrackingHeroProps {
  active?: boolean;
}

type SearchTab = "tracking_no" | "forwarding_no" | "reference_no";

interface TrackingData {
  success: boolean;
  trackingNo?: string;
  forwardingNo?: string;
  referenceNo?: string;
  status?: string;
  bookedDate?: string;
  consignee?: string;
  destination?: string;
  pieces?: string;
  weight?: string;
  isDemo?: boolean;
  error?: string;
  events?: Array<{
    event_description: string;
    event_at: string;
    event_location?: string;
    event_remark?: string;
  }>;
}

const CORRIDOR_UPDATES = [
  { corridor: "BOM ➔ LHR", aircraft: "B777-F", status: "In Flight (34,000ft)", color: "text-emerald-400" },
  { corridor: "BOM ➔ DXB", aircraft: "A330-200F", status: "Customs Cleared", color: "text-[#00F0FF]" },
  { corridor: "BOM ➔ JFK", aircraft: "B747-8F", status: "EDI Gateway Active", color: "text-[#10B981]" },
  { corridor: "BOM ➔ SIN", aircraft: "B767-300F", status: "Dispatched to Hub", color: "text-emerald-400" },
  { corridor: "BOM ➔ FRA", aircraft: "MD-11F", status: "Priority Clearance", color: "text-[#00F0FF]" },
];

function HangarTrackingHero({ active = true }: HangarTrackingHeroProps) {
  const [activeTab, setActiveTab] = useState<SearchTab>("tracking_no");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TrackingData | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);

  const handleTrack = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const cleanQuery = (customQuery ?? (query.trim() || "FF-8921-IN")).trim();
    setQuery(cleanQuery);

    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/tracking?query=${encodeURIComponent(cleanQuery)}&type=${activeTab}`
      );
      const data = await res.json();
      setResult(data);
      setShowResultModal(true);
    } catch {
      setResult({
        success: false,
        trackingNo: cleanQuery,
        status: "Error",
        error: "Network connection error while contacting central dispatch server.",
      });
      setShowResultModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceholder = () => {
    switch (activeTab) {
      case "tracking_no":
        return "Enter Master Airway Bill (e.g. FF-8921-IN)";
      case "forwarding_no":
        return "Enter partner courier / interline forwarding AWB";
      case "reference_no":
        return "Enter commercial invoice or client docket ID";
    }
  };

  return (
    <section className={`relative w-full h-full flex flex-col items-center justify-center px-4 pt-4 pb-24 sm:py-6 overflow-hidden touch-pan-y ${active ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* ═══ Background: Aircraft Hangar Image (Clear & Cinematic) ═══ */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-[1.02] pointer-events-none"
        style={{
          backgroundImage: "url('/hangar-hero.jpg')",
          filter: "blur(0.8px)",
        }}
      />

      {/* Balanced dark gradient overlays tailored to warm industrial lighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/60 via-black/35 to-[#030712]/75 pointer-events-none" />
      <div className="absolute inset-0 bg-radial from-transparent via-[#030712]/25 to-[#030712]/70 pointer-events-none" />

      {/* ═══ Center Stage Content: Pure In-Flow Flex Layout (Zero Collisions) ═══ */}
      <div className="relative z-20 w-full max-w-2xl mx-auto flex flex-col items-center my-auto py-2">
        
        {/* 1. Main Heading (Crisp & High-Contrast) */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white text-center tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
          Dispatch & <span className="text-[#10B981] drop-shadow-[0_0_25px_rgba(16, 185, 129,0.5)]">Customs Telemetry</span>
        </h2>

        {/* 2. Subtitle Description (Streamlined & Punchy) */}
        <p className="text-xs sm:text-sm text-white/90 text-center max-w-md mt-1.5 font-medium leading-relaxed px-4 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 shadow-lg">
          Real-time EDI tracking across 220+ customs corridors.
        </p>

        {/* 3. Live Freight Corridors (In-Flow, Never Overlapping) */}
        <div className="w-full max-w-xl mx-auto my-3 hidden sm:flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-3.5 px-4 py-1 rounded-full bg-slate-950/80 border border-white/10 backdrop-blur-md shadow-lg text-[11px] font-mono">
            <div className="flex items-center gap-1.5 text-[#10B981] font-semibold uppercase tracking-wider shrink-0">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>Air Corridors</span>
            </div>
            <span className="text-white/20">|</span>
            <div className="flex items-center gap-3 shrink-0">
              {CORRIDOR_UPDATES.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="text-white/80 font-bold">{item.corridor}</span>
                  <span className={`text-[10px] font-medium ${item.color}`}>• {item.status}</span>
                  {idx < 2 && <span className="text-white/20 ml-2">|</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Main Spatial Console Card with Cyber Notches */}
        <div className="relative mt-2 w-full backdrop-blur-md bg-slate-950/90 border border-white/20 rounded-3xl p-5 sm:p-6 md:p-7 shadow-[0_30px_90px_rgba(0,0,0,0.9)]">
          
          {/* Cyber HUD Corner Notches */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#10B981]/60 rounded-tl-sm pointer-events-none" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#10B981]/60 rounded-tr-sm pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#00F0FF]/60 rounded-bl-sm pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#00F0FF]/60 rounded-br-sm pointer-events-none" />

          {/* Console Header Row */}
          <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#00F0FF]/15 border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF] shadow-[0_0_20px_rgba(0,240,255,0.2)] shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Central Cargo Dispatch</span>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.08] text-white/80 border border-white/15">
                    HUB: BOM-AIR
                  </span>
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[10px] font-mono text-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.2)]">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>LIVE EDI FEED</span>
            </div>
          </div>

          {/* Mode Selector Tabs */}
          <div className="mt-4 bg-black/50 border border-white/15 p-1.5 rounded-2xl flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("tracking_no")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "tracking_no"
                  ? "bg-[#10B981] text-slate-950 font-bold shadow-[0_0_15px_rgba(16, 185, 129,0.35)]"
                  : "text-white/70 hover:text-white hover:bg-white/[0.08]"
              }`}
            >
              <PlaneTakeoff className="w-3.5 h-3.5" />
              <span className="truncate">Master AWB</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("forwarding_no")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "forwarding_no"
                  ? "bg-[#10B981] text-slate-950 font-bold shadow-[0_0_15px_rgba(16, 185, 129,0.35)]"
                  : "text-white/70 hover:text-white hover:bg-white/[0.08]"
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="truncate">Interline AWB</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("reference_no")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "reference_no"
                  ? "bg-[#10B981] text-slate-950 font-bold shadow-[0_0_15px_rgba(16, 185, 129,0.35)]"
                  : "text-white/70 hover:text-white hover:bg-white/[0.08]"
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span className="truncate">Customs Ref</span>
            </button>
          </div>

          {/* Search Input Form */}
          <form onSubmit={(e) => handleTrack(e)} className="mt-3.5">
            <div className="relative flex items-center">
              <span className="absolute left-4 font-mono text-xs text-[#10B981]/90 select-none">
                &gt;_
              </span>
              <input
                id="hero-track-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={getPlaceholder()}
                className="w-full pl-10 pr-4 py-3 bg-black/60 border border-white/20 rounded-2xl text-white font-mono text-xs sm:text-sm placeholder:text-white/45 focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/30 transition-all shadow-inner"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3.5 text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Demo Dockets (Clean & Focused) */}
            <div className="mt-2.5 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-white/60 px-1 font-mono">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#10B981]" />
                <span className="text-[11px] text-white/50">Verified Dockets:</span>
                <button
                  type="button"
                  onClick={() => handleTrack(undefined, "FF-8921-IN")}
                  className="text-[11px] font-bold text-[#10B981] hover:underline cursor-pointer bg-[#10B981]/15 hover:bg-[#10B981]/25 px-2.5 py-0.5 rounded border border-[#10B981]/40 transition-colors"
                >
                  FF-8921-IN (London)
                </button>
                <button
                  type="button"
                  onClick={() => handleTrack(undefined, "FF-4402-AE")}
                  className="text-[11px] font-bold text-[#00F0FF] hover:underline cursor-pointer bg-[#00F0FF]/15 hover:bg-[#00F0FF]/25 px-2.5 py-0.5 rounded border border-[#00F0FF]/40 hidden sm:inline-block transition-colors"
                >
                  FF-4402-AE (Dubai)
                </button>
              </span>
            </div>

            {/* CTA Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-3.5 w-full py-3 sm:py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 text-sm sm:text-base font-extrabold text-slate-950 transition-all cursor-pointer bg-[#10B981] hover:bg-emerald-400 active:scale-[0.99] shadow-[0_0_25px_rgba(16, 185, 129,0.35)]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Connecting to BOM EDI Gateway...</span>
                </>
              ) : (
                <>
                  <span>Fetch Consignment Telemetry</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Trust Badges (Decluttered Single-Line) */}
          <div className="mt-4 pt-3.5 border-t border-white/10 grid grid-cols-3 gap-2 text-center font-mono">
            <div className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-black/40 border border-white/10 shadow-inner">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
              <span className="text-[10px] sm:text-[11px] text-white font-semibold">IATA Regulated</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-black/40 border border-white/10 shadow-inner">
              <Clock className="w-3.5 h-3.5 text-[#00F0FF] shrink-0" />
              <span className="text-[10px] sm:text-[11px] text-white font-semibold">Sub-Second Feed</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-black/40 border border-white/10 shadow-inner">
              <Globe2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-[10px] sm:text-[11px] text-white font-semibold">220+ Gateways</span>
            </div>
          </div>
        </div>

        {/* 6. Operations Hotline Support Bar */}
        <div className="mt-3 hidden sm:flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-white/80 font-mono px-4 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md border border-white/15 shadow-xl">
          <a
            href="tel:+912255550199"
            className="flex items-center gap-1.5 hover:text-[#10B981] transition-colors"
          >
            <Phone className="w-3 h-3 text-[#10B981]" />
            <span>Air Cargo Ops: +91 22 5555 0199</span>
          </a>
          <span className="hidden sm:inline text-white/30">•</span>
          <a
            href="mailto:contact@firstflight-demo.com"
            className="flex items-center gap-1.5 hover:text-[#00F0FF] transition-colors"
          >
            <Mail className="w-3 h-3 text-[#00F0FF]" />
            <span>contact@firstflight-demo.com</span>
          </a>
          <span className="hidden md:inline text-white/30">•</span>
          <span className="hidden md:flex items-center gap-1.5 text-white/60">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>256-Bit Encrypted Manifest</span>
          </span>
        </div>
      </div>

      {/* ═══ Interactive Live Tracking Modal ═══ */}
      <AnimatePresence>
        {showResultModal && result && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-950 border border-white/20 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-[0_25px_80px_rgba(0,0,0,0.95)] text-white relative max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Close Button */}
              <button
                onClick={() => setShowResultModal(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Status Header */}
              <div className="flex items-center gap-3">
                {result.success ? (
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-white/40 uppercase tracking-widest">
                      Consignment Telemetry
                    </span>
                    {result.isDemo && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 font-bold">
                        VERIFIED DEMO
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    AWB #{result.trackingNo || query}
                  </h3>
                </div>
              </div>

              {/* Result Overview Cards */}
              {result.success ? (
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3 bg-white/[0.04] p-4 rounded-2xl border border-white/10 text-sm">
                    <div>
                      <span className="text-xs text-white/40 block">Current Status</span>
                      <span className="font-bold text-[#10B981] text-base">
                        {result.status || "In Transit"}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-white/40 block">Destination</span>
                      <span className="font-medium text-white/90 truncate block">
                        {result.destination || "International Gateway"}
                      </span>
                    </div>
                    {result.forwardingNo && (
                      <div>
                        <span className="text-xs text-white/40 block">Forwarding No</span>
                        <span className="font-mono text-xs text-white/80">
                          {result.forwardingNo}
                        </span>
                      </div>
                    )}
                    {result.pieces && (
                      <div>
                        <span className="text-xs text-white/40 block">Cargo Details</span>
                        <span className="text-xs text-white/80">
                          {result.pieces} ({result.weight || "N/A"})
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Telemetry Timeline Events */}
                  {result.events && result.events.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-xs uppercase font-mono tracking-wider text-white/40 mb-3">
                        Live Waypoint Timeline
                      </h4>
                      <div className="space-y-3 relative pl-4 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                        {result.events.map((ev, i) => (
                          <div key={i} className="relative text-xs">
                            <div className="absolute -left-[15px] top-1 w-2.5 h-2.5 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
                            <p className="font-semibold text-white">
                              {ev.event_description}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-white/50 mt-0.5">
                              {ev.event_location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-white/40" />
                                  {ev.event_location}
                                </span>
                              )}
                              <span>•</span>
                              <span className="flex items-center gap-1 font-mono">
                                <Calendar className="w-3 h-3 text-white/40" />
                                {ev.event_at}
                              </span>
                            </div>
                            {ev.event_remark && (
                              <p className="text-[11px] text-white/40 italic mt-0.5">
                                {ev.event_remark}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* External Tracking Link */}
                  <div className="pt-2">
                    <Link
                      href="/dispatch"
                      className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white flex items-center justify-center gap-2 text-xs font-mono transition-all"
                    >
                      <span>View 3D Spatial Route on Global Radar</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="mt-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-sm">
                  <p className="text-rose-300 font-medium">
                    No active consignment records matched &ldquo;{query}&rdquo;.
                  </p>
                  <p className="text-xs text-rose-300/70 mt-1">
                    Please verify your AWB or Reference number, or try the verified demo docket{" "}
                    <button
                      onClick={() => handleTrack(undefined, "FF-8921-IN")}
                      className="font-bold underline text-white cursor-pointer"
                    >
                      FF-8921-IN
                    </button>
                    .
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default React.memo(HangarTrackingHero);
