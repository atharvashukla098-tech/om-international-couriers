"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { 
  Building2, 
  Clock, 
  Globe, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Plane, 
  Ship, 
  Truck 
} from "lucide-react";

export function AboutHero() {
  const metrics = [
    {
      value: "1996",
      label: "Established Year",
      sub: "Mumbai Genesis",
      icon: Building2,
      accent: "#10B981",
    },
    {
      value: "30+",
      label: "Years of Heritage",
      sub: "Unbroken Aviation & Freight Legacy",
      icon: Clock,
      accent: "#00F0FF",
    },
    {
      value: "195+",
      label: "Countries Reached",
      sub: "Direct Global Line-Haul Corridors",
      icon: Globe,
      accent: "#38bdf8",
    },
    {
      value: "160+",
      label: "Mumbai Pickup Hubs",
      sub: "BOM Metropolitan Network",
      icon: MapPin,
      accent: "#a855f7",
    },
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#00F0FF]/10 via-[#10B981]/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-mono text-white/40 mb-6">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-white/60">Company</span>
          <span>/</span>
          <span className="text-[#10B981]">About Us</span>
        </div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] animate-pulse" />
              <span className="text-xs font-mono tracking-widest text-[#10B981] uppercase font-semibold">
                WHO WE ARE • EST. 1996
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Delivering Trust Across the Globe{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] via-[#00F0FF] to-white">
                Since 1996
              </span>
            </h1>

            <div className="space-y-4 text-white/70 text-base sm:text-lg leading-relaxed font-sans font-light">
              <p>
                <strong className="text-white font-medium">First Flight Global Express</strong> is 
                Mumbai&apos;s premier cross-border freight forwarding, air express, and international logistics corporation 
                established in <span className="text-white font-medium">Mumbai</span> in 1996. Over three decades of 
                rigorous field experience have solidified our standing as a cornerstone partner for global commerce.
              </p>
              <p className="text-white/60 text-sm sm:text-base">
                From urgent high-priority legal documents to heavy commercial freight, aircraft charters, and ocean container consignments, 
                we manage every shipment with surgical care. Our worldwide line-haul operations span over <span className="text-[#00F0FF] font-medium">195+ sovereign nations</span>, 
                connecting Indian enterprise to international markets with guaranteed chain-of-custody security.
              </p>
            </div>

            {/* Quick Action CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/dispatch"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#10B981] hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-[0_0_25px_rgba(16, 185, 129,0.3)] transition-all hover:scale-105"
              >
                <span>Interactive Dispatch Globe</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#timeline"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white font-medium text-sm transition-all"
              >
                <span>Explore 30-Year Heritage</span>
              </a>
            </div>
          </div>

          {/* Right Column: Visual Multimodal Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.01] p-6 sm:p-8 backdrop-blur-2xl shadow-2xl group">
              {/* Background Hangar / Aircraft Image with Gradient Scrim */}
              <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden mb-6 border border-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hangar-hero.jpg"
                  alt="First Flight Global Air Cargo Hub"
                  className="w-full h-full object-cover object-center filter brightness-90 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-90" />
                
                {/* Floating telemetry pills */}
                <div className="absolute top-4 left-4 backdrop-blur-md bg-slate-950/80 border border-white/10 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping" />
                  <span className="text-xs font-mono text-white font-semibold">195+ Countries Connected</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-white/80 backdrop-blur-md bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2">
                  <span className="flex items-center gap-1.5 text-[#10B981]">
                    <ShieldCheck className="w-4 h-4" />
                    Customs Pre-Cleared
                  </span>
                  <span className="text-white/50">BOM Gateway</span>
                </div>
              </div>

              {/* Multimodal Tri-Pillar Indicators */}
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#00F0FF]/30 transition-colors">
                  <Plane className="w-5 h-5 text-[#00F0FF] mb-1.5" />
                  <span className="text-xs font-bold text-white">Air Cargo</span>
                  <span className="text-[10px] text-white/40 font-mono mt-0.5">24-48h Express</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#38bdf8]/30 transition-colors">
                  <Ship className="w-5 h-5 text-[#38bdf8] mb-1.5" />
                  <span className="text-xs font-bold text-white">Ocean Freight</span>
                  <span className="text-[10px] text-white/40 font-mono mt-0.5">FCL / LCL Ports</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#10B981]/30 transition-colors">
                  <Truck className="w-5 h-5 text-[#10B981] mb-1.5" />
                  <span className="text-xs font-bold text-white">Mumbai Surface</span>
                  <span className="text-[10px] text-white/40 font-mono mt-0.5">160+ Local Hubs</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Stat Telemetry Counter Cards */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {metrics.map((m, i) => {
            const Icon = m.icon;
            return (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/10 p-5 sm:p-6 backdrop-blur-xl hover:border-white/20 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight group-hover:text-[#10B981] transition-colors">
                    {m.value}
                  </span>
                  <div 
                    className="p-2 rounded-xl bg-white/5 border border-white/10"
                    style={{ color: m.accent }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-sm font-semibold text-white/90">
                  {m.label}
                </div>
                <div className="text-xs text-white/40 font-mono mt-1">
                  {m.sub}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
