"use client";

import React, { useState } from "react";
import { 
  Clock, 
  Zap, 
  BadgePercent, 
  Headphones, 
  ShieldCheck, 
  Globe2, 
  ArrowUpRight 
} from "lucide-react";

interface Pillar {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  tag: string;
  badge: string;
  specs: string[];
}

export function WhyChooseUsGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const pillars: Pillar[] = [
    {
      title: "Trusted Since 1996",
      subtitle: "Three Decades of Unbroken Reliability",
      description: "Over 30 years of proven reliability and regulatory mastery in international courier and logistics services. Established in Mumbai with institutional relationships with global customs authorities, airport freight terminals, and maritime port operators.",
      icon: Clock,
      accentColor: "#10B981",
      tag: "EST. 1996",
      badge: "30+ Years Proven Mastery",
      specs: ["Aviation & Maritime Legacy", "BOM Port Customs License", "Zero Default SLA Record"],
    },
    {
      title: "Fast & Reliable Delivery",
      subtitle: "Guaranteed Express Transit Corridors",
      description: "Priority air transit options with guaranteed delivery schedules, expedited next-flight-out dispatch from Mumbai Chhatrapati Shivaji Maharaj Airport, and real-time digital tracking down to the minute.",
      icon: Zap,
      accentColor: "#00F0FF",
      tag: "SPEED PRIORITY",
      badge: "24-48h Global Corridors",
      specs: ["Next-Flight-Out Charters", "Real-Time AWB Telemetry", "Priority Ramp Handling"],
    },
    {
      title: "Affordable Shipping",
      subtitle: "Competitive Commercial Volume Tariffs",
      description: "Direct airline and shipping line allocations allow us to offer tier-1 corporate rates without ever compromising on security, velocity, or customer care. Transparent invoices with zero hidden fuel surcharges.",
      icon: BadgePercent,
      accentColor: "#10b981",
      tag: "VALUE ADVANTAGE",
      badge: "Zero Hidden Surcharges",
      specs: ["Volume Tiered Discounts", "Direct Carrier Bilateral Rates", "Complete Duty Clarity"],
    },
    {
      title: "Dedicated Support",
      subtitle: "24/7 Named Account Operations",
      description: "Round-the-clock proactive customer logistics desk. Every corporate and individual client receives dedicated account managers and immediate escalation channels for customs clearance and documentation.",
      icon: Headphones,
      accentColor: "#8b5cf6",
      tag: "24/7 OPS DESK",
      badge: "Dedicated Account Execs",
      specs: ["< 5 Min Response Window", "Proactive Exception Alerts", "Customs Brokerage Liaison"],
    },
    {
      title: "Safe & Secure Handling",
      subtitle: "Tamper-Proof Insured Custody",
      description: "Rigid security protocols including barcode tamper-evident packaging, specialized climate-controlled containers, shrink-wrapped cargo skids, and comprehensive end-to-end cargo transit insurance.",
      icon: ShieldCheck,
      accentColor: "#f43f5e",
      tag: "HIGH SECURITY",
      badge: "100% Insured Transit",
      specs: ["Tamper-Evident Seals", "Dangerous Goods (DGR) Certified", "Full Cargo Valuation Insurance"],
    },
    {
      title: "Worldwide Network",
      subtitle: "Coverage Across 195+ Countries",
      description: "Direct shipping routes and trusted logistics partnerships connecting Mumbai's BOM gateway to more than 195+ sovereign nations, covering major economic centers across Europe, Americas, Middle East, and Asia Pacific.",
      icon: Globe2,
      accentColor: "#38bdf8",
      tag: "GLOBAL LINE-HAUL",
      badge: "195+ Sovereign Nations",
      specs: ["160+ Mumbai Drop Points", "Global Door-to-Door Delivery", "IATA / FIATA Partner Alliances"],
    },
  ];

  return (
    <section className="relative py-24 bg-[#030712] border-t border-white/5">
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#10B981]/5 via-[#00F0FF]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
            <span className="text-xs font-mono tracking-widest text-[#00F0FF] uppercase font-semibold">
              CORE OPERATIONAL ADVANTAGES
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Why Choose{" "}
            <span className="text-[#10B981]">First Flight Global</span>
          </h2>

          <p className="text-white/60 text-base sm:text-lg">
            Engineered from Mumbai&apos;s commercial heart to deliver uncompromising velocity, 
            regulatory customs mastery, and seamless global connectivity.
          </p>
        </div>

        {/* 6 High-Tech Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            const isHovered = hoveredIndex === i;

            return (
              <div
                key={i}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative rounded-3xl p-7 bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between group overflow-hidden backdrop-blur-xl shadow-xl hover:-translate-y-1"
                style={{
                  boxShadow: isHovered
                    ? `0 16px 40px -10px ${p.accentColor}25`
                    : "0 10px 30px rgba(0,0,0,0.4)",
                }}
              >
                {/* Accent glow corner */}
                <div
                  className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl opacity-20 transition-opacity duration-300 group-hover:opacity-60"
                  style={{ backgroundColor: p.accentColor }}
                />

                <div>
                  {/* Card Header: Icon & Tag */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 group-hover:scale-110 transition-transform duration-300"
                      style={{ color: p.accentColor }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/60">
                      {p.tag}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-xl font-bold text-white group-hover:text-[#10B981] transition-colors">
                    {p.title}
                  </h3>
                  <div className="text-xs font-mono text-[#00F0FF] mt-1 mb-3">
                    {p.subtitle}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-white/60 leading-relaxed font-light font-sans mb-6">
                    {p.description}
                  </p>
                </div>

                {/* Specs List & Badge Footer */}
                <div className="pt-4 border-t border-white/5 space-y-3">
                  <div className="space-y-1.5">
                    {p.specs.map((spec, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2 text-xs font-mono text-white/50">
                        <span 
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: p.accentColor }}
                        />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span 
                      className="text-xs font-mono px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80"
                      style={{ borderColor: isHovered ? `${p.accentColor}50` : undefined }}
                    >
                      {p.badge}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
