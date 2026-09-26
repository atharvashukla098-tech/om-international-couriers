"use client";

import React from 'react';
import Link from 'next/link';
import { Radar, PackageSearch, Phone, ShieldCheck, Sparkles } from 'lucide-react';

export default function ExecutiveTopNavbar() {
  const triggerDrawer = (mode: 'track' | 'pickup' | 'enquiry') => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('om-open-drawer', { detail: mode }));
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 pointer-events-none transition-all duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <Link 
          href="/" 
          className="pointer-events-auto flex items-center gap-2 sm:gap-2.5 backdrop-blur-none sm:backdrop-blur-xl bg-slate-950/95 sm:bg-slate-950/80 border border-white/10 hover:border-white/20 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full shadow-2xl transition-all group shrink-0"
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-xs shadow-[0_0_12px_rgba(16,185,129,0.4)]">
            OM
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs sm:text-sm font-extrabold tracking-tight text-white group-hover:text-emerald-300 transition-colors font-sans">
              <span className="hidden sm:inline">OM INTERNATIONAL</span>
              <span className="sm:hidden">OM INTL</span>
            </span>
            <span className="text-[8px] sm:text-[9px] font-mono text-white/50 tracking-wider hidden xs:flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
              EST. 1996 • MUMBAI HQ
            </span>
          </div>
        </Link>

        {/* Center: Quick Links (desktop) */}
        <nav className="pointer-events-auto hidden md:flex items-center gap-1.5 backdrop-blur-xl bg-slate-950/70 border border-white/10 px-3 py-1.5 rounded-full shadow-2xl text-xs font-medium text-white/70">
          <Link 
            href="/about" 
            className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>About & Heritage</span>
          </Link>
          <Link 
            href="/dispatch" 
            className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>3D Dispatch Hub</span>
          </Link>
          <button 
            type="button"
            onClick={() => triggerDrawer('enquiry')}
            className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 text-white/50" />
            <span>24/7 Operations</span>
          </button>
        </nav>

        {/* Right: Prominent User Actions (Track Order & Schedule Pickup) */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* TRACK ORDER: Highly Visible Telemetry Action */}
          <button
            type="button"
            onClick={() => triggerDrawer('track')}
            className="group relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-950/95 sm:bg-slate-950/90 hover:bg-slate-900 backdrop-blur-none sm:backdrop-blur-xl border border-cyan-400/50 hover:border-cyan-300 text-white shadow-[0_0_18px_rgba(0,240,255,0.25)] hover:shadow-[0_0_24px_rgba(0,240,255,0.4)] transition-all duration-300 cursor-pointer"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <Radar className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-45 transition-transform duration-300" />
            <span className="font-semibold text-xs sm:text-sm tracking-tight text-white">
              <span className="hidden sm:inline">Track Order</span>
              <span className="sm:hidden">Track</span>
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 hidden md:inline-block">
              AWB
            </span>
          </button>

          {/* SCHEDULE PICKUP: High-Impact Executive Action */}
          <button
            type="button"
            onClick={() => triggerDrawer('pickup')}
            className="group relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_28px_rgba(16,185,129,0.5)] transition-all duration-300 cursor-pointer"
          >
            <PackageSearch className="w-3.5 h-3.5 text-slate-950 group-hover:scale-110 transition-transform duration-300" />
            <span className="tracking-tight">
              <span className="hidden sm:inline">Schedule Pickup</span>
              <span className="sm:hidden">Pickup</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
