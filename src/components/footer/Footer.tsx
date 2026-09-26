"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#030712]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Column 1 */}
          <div>
            <h3 className="text-xl font-bold text-white mb-2">OM International</h3>
            <p className="text-sm text-white/40">Mumbai&apos;s Premier Courier & Cargo Services</p>
            <p className="text-sm text-white/40 mt-1">Established 1996</p>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white mb-2">Quick Links</h4>
            <Link href="/" className="text-sm text-white/40 hover:text-white transition-colors">
              Services & Overview
            </Link>
            <Link href="/about" className="text-sm text-white/60 hover:text-[#10B981] transition-colors flex items-center gap-1.5">
              <span>About Us</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-white/50 font-mono">1996</span>
            </Link>
            <Link href="/dispatch" className="text-sm text-[#10B981] hover:underline transition-colors flex items-center gap-1.5 font-medium">
              <span>3D Dispatch Globe</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#10B981]/20 text-[#10B981] font-mono">NEW</span>
            </Link>
            <Link href="#tracking" className="text-sm text-white/40 hover:text-white transition-colors">
              Track Shipment
            </Link>
            <Link href="/dispatch" className="text-sm text-white/40 hover:text-white transition-colors">
              Global Geocoding
            </Link>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold text-white mb-2">Corporate Office</h4>
            <p className="text-xs text-white/50 leading-relaxed">
              51, Suraj Bhavan, Ground Floor, Karel Wadi, Thakurdwar, Mumbai - 400002, Maharashtra, India
            </p>
            <div className="flex flex-col gap-1 text-xs font-mono text-white/60 mt-1">
              <a href="tel:+919820729615" className="hover:text-[#00F0FF] transition-colors">
                Tel: +91 9820729615 / 022 2386 0032
              </a>
              <a href="https://wa.me/919869042220" target="_blank" rel="noopener noreferrer" className="hover:text-[#10B981] transition-colors">
                WhatsApp: +91 9869042220
              </a>
              <a href="mailto:cs.omcourierservices@gmail.com" className="hover:text-white transition-colors truncate">
                cs.omcourierservices@gmail.com
              </a>
            </div>
            <a 
              href="https://admin.omcourier.in/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[11px] font-mono text-white/30 hover:text-white/70 transition-colors pt-2 border-t border-white/5"
            >
              Partner & Franchise Login →
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/[0.06] gap-4">
          <p className="text-xs text-white/20 text-center md:text-left">
            © 2024 OM International Courier Cargo Services. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-xs text-white/20 hover:text-white transition-colors">
              LinkedIn
            </Link>
            <Link href="#" className="text-xs text-white/20 hover:text-white transition-colors">
              Twitter
            </Link>
            <Link href="#" className="text-xs text-white/20 hover:text-white transition-colors">
              Facebook
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
