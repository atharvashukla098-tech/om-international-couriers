"use client";

import React from "react";
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare, 
  ShieldCheck, 
  ExternalLink, 
  Navigation, 
  Anchor, 
  Plane 
} from "lucide-react";

export function MumbaiGatewaySection() {
  const hubs = [
    {
      name: "Corporate Headquarters",
      location: "Air Cargo Complex, Mumbai",
      details: "Demo Terminal 2, Air Cargo Complex, Sahar, Mumbai - 400099, India",
      icon: MapPin,
      badge: "Est. 1996 Genesis",
      accent: "#10B981",
    },
    {
      name: "Aviation Cargo Terminal",
      location: "Sahar Air Cargo Complex, BOM Airport",
      details: "Direct airside customs clearance & next-flight-out scheduled line-haul transfers.",
      icon: Plane,
      badge: "24/7 Ramp Ops",
      accent: "#00F0FF",
    },
    {
      name: "Maritime Container Hub",
      location: "JNPT Nhava Sheva Port Corridor",
      details: "Full container (FCL) and consolidated (LCL) freight staging with dry port bonded customs.",
      icon: Anchor,
      badge: "Ocean Port Gateway",
      accent: "#38bdf8",
    },
    {
      name: "Metropolitan Express Network",
      location: "160+ Pickup Hubs Across Mumbai",
      details: "Comprehensive coverage across South Mumbai, Western Suburbs, Central Mumbai & Thane.",
      icon: Navigation,
      badge: "Same-Day Collection",
      accent: "#a855f7",
    },
  ];

  return (
    <section id="contact" className="relative py-24 bg-[#060E1E] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Mumbai Anchors */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10">
              <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="text-xs font-mono tracking-widest text-[#10B981] uppercase font-semibold">
                BOM GATEWAY INFRASTRUCTURE
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Rooted in Mumbai, Connecting the{" "}
              <span className="text-[#00F0FF]">Entire Globe</span>
            </h2>

            <p className="text-white/70 text-base sm:text-lg font-light leading-relaxed">
              Mumbai is India&apos;s commercial capital and primary maritime-aviation nexus. From our foundational hubs 
              in <strong className="text-white font-medium">Mumbai</strong> to our air cargo operations at BOM Airport 
              and container freight stations at JNPT, First Flight Global provides an unassailable gateway for international trade.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {hubs.map((hub, idx) => {
                const Icon = hub.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all backdrop-blur-xl"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="w-5 h-5" style={{ color: hub.accent }} />
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-white/5 text-white/50">
                        {hub.badge}
                      </span>
                    </div>
                    <div className="font-bold text-white text-sm">
                      {hub.name}
                    </div>
                    <div className="text-xs text-[#00F0FF] font-mono mt-0.5 mb-2">
                      {hub.location}
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed font-light">
                      {hub.details}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Direct Corporate Dispatch Card */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 backdrop-blur-2xl shadow-2xl">
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#10B981]">
                    Direct Support & Enquiries
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    Corporate Operations Desk
                  </h3>
                </div>
                <div className="w-3 h-3 rounded-full bg-[#10b981] shadow-[0_0_12px_#10b981] animate-pulse" />
              </div>

              <div className="space-y-4 mb-8">
                <a
                  href="tel:+912255550199"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/20 transition-colors group"
                >
                  <div className="p-3 rounded-xl bg-white/5 text-[#00F0FF] group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-white/40 uppercase">Direct Helpline</div>
                    <div className="text-sm sm:text-base font-mono font-bold text-white">
                      +91 22 5555 0199 / +91 98000 00000
                    </div>
                  </div>
                </a>

                <button
                  type="button"
                  onClick={() => alert("First Flight Global demo WhatsApp assistance: connect with our round-the-clock digital operations desk at contact@firstflight-demo.com.")}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/20 transition-colors group text-left cursor-pointer"
                >
                  <div className="p-3 rounded-xl bg-white/5 text-[#25D366] group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-white/40 uppercase">WhatsApp Instant Support</div>
                    <div className="text-sm sm:text-base font-mono font-bold text-white">
                      +91 98000 00000 (Demo Desk)
                    </div>
                  </div>
                </button>

                <a
                  href="mailto:contact@firstflight-demo.com"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/20 transition-colors group"
                >
                  <div className="p-3 rounded-xl bg-white/5 text-[#10B981] group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-white/40 uppercase">Corporate Email</div>
                    <div className="text-sm sm:text-base font-mono font-bold text-white">
                      contact@firstflight-demo.com
                    </div>
                  </div>
                </a>
              </div>

              {/* Franchise / Admin Link */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-white/40 font-mono">
                  Franchise & Partner Portal
                </span>
                <button
                  type="button"
                  onClick={() => alert("First Flight Global Partner Portal is currently in demonstration mode.")}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[#10B981] hover:underline cursor-pointer"
                >
                  <span>demo-portal.firstflight.internal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
