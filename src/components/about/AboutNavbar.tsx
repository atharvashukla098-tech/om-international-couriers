"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Globe2, Menu, X, ArrowUpRight, Compass, ShieldCheck } from "lucide-react";

export function AboutNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#030712]/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/om-logo.png"
            alt="OM International"
            className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="text-white font-extrabold text-base tracking-wider uppercase flex items-center gap-1.5">
              OM International
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
            </span>
            <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase">
              Global Logistics • Mumbai BOM
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-full px-4 py-1.5 shadow-inner">
          <Link
            href="/"
            className="px-4 py-1.5 rounded-full text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="px-4 py-1.5 rounded-full text-xs font-semibold text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20 shadow-[0_0_12px_rgba(16, 185, 129,0.15)] transition-all"
          >
            About Us
          </Link>
          <Link
            href="/dispatch"
            className="px-4 py-1.5 rounded-full text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>Dispatch Globe</span>
            <span className="text-[9px] font-mono bg-[#00F0FF]/20 text-[#00F0FF] px-1.5 py-0.2 rounded-full">
              3D
            </span>
          </Link>
          <Link
            href="/#services"
            className="px-4 py-1.5 rounded-full text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            Services
          </Link>
          <a
            href="#contact"
            className="px-4 py-1.5 rounded-full text-xs font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            Contact
          </a>
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/dispatch"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-white/80 transition-all hover:border-[#00F0FF]/40"
          >
            <Globe2 className="w-4 h-4 text-[#00F0FF]" />
            <span>3D Radar</span>
          </Link>
          <a
            href="https://wa.me/919869042220"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#10B981] hover:bg-emerald-400 text-slate-950 text-xs font-semibold tracking-wide shadow-[0_0_20px_rgba(16, 185, 129,0.25)] transition-all"
          >
            <span>Express Dispatch</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#030712]/95 backdrop-blur-2xl px-6 py-5 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5"
          >
            Home
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/20"
          >
            About Us
          </Link>
          <Link
            href="/dispatch"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5 flex items-center justify-between"
          >
            <span>Dispatch Globe (3D)</span>
            <span className="text-[10px] font-mono bg-[#00F0FF]/20 text-[#00F0FF] px-2 py-0.5 rounded-full">
              INTERACTIVE
            </span>
          </Link>
          <Link
            href="/#services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5"
          >
            Services
          </Link>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5"
          >
            Contact & Locations
          </a>
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <Link
              href="/dispatch"
              className="w-full text-center py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-mono text-white"
            >
              Launch 3D Dispatch
            </Link>
            <a
              href="https://wa.me/919869042220"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-2.5 rounded-xl bg-[#10B981] text-slate-950 text-xs font-semibold"
            >
              WhatsApp Express Desk
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
