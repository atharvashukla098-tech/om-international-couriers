"use client";

import React from "react";
import { 
  Building2, 
  Plane, 
  Globe2, 
  CheckCircle2, 
  MapPin, 
  TrendingUp, 
  Sparkles 
} from "lucide-react";

interface Milestone {
  year: string;
  era: string;
  title: string;
  description: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  highlights: string[];
}

export function MilestoneTimeline() {
  const milestones: Milestone[] = [
    {
      year: "1996",
      era: "FOUNDATIONAL GENESIS",
      title: "Founded in Mumbai",
      description: "First Flight Global was established in Mumbai, starting as an international courier company with a clear vision: to bridge Indian merchants, exporters, and families directly with the world through reliable, personalized dispatch.",
      badge: "Est. Mumbai",
      icon: Building2,
      accentColor: "#10B981",
      highlights: [
        "Headquartered at Mumbai commercial district",
        "Pioneered cross-border document express",
        "Direct Mumbai port & customs coordination",
      ],
    },
    {
      year: "2000s",
      era: "AVIATION EXPANSION",
      title: "Expansion into Air Cargo & Freight Forwarding",
      description: "Recognizing the rapid growth of cross-border trade, First Flight Global expanded operations into heavy commercial air cargo, air charter forwarding, and comprehensive multi-modal logistics solutions for corporate enterprises across India.",
      badge: "Air cargo services launched",
      icon: Plane,
      accentColor: "#00F0FF",
      highlights: [
        "Launched scheduled air freight corridors",
        "Direct consolidation at Sahar Air Cargo Complex",
        "IATA & customs brokerage licensing",
      ],
    },
    {
      year: "2010s",
      era: "GLOBAL LINE-HAUL SCALE",
      title: "Global Network Growth to 195+ Countries",
      description: "Built robust bilateral interline agreements and freight partnerships across 195+ countries. Established an end-to-end international courier pipeline featuring direct door-to-door delivery, customs pre-clearance, and automated milestone telemetry.",
      badge: "195+ countries reached",
      icon: Globe2,
      accentColor: "#38bdf8",
      highlights: [
        "Expanded into 195+ sovereign nations",
        "Next-flight-out express corridors to EU, US & Gulf",
        "Comprehensive cargo insurance & DGR handling",
      ],
    },
    {
      year: "Today",
      era: "NEXT-GEN LOGISTICS PARTNER",
      title: "Trusted Global Multimodal Leader",
      description: "Serving over 500,000+ customers worldwide with reliable, cost-effective multimodal shipping solutions. Operating 160+ express pickup hubs across the Mumbai Metropolitan Region with real-time digital 3D tracking.",
      badge: "500,000+ customers served",
      icon: CheckCircle2,
      accentColor: "#a855f7",
      highlights: [
        "160+ pickup hubs across Mumbai",
        "500,000+ consignments successfully cleared",
        "Next-generation 3D spatial dispatch platform",
      ],
    },
  ];

  return (
    <section id="timeline" className="relative py-24 bg-[#030712] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-[#00F0FF]/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-[#10B981]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
            <span className="text-xs font-mono tracking-widest text-[#10B981] uppercase font-semibold">
              CHRONOLOGICAL HERITAGE
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            The Journey of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#00F0FF]">First Flight Global</span>
          </h2>

          <p className="text-white/60 text-base sm:text-lg">
            From a dedicated courier desk in Mumbai to a multi-modal freight network spanning 195+ countries.
          </p>
        </div>

        {/* Vertical Timeline Structure */}
        <div className="relative">
          {/* Central glowing trunk line (visible on desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-8 bottom-8 -translate-x-1/2 w-0.5 bg-gradient-to-b from-[#10B981] via-[#00F0FF] to-[#a855f7] opacity-40 shadow-[0_0_12px_#00F0FF]" />

          {/* Mobile left trunk line */}
          <div className="lg:hidden absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-[#10B981] via-[#00F0FF] to-[#a855f7] opacity-40" />

          {/* Timeline Nodes */}
          <div className="space-y-12 lg:space-y-20">
            {milestones.map((m, idx) => {
              const Icon = m.icon;
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={idx}
                  className={`relative flex flex-col lg:flex-row items-start lg:items-center ${
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  } gap-8 lg:gap-16`}
                >
                  {/* Content Card */}
                  <div className="w-full lg:w-1/2 pl-16 lg:pl-0">
                    <div className="relative rounded-3xl p-6 sm:p-8 bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-xl shadow-xl group hover:-translate-y-1">
                      {/* Year & Era Header */}
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <span 
                          className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight"
                          style={{ color: m.accentColor }}
                        >
                          {m.year}
                        </span>
                        <span className="text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50">
                          {m.era}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-[#10B981] transition-colors">
                        {m.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm sm:text-base text-white/60 leading-relaxed font-light mb-6">
                        {m.description}
                      </p>

                      {/* Bullet Highlights */}
                      <div className="space-y-2 mb-6 pt-4 border-t border-white/5">
                        {m.highlights.map((h, hIdx) => (
                          <div key={hIdx} className="flex items-center gap-2 text-xs font-mono text-white/70">
                            <span 
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: m.accentColor }}
                            />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>

                      {/* Pill Badge */}
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white/90">
                        <span 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: m.accentColor }}
                        />
                        <span>{m.badge}</span>
                      </div>
                    </div>
                  </div>

                  {/* Central Node Circle */}
                  <div className="absolute left-6 lg:left-1/2 -translate-x-1/2 flex items-center justify-center">
                    <div 
                      className="w-12 h-12 rounded-2xl bg-[#030712] border-2 flex items-center justify-center shadow-2xl transition-transform duration-300 hover:scale-125 z-10"
                      style={{ 
                        borderColor: m.accentColor,
                        boxShadow: `0 0 20px ${m.accentColor}40` 
                      }}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Spacer for opposite side */}
                  <div className="hidden lg:block lg:w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
