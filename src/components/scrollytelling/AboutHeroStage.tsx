"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, type MotionValue } from "motion/react";
import { 
  Building2, 
  Clock, 
  Globe2, 
  MapPin, 
  Zap, 
  BadgePercent, 
  Headphones, 
  ShieldCheck, 
  CheckCircle2, 
  Plane, 
  Ship, 
  Truck, 
  Sparkles, 
  ArrowRight, 
  Layers 
} from "lucide-react";
import ArcCarousel from "./ArcCarousel";

interface AboutHeroStageProps {
  progress?: number; // 0 to 1 scroll progress driven by ScrollytellingCanvas
  scrollProgress?: MotionValue<number>;
  active?: boolean;
}

export default function AboutHeroStage({ progress = 0, scrollProgress, active = true }: AboutHeroStageProps) {
  const [activeTab, setActiveTab] = useState<number>(0);
  const userClickedTabRef = useRef<boolean>(false);

  // Automatically sync tab with incoming scroll progress if user hasn't manually clicked
  useEffect(() => {
    if (scrollProgress) {
      const unsub = scrollProgress.on("change", (p) => {
        if (userClickedTabRef.current) return;
        if (p < 0.20 || p >= 0.38) return;
        const localP = (p - 0.20) / (0.38 - 0.20);
        const nextTab = localP < 0.28 ? 0 : localP < 0.54 ? 1 : localP < 0.78 ? 2 : 3;
        setActiveTab((prev) => (prev !== nextTab ? nextTab : prev));
      });
      return unsub;
    }
  }, [scrollProgress]);

  useEffect(() => {
    if (userClickedTabRef.current || scrollProgress) return;
    if (progress < 0.28) {
      setActiveTab(0);
    } else if (progress < 0.54) {
      setActiveTab(1);
    } else if (progress < 0.78) {
      setActiveTab(2);
    } else {
      setActiveTab(3);
    }
  }, [progress, scrollProgress]);

  const tabs = [
    { id: 0, label: "Who We Are", shortLabel: "Story", icon: Building2, tag: "SINCE 1996" },
    { id: 1, label: "Why Choose Us", shortLabel: "Pillars", icon: Zap, tag: "6 PILLARS" },
    { id: 2, label: "30-Year Journey", shortLabel: "Journey", icon: Clock, tag: "MILESTONES" },
    { id: 3, label: "Freight Solutions", shortLabel: "Freight", icon: Layers, tag: "CAROUSEL" },
  ];

  const metrics = [
    { value: "1996", label: "Established Year", sub: "Mumbai Gateway", icon: Building2, color: "#10B981" },
    { value: "30+", label: "Years Experience", sub: "Unbroken Legacy", icon: Clock, color: "#00F0FF" },
    { value: "195+", label: "Countries Served", sub: "Global Corridors", icon: Globe2, color: "#38bdf8" },
    { value: "160+", label: "Mumbai Hubs", sub: "BOM Express Points", icon: MapPin, color: "#a855f7" },
  ];

  const sixPillars = [
    {
      title: "Trusted Since 1996",
      desc: "Over 30 years of proven reliability in international courier and logistics services from Mumbai Gateway.",
      icon: Clock,
      badge: "30+ Yrs Reliability",
      color: "#10B981",
    },
    {
      title: "Fast & Reliable Delivery",
      desc: "Express transit options with guaranteed delivery times and real-time flight tracking.",
      icon: Zap,
      badge: "Priority Transit",
      color: "#00F0FF",
    },
    {
      title: "Affordable Shipping",
      desc: "Competitive commercial volume rates without compromising on speed or safety.",
      icon: BadgePercent,
      badge: "Zero Hidden Fees",
      color: "#10b981",
    },
    {
      title: "Dedicated Support",
      desc: "24/7 customer support with named account managers for every corporate client.",
      icon: Headphones,
      badge: "24/7 Operations",
      color: "#8b5cf6",
    },
    {
      title: "Safe & Secure Handling",
      desc: "Tamper-proof packaging, sealed containers, and comprehensive cargo transit insurance.",
      icon: ShieldCheck,
      badge: "100% Insured",
      color: "#f43f5e",
    },
    {
      title: "Worldwide Network",
      desc: "Coverage across 195+ countries with a vast network of trusted international logistics partners.",
      icon: Globe2,
      badge: "195+ Countries",
      color: "#38bdf8",
    },
  ];

  const milestones = [
    {
      year: "1996",
      era: "GENESIS",
      title: "Founded in Mumbai",
      desc: "First Flight Global was established with a clear mission to pioneer express air cargo corridors and connect global commerce.",
      badge: "Pioneering Genesis",

      color: "#10B981",
      icon: Building2,
    },
    {
      year: "2000s",
      era: "EXPANSION",
      title: "Expansion into Air Cargo",
      desc: "Expanded services to include air cargo, freight forwarding, and comprehensive logistics solutions for businesses and individuals across India.",
      badge: "Air cargo services launched",
      color: "#00F0FF",
      icon: Plane,
    },
    {
      year: "2010s",
      era: "GLOBAL SCALE",
      title: "Global Network Growth",
      desc: "Built partnerships across 195+ countries, establishing a worldwide courier network with door-to-door delivery and customs assistance.",
      badge: "195+ countries reached",
      color: "#38bdf8",
      icon: Globe2,
    },
    {
      year: "Today",
      era: "LEADER",
      title: "Trusted Global Partner",
      desc: "Serving customers across 195+ countries with reliable shipping solutions, 160+ pickup locations across Mumbai, and thousands of happy customers.",
      badge: "500,000+ customers served",
      color: "#a855f7",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-between pt-16 sm:pt-24 pb-4 sm:pb-8 px-3 sm:px-4 max-w-7xl mx-auto overflow-hidden">
      {/* ─── Top Stage Switcher Pill Navigation ─── */}
      <div className="z-20 flex items-center justify-center gap-1 sm:gap-2 bg-slate-950/95 sm:bg-slate-950/80 border border-white/10 backdrop-blur-none sm:backdrop-blur-xl p-1 sm:p-1.5 rounded-full shadow-2xl max-w-full overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                userClickedTabRef.current = true;
              }}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-mono transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-bold shadow-[0_0_20px_rgba(16,185,129,0.35)] scale-105"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
              <span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded-full hidden md:inline-block ${
                isActive ? "bg-slate-950/20 text-slate-950" : "bg-white/5 text-white/40"
              }`}>
                {tab.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* ─── Stage Content Container ─── */}
      <div className="w-full flex-1 flex items-center justify-center my-2 sm:my-4 overflow-y-auto sm:overflow-hidden relative touch-pan-y max-h-[calc(100vh-140px)] sm:max-h-none">
        <AnimatePresence mode="wait">
          {/* ════ Tab 0: WHO WE ARE (Screenshot 4 & 5) ════ */}
          {activeTab === 0 && (
            <motion.div
              key="who-we-are"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center"
            >
              {/* Left Column: Narrative */}
              <div className="lg:col-span-7 space-y-4 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] animate-pulse" />
                  <span className="text-[11px] font-mono tracking-widest text-[#10B981] uppercase font-semibold">
                    WHO WE ARE • ESTABLISHED 1996
                  </span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  Delivering Trust Across the Globe{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#00F0FF]">
                    Since 1996
                  </span>
                </h2>

                <div className="space-y-3 text-white/70 text-sm sm:text-base leading-relaxed font-light">
                  <p>
                    <strong className="text-white font-medium">First Flight Global Express</strong> is a next-generation international courier, air cargo, and freight forwarding platform. Engineered with high-reliability global air corridors, we deliver modern telemetry tracking, guaranteed transit windows, and end-to-end customs clearance.
                  </p>
                  <p className="text-white/60 text-xs sm:text-sm">
                    From express documents to heavy palletized air freight, we handle every consignment with speed and telemetry visibility. Our global corridor network covers <strong className="text-[#00F0FF]">195+ countries</strong>.
                  </p>

                </div>

                {/* 4 Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {metrics.map((m, i) => {
                    const Icon = m.icon;
                    return (
                      <div
                        key={i}
                        className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span 
                            className="text-2xl font-extrabold font-mono"
                            style={{ color: m.color }}
                          >
                            {m.value}
                          </span>
                          <Icon className="w-4 h-4 text-white/40" />
                        </div>
                        <div className="text-xs font-semibold text-white/90">
                          {m.label}
                        </div>
                        <div className="text-[10px] text-white/40 font-mono mt-0.5">
                          {m.sub}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Multimodal Hangar Preview */}
              <div className="lg:col-span-5 hidden sm:block">
                <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl shadow-2xl group">
                  <div className="relative h-56 sm:h-64 rounded-2xl overflow-hidden mb-4 border border-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/hangar-hero.jpg"
                      alt="First Flight Global Express"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-80" />
                    
                    <div className="absolute top-3 left-3 backdrop-blur-md bg-slate-950/80 border border-white/10 rounded-xl px-3 py-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
                      <span className="text-xs font-mono text-white font-semibold">195+ Countries Covered</span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-white/90 backdrop-blur-md bg-slate-950/80 border border-white/10 rounded-xl px-3 py-1.5">
                      <span className="text-[#10B981]">Express Air Freight</span>
                      <span className="text-white/50">Next Flight Out</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                      <Plane className="w-4 h-4 text-[#00F0FF] mx-auto mb-1" />
                      <div className="font-bold text-white">Air Cargo</div>
                      <div className="text-[10px] text-white/40 font-mono">Next Flight Out</div>
                    </div>
                    <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                      <Ship className="w-4 h-4 text-[#38bdf8] mx-auto mb-1" />
                      <div className="font-bold text-white">Ocean Freight</div>
                      <div className="text-[10px] text-white/40 font-mono">FCL / LCL</div>
                    </div>
                    <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                      <Truck className="w-4 h-4 text-[#10B981] mx-auto mb-1" />
                      <div className="font-bold text-white">Surface Transit</div>
                      <div className="text-[10px] text-white/40 font-mono">24/7 Dispatch</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ════ Tab 1: WHY CHOOSE FIRST FLIGHT GLOBAL ════ */}
          {activeTab === 1 && (
            <motion.div
              key="why-choose-us"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full flex flex-col justify-center"
            >
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
                  <span className="text-[11px] font-mono tracking-widest text-[#10B981] uppercase font-semibold">
                    CORE OPERATIONAL EXCELLENCE
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Why Choose <span className="text-[#10B981]">First Flight Global</span>
                </h2>
                <p className="text-xs sm:text-sm text-white/60 mt-1 max-w-2xl mx-auto">
                  Engineered with dedicated air corridors to deliver guaranteed delivery, high security, and competitive rates across 195+ nations.
                </p>
              </div>


              {/* 6 Core Pillars Bento Grid (2-column on mobile so all 6 pillars fit cleanly) */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-5 text-left">
                {sixPillars.map((p, i) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={i}
                      className="p-3 sm:p-5 rounded-2xl bg-slate-900/95 sm:bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all sm:backdrop-blur-xl shadow-lg hover:-translate-y-0.5 group"
                    >
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <div 
                          className="p-1.5 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform"
                          style={{ color: p.color }}
                        >
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <span 
                          className="text-[8px] sm:text-[10px] font-mono px-1.5 sm:px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/60 truncate max-w-[90px] sm:max-w-none"
                          style={{ color: p.color }}
                        >
                          {p.badge}
                        </span>
                      </div>
                      <h3 className="text-xs sm:text-base font-bold text-white group-hover:text-[#10B981] transition-colors line-clamp-1">
                        {p.title}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-white/60 mt-1 leading-relaxed font-light line-clamp-2 sm:line-clamp-none">
                        {p.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ════ Tab 2: 30-YEAR CHRONOLOGICAL JOURNEY (Screenshot 2 & 3) ════ */}
          {activeTab === 2 && (
            <motion.div
              key="milestones"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full flex flex-col justify-center"
            >
              <div className="text-center mb-4 sm:mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 mb-2">
                  <Clock className="w-3.5 h-3.5 text-[#00F0FF]" />
                  <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#00F0FF] uppercase font-semibold">
                    1996 TO TODAY • 30+ YEARS
                  </span>
                </div>
                <h2 className="text-xl sm:text-4xl font-extrabold text-white tracking-tight">
                  The Journey of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#00F0FF]">First Flight Global</span>
                </h2>
                <p className="text-[11px] sm:text-sm text-white/60 mt-1 max-w-2xl mx-auto">
                  From a dedicated local courier desk in Mumbai to a multi-modal global logistics powerhouse.
                </p>
              </div>

              {/* 4 Milestone Era Cards (2-column on mobile so all 4 fit without overflowing) */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-left">
                {milestones.map((m, i) => {
                  const Icon = m.icon;
                  return (
                    <div
                      key={i}
                      className="p-3 sm:p-5 rounded-2xl bg-slate-900/95 sm:bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all sm:backdrop-blur-xl flex flex-col justify-between group shadow-lg"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5 sm:mb-3">
                          <span 
                            className="text-lg sm:text-2xl font-extrabold font-mono"
                            style={{ color: m.color }}
                          >
                            {m.year}
                          </span>
                          <span className="text-[8px] sm:text-[9px] font-mono tracking-widest uppercase px-1.5 sm:px-2 py-0.5 rounded-md bg-white/5 text-white/50">
                            {m.era}
                          </span>
                        </div>
                        <h3 className="text-xs sm:text-base font-bold text-white mb-1 group-hover:text-[#10B981] transition-colors line-clamp-1">
                          {m.title}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-white/60 leading-relaxed font-light line-clamp-2 sm:line-clamp-none">
                          {m.desc}
                        </p>
                      </div>

                      <div className="mt-2 sm:mt-4 pt-2 sm:pt-3 border-t border-white/5">
                        <span 
                          className="text-[9px] sm:text-[11px] font-mono px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-white/5 border border-white/10 text-white/80 inline-block truncate max-w-full"
                        >
                          {m.badge}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ════ Tab 3: MULTIMODAL FREIGHT (Arc Carousel) ════ */}
          {activeTab === 3 && (
            <motion.div
              key="carousel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full flex flex-col items-center justify-center"
            >
              <div className="text-center mb-4">
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Multimodal Logistics for Every Scale
                </h2>
                <p className="text-xs sm:text-sm text-white/60 mt-1">
                  Drag cards or scroll to explore our Sea, Air, Express, and Hazmat services.
                </p>
              </div>

              <div className="w-full relative flex items-center justify-center">
                <ArcCarousel progress={progress} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Bottom Continuous Scroll Indicator to Earth ─── */}
      <div className="z-20 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-white/40 animate-pulse">
          <span>Scroll to enter Stage 3: 3D Earth & Flight Corridors</span>
          <ArrowRight className="w-3.5 h-3.5 rotate-90 text-[#10B981]" />
        </div>
      </div>
    </div>
  );
}
