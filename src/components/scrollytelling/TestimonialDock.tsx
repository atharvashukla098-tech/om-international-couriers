"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import {
  Quote,
  Star,
  ShieldCheck,
  Plane,
  Ship,
  Globe2,
  Phone,
  Mail,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  corridor: string;
  mode: "air" | "ocean" | "express";
  text: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Sarah Jenkins",
    role: "Head of International Logistics",
    company: "Apex Global Retail UK",
    location: "London, UK",
    corridor: "LHR ➔ BOM Air Express",
    mode: "air",
    rating: 5,
    text: "OM International has handled our time-critical London-to-Mumbai air freight for over 6 years. Customs clearance at BOM is consistently completed in under 4 hours, and their live airway telemetry gives our board total visibility.",
  },
  {
    id: "t2",
    name: "Tariq Al-Mansoor",
    role: "Supply Chain Director",
    company: "Gulf Maritime Solutions",
    location: "Dubai / JAFZA, UAE",
    corridor: "DXB ➔ BOM Sea-Air Gateway",
    mode: "ocean",
    rating: 5,
    text: "When marine replacement parts require emergency dispatch from Nhava Sheva to Jebel Ali, OM International never misses a flight or vessel connection. Their 24/7 Mumbai operations desk delivers unmatched precision.",
  },
  {
    id: "t3",
    name: "Amitabh Singhania",
    role: "VP of Global Supply Chain",
    company: "Bharat Precision Textiles",
    location: "Mumbai, India",
    corridor: "BOM ➔ JFK Commercial Express",
    mode: "express",
    rating: 5,
    text: "Exporting high-value commercial consignments to New York requires zero-error documentation. OM's EDI customs pre-clearance and multi-hub tracking have eliminated transit delays entirely across our US distributor network.",
  },
];

const METRICS = [
  { value: "28+", label: "Years Legacy", sub: "Est. 1996 Mumbai" },
  { value: "220+", label: "Global Corridors", sub: "Air & Sea Gateways" },
  { value: "99.4%", label: "On-Time Clearance", sub: "EDI Customs Brokerage" },
  { value: "1M+", label: "Consignments", sub: "Delivered Worldwide" },
];

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
  active?: boolean;
}

