"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#030712]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Column 1 */}
          <div>
            <h3 className="text-xl font-bold text-white mb-2">First Flight Global</h3>
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
              Demo Terminal 2, Air Cargo Complex, Sahar, Mumbai - 400099, India
            </p>
            <div className="flex flex-col gap-1 text-xs font-mono text-white/60 mt-1">
              <a href="tel:+912255550199" className="hover:text-[#00F0FF] transition-colors">
                Tel: +91 22 5555 0199 / +91 98000 00000
              </a>
              <span className="text-white/60">
                WhatsApp: +91 98000 00000 (Demo)
              </span>
              <a href="mailto:contact@firstflight-demo.com" className="hover:text-white transition-colors truncate">
                contact@firstflight-demo.com
              </a>
            </div>
            <a 
              href="#login" 
              onClick={(e) => { e.preventDefault(); alert("First Flight Global Partner Portal is currently in demonstration mode."); }}
              className="text-[11px] font-mono text-white/30 hover:text-white/70 transition-colors pt-2 border-t border-white/5"
            >
              Partner & Franchise Login →
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/[0.06] gap-4">
          <p className="text-xs text-white/20 text-center md:text-left">
            © 2026 First Flight Global Express. All rights reserved.
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
