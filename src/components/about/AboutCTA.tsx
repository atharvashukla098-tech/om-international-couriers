"use client";

import React from "react";
import Link from "next/link";
import { 
  Globe2, 
  ArrowRight, 
  Compass, 
  PackageCheck, 
  FileText, 
  Headphones, 
  Sparkles 
} from "lucide-react";

export function AboutCTA() {
  const upcomingModules = [
    {
      title: "Commercial Freight Services",
      desc: "Full aircraft charters, scheduled air cargo, and ocean container line-haul.",
      link: "/#services",
      badge: "ACTIVE",
      badgeColor: "#10B981",
    },
    {
      title: "Direct Doorstep Pickup Request",
      desc: "Schedule doorstep collection across 160+ Mumbai locations in minutes.",
      link: "/dispatch",
      badge: "DISPATCH GLOBE",
      badgeColor: "#10b981",
    },
    {
      title: "Commercial Tariff & Rate Enquiry",
      desc: "Custom corporate rates for high-volume cross-border shippers and ecommerce.",
      link: "mailto:contact@firstflight-demo.com",
      badge: "DEMO DESK",
      badgeColor: "#00F0FF",
    },
  ];

  return (
    <section className="relative py-20 bg-[#030712] overflow-hidden">
      {/* Background illumination */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#10B981]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="text-xs font-mono tracking-widest text-[#10B981] uppercase font-semibold">
                GLOBAL LOGISTICS PLATFORM
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Ready to Expand Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#00F0FF]">
                Global Footprint?
              </span>
            </h2>

            <p className="text-white/70 text-base sm:text-lg font-light leading-relaxed">
              Connect your cargo from Mumbai to 195+ countries with three decades of proven reliability, 
              customs pre-clearance, and guaranteed transit times.
            </p>

            {/* Main Action CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/dispatch"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#10B981] hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-[0_0_30px_rgba(16, 185, 129,0.35)] transition-all hover:scale-105"
              >
                <Compass className="w-4 h-4" />
                <span>Launch 3D Dispatch Globe</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white font-medium text-sm transition-all"
              >
                <span>Return to Scrollytelling Tour</span>
              </Link>
            </div>
          </div>

          {/* Clean Modular Room for Future Pages */}
          <div className="relative z-10 mt-12 pt-8 border-t border-white/10">
            <div className="text-xs font-mono tracking-widest uppercase text-white/40 mb-4">
              Next Portals & Shipping Modules:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingModules.map((mod, i) => (
                <a
                  key={i}
                  href={mod.link}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all group block"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span 
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10"
                      style={{ color: mod.badgeColor }}
                    >
                      {mod.badge}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-white/30 group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-sm font-bold text-white group-hover:text-[#10B981] transition-colors">
                    {mod.title}
                  </div>
                  <div className="text-xs text-white/40 mt-1 font-light font-sans leading-relaxed">
                    {mod.desc}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