function TestimonialCard({ testimonial, index, active = true }: TestimonialCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 280, damping: 26 });
  const mouseYSpring = useSpring(y, { stiffness: 280, damping: 26 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !active) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      style={{
        rotateX: active ? rotateX : 0,
        rotateY: active ? rotateY : 0,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className="relative flex-1 min-w-[270px] max-w-sm rounded-2xl sm:rounded-3xl bg-slate-950/90 border border-white/10 p-4 sm:p-5 lg:p-6 flex flex-col justify-between group cursor-default shadow-[0_20px_60px_rgba(0,0,0,0.75)] hover:border-[#10B981]/40 transition-colors duration-300"
    >
      {/* Subtle ambient hover glow */}
      <div
        className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#10B981]/10 via-transparent to-[#00F0FF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ transform: "translateZ(1px)" }}
      />

      <div>
        {/* Corridor Pill & 5-Star Rating Row */}
        <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-white/[0.08]">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-mono text-white/80">
            {testimonial.mode === "air" && <Plane className="w-3 h-3 text-[#00F0FF]" />}
            {testimonial.mode === "ocean" && <Ship className="w-3 h-3 text-[#00F0FF]" />}
            {testimonial.mode === "express" && <Globe2 className="w-3 h-3 text-[#10B981]" />}
            <span className="truncate">{testimonial.corridor}</span>
          </div>

          <div className="flex items-center gap-0.5 text-[#10B981]">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-[#10B981]" />
            ))}
          </div>
        </div>

        {/* Quote Content */}
        <div className="relative">
          <Quote className="w-5 h-5 text-[#00F0FF] opacity-40 mb-1.5" />
          <p className="text-gray-200 text-xs sm:text-[13px] leading-relaxed font-normal">
            &ldquo;{testimonial.text}&rdquo;
          </p>
        </div>
      </div>

      {/* Author Details Footer */}
      <div className="mt-3.5 pt-3 border-t border-white/[0.08]">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-bold text-xs sm:text-sm tracking-tight flex items-center gap-1">
              <span>{testimonial.name}</span>
              <ShieldCheck className="w-3 h-3 text-[#10B981]" />
            </h4>
            <p className="text-[11px] text-white/50">{testimonial.role}</p>
            <p className="text-[#00F0FF] text-[11px] font-mono font-medium mt-0.5">
              {testimonial.company}
            </p>
          </div>
          <span className="text-[10px] font-mono text-white/40 text-right">
            {testimonial.location}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function TestimonialDock({ active = true }: { active?: boolean }) {
  const [mobileIndex, setMobileIndex] = useState(0);

  const nextTestimonial = () => {
    setMobileIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setMobileIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="w-full h-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-between py-4 sm:py-6 lg:py-8 pb-36 sm:pb-8 overflow-y-auto md:overflow-visible">
      
      {/* ═══ 1. Section Header & Vibe Alignment ═══ */}
      <div className="flex flex-col items-center text-center shrink-0">
        {/* Top Verification Pill */}
        <div className="mb-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-white/10 backdrop-blur-xl shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] animate-pulse" />
          <span className="text-[10px] sm:text-[11px] font-mono font-semibold tracking-wider text-[#10B981] uppercase">
            Verified Enterprise Endorsements • Global Network
          </span>
        </div>

        {/* Main Heading */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white tracking-tight drop-shadow-lg">
          Global Trust & <span className="text-[#10B981]">Logistics Precision</span>
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-white/60 max-w-2xl mt-1 font-normal leading-relaxed px-2">
          Trusted by 5,000+ cross-border exporters, aerospace contractors, and freight forwarders across Mumbai, London, Dubai, and New York.
        </p>
      </div>

      {/* ═══ 2. Testimonial Cards Layout ═══ */}
      {/* Desktop / Tablet View: Side-by-Side 3D Tilt Cards */}
      <div className="hidden md:flex justify-center items-stretch gap-4 lg:gap-6 my-3 lg:my-5 [perspective:1000px] shrink-0">
        {testimonials.map((t, i) => (
          <TestimonialCard key={t.id} testimonial={t} index={i} active={active} />
        ))}
      </div>

      {/* Mobile View: Swipeable / Clickable Card View (Prevents vertical clipping) */}
      <div className="flex md:hidden flex-col items-center my-2 w-full max-w-sm mx-auto shrink-0">
        <div className="w-full">
          <TestimonialCard
            key={testimonials[mobileIndex].id}
            testimonial={testimonials[mobileIndex]}
            index={mobileIndex}
            active={active}
          />
        </div>

        {/* Mobile Navigation Controls */}
        <div className="flex items-center justify-between w-full px-2 mt-2.5 text-xs font-mono">
          <button
            type="button"
            onClick={prevTestimonial}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-white/70 hover:text-white cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setMobileIndex(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  mobileIndex === i
                    ? "w-5 bg-[#10B981] shadow-[0_0_8px_#10B981]"
                    : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={nextTestimonial}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-white/70 hover:text-white cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ═══ 3. Live Telemetry Metrics Strip ═══ */}
      <div className="w-full max-w-5xl mx-auto rounded-2xl bg-white/[0.02] border border-white/[0.08] p-2.5 sm:p-3.5 my-1.5 sm:my-2.5 shrink-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
          {METRICS.map((m, idx) => (
            <div key={idx} className={`flex flex-col items-center text-center ${idx > 0 ? "pt-1.5 md:pt-0" : ""}`}>
              <span className="text-base sm:text-xl lg:text-2xl font-extrabold font-mono text-white tracking-tight">
                {m.value}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-white/80">
                {m.label}
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono text-white/40">
                {m.sub}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ 4. Operations Hotline & Corporate Footer Strip (with Desktop Right-Padding to avoid drawer collision) ═══ */}
      <div className="w-full max-w-5xl mx-auto pt-2 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-white/45 font-mono shrink-0 md:pr-72 lg:pr-80">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1">
          <a
            href="tel:+919820729615"
            className="flex items-center gap-1 hover:text-[#10B981] transition-colors"
          >
            <Phone className="w-3 h-3 text-[#10B981]" />
            <span>Air Cargo Ops: +91 9820729615</span>
          </a>
          <span className="hidden sm:inline text-white/20">•</span>
          <a
            href="mailto:cs.omcourierservices@gmail.com"
            className="flex items-center gap-1 hover:text-[#00F0FF] transition-colors"
          >
            <Mail className="w-3 h-3 text-[#00F0FF]" />
            <span>cs.omcourierservices@gmail.com</span>
          </a>
          <span className="hidden lg:inline text-white/20">•</span>
          <span className="hidden lg:flex items-center gap-1 text-white/35">
            <MapPin className="w-3 h-3" />
            <span>Karel Wadi, Thakurdwar, Mumbai 400002</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/30">
            © 1996–2026 OM International
          </span>
          <span className="text-white/20">•</span>
          <a
            href="https://admin.omcourier.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1 text-[10px] text-[#10B981]"
          >
            <span>Partner EDI Portal</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default React.memo(TestimonialDock);
