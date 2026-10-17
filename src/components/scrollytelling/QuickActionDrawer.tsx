"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Send, 
  PackageSearch, 
  MessageSquareText, 
  Calculator, 
  Radar, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Loader2, 
  Calendar, 
  Truck,
  AlertCircle
} from 'lucide-react';
import { queryTracking, type TrackingResult, type TrackingSearchType } from '@/lib/tracking-api';

type DrawerMode = 'track' | 'pickup' | 'enquiry' | null;

export default function QuickActionDrawer() {
  const [activeDrawer, setActiveDrawer] = useState<DrawerMode>(null);
  const [mounted, setMounted] = useState(false);
  
  // Tracking Drawer State
  const [trackingNumber, setTrackingNumber] = useState('');
  const [searchType, setSearchType] = useState<TrackingSearchType>('tracking_no');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(null);

  // Calculator state
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [volumetricWeight, setVolumetricWeight] = useState<number>(0);

  // Enquiry form state with sanitization
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [enquiryMsg, setEnquiryMsg] = useState('');
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    const handler = (e: Event) => {
      const custom = e as CustomEvent<DrawerMode>;
      if (custom.detail) {
        setActiveDrawer(custom.detail);
      }
    };
    window.addEventListener('om-open-drawer', handler);
    return () => window.removeEventListener('om-open-drawer', handler);
  }, []);

  useEffect(() => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const h = parseFloat(height) || 0;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVolumetricWeight((l * w * h) / 5000);
  }, [length, width, height]);

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!trackingNumber.trim()) return;
    setTrackingLoading(true);
    try {
      const res = await queryTracking(trackingNumber, searchType);
      setTrackingResult(res);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unable to connect to tracking servers.';
      setTrackingResult({
        success: false,
        trackingNo: trackingNumber,
        status: 'Error',
        events: [],
        error: errorMsg,
      });
    } finally {
      setTrackingLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* Floating Action Bar */}
      <div className="fixed bottom-3 sm:bottom-6 right-2.5 sm:right-6 z-50 flex items-center justify-end gap-1.5 sm:gap-2.5 max-w-full">
        {/* Track Order: High Visibility Telemetry Action */}
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setActiveDrawer('track')}
          className="group relative flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-5 py-2 sm:py-3 rounded-full bg-slate-950/95 sm:bg-slate-950/90 backdrop-blur-none sm:backdrop-blur-2xl border border-cyan-400/50 hover:border-cyan-300 text-white shadow-[0_0_20px_rgba(0,240,255,0.22)] hover:shadow-[0_0_28px_rgba(0,240,255,0.4)] transition-all duration-300 cursor-pointer"
        >
          <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-cyan-400"></span>
          </span>
          <Radar className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-cyan-400 group-hover:rotate-45 transition-transform duration-300" />
          <span className="font-semibold text-xs sm:text-sm tracking-normal text-white drop-shadow-sm font-sans">
            <span className="hidden sm:inline">Track Order</span>
            <span className="sm:hidden">Track</span>
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 hidden md:inline-block">
            AWB
          </span>
        </motion.button>

        {/* Schedule Pickup: High Visibility Executive Action */}
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setActiveDrawer('pickup')}
          className="group relative flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-5 py-2 sm:py-3 rounded-full bg-slate-950/95 sm:bg-slate-950/90 backdrop-blur-none sm:backdrop-blur-2xl border border-emerald-400/60 hover:border-emerald-300 text-white shadow-[0_0_20px_rgba(16,185,129,0.22)] hover:shadow-[0_0_28px_rgba(16,185,129,0.4)] transition-all duration-300 cursor-pointer"
        >
          <PackageSearch className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />
          <span className="font-semibold text-xs sm:text-sm tracking-normal text-white drop-shadow-sm font-sans">
            <span className="hidden sm:inline">Schedule Pickup</span>
            <span className="sm:hidden">Pickup</span>
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 hidden md:inline-block">
            MUMBAI
          </span>
        </motion.button>

        {/* Contact & Desk: Secondary Subtle Action */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setActiveDrawer('enquiry')}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-3 rounded-full bg-slate-950/95 sm:bg-slate-950/80 backdrop-blur-none sm:backdrop-blur-xl border border-white/15 hover:border-white/30 text-white/80 hover:text-white shadow-lg transition-all duration-300 cursor-pointer"
        >
          <MessageSquareText className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-white/60" />
          <span className="font-medium text-xs sm:text-sm tracking-normal text-white/80">
            <span className="hidden sm:inline">Contact & Desk</span>
            <span className="sm:hidden">Desk</span>
          </span>
        </motion.button>
      </div>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {activeDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDrawer(null)}
              className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="fixed bottom-0 right-0 md:right-6 md:bottom-24 z-[70] w-full md:w-[480px] max-h-[88vh] overflow-y-auto bg-[#030712]/95 backdrop-blur-[24px] border border-white/10 rounded-t-3xl md:rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col"
            >
              {/* Drawer Top Header */}
              <div className="sticky top-0 p-5 md:p-6 border-b border-white/[0.08] flex items-center justify-between bg-[#030712]/90 backdrop-blur-md z-10">
                <h3 className="text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
                  {activeDrawer === 'track' && (
                    <><Radar className="w-5 h-5 text-[#00F0FF]" /> Live Telemetry Console</>
                  )}
                  {activeDrawer === 'pickup' && (
                    <><PackageSearch className="w-5 h-5 text-[#10B981]" /> Schedule Consignment Pickup</>
                  )}
                  {activeDrawer === 'enquiry' && (
                    <><MessageSquareText className="w-5 h-5 text-white" /> Mumbai Operations Hub</>
                  )}
                </h3>
                <button 
                  onClick={() => setActiveDrawer(null)}
                  className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* ═══ DRAWER CONTENT: TRACK ═══ */}
              {activeDrawer === 'track' && (
                <div className="p-6 flex flex-col gap-5">
                  {/* Search Type Selector */}
                  <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/[0.06] text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setSearchType('tracking_no')}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all ${
                        searchType === 'tracking_no' ? 'bg-[#00F0FF]/20 text-[#00F0FF] font-semibold' : 'text-white/40 hover:text-white'
                      }`}
                    >
                      AWB No.
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchType('forwarding_no1')}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all ${
                        searchType === 'forwarding_no1' ? 'bg-[#00F0FF]/20 text-[#00F0FF] font-semibold' : 'text-white/40 hover:text-white'
                      }`}
                    >
                      Forwarding
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchType('reference_no')}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all ${
                        searchType === 'reference_no' ? 'bg-[#00F0FF]/20 text-[#00F0FF] font-semibold' : 'text-white/40 hover:text-white'
                      }`}
                    >
                      Reference
                    </button>
                  </div>

                  <form onSubmit={handleTrack} className="flex flex-col gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                        Enter Consignment Number
                      </label>
                      <input 
                        type="text" 
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="e.g. OM-8921-IN or your docket no."
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#00F0FF]/60 focus:bg-white/[0.06] transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={trackingLoading}
                      className="w-full py-3.5 rounded-xl bg-[#00F0FF] hover:bg-[#00F0FF]/90 text-slate-950 font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                    >
                      {trackingLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                          <span>Checking Official System...</span>
                        </>
                      ) : (
                        <>
                          <Radar className="w-4 h-4" />
                          <span>Track Docket</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Tracking Result View */}
                  {trackingResult && (
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-4">
                      {trackingResult.success ? (
                        <>
                          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
                              <span className="font-bold text-white">{trackingResult.status}</span>
                            </div>
                            <span className="text-xs font-mono text-white/50">{trackingResult.trackingNo}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                            {trackingResult.destination && (
                              <div className="col-span-2 text-white/80 flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-[#00F0FF]" />
                                <span>{trackingResult.destination}</span>
                              </div>
                            )}
                            {trackingResult.consignee && (
                              <div className="col-span-2 text-white/60">
                                Consignee: <span className="text-white font-semibold">{trackingResult.consignee}</span>
                              </div>
                            )}
                            {trackingResult.bookedDate && (
                              <div className="text-white/50 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {trackingResult.bookedDate.split(' ')[0]}
                              </div>
                            )}
                            {trackingResult.pieces && (
                              <div className="text-white/50 text-right">
                                {trackingResult.pieces}
                              </div>
                            )}
                          </div>

                          {/* Events */}
                          {trackingResult.events && trackingResult.events.length > 0 && (
                            <div className="pt-2 border-t border-white/[0.06] space-y-2">
                              <span className="text-[10px] uppercase font-mono tracking-wider text-white/40 flex items-center gap-1">
                                <Truck className="w-3 h-3 text-[#10B981]" /> Latest Milestones
                              </span>
                              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                {trackingResult.events.slice(0, 3).map((ev, idx) => (
                                  <div key={idx} className="text-xs border-l-2 border-[#00F0FF]/40 pl-2.5 py-0.5 space-y-0.5">
                                    <div className="text-white font-medium">{ev.event_description}</div>
                                    <div className="text-[10px] font-mono text-white/50 flex justify-between">
                                      <span>{ev.event_location}</span>
                                      <span>{ev.event_at}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="p-3 text-xs text-red-300 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-white">Not Found</p>
                            <p className="text-white/60 mt-0.5">{trackingResult.error}</p>
                            <p className="mt-2 text-[10px] font-mono text-[#10B981]">
                              Tip: Enter &quot;OM-8921-IN&quot; to test simulated response.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ═══ DRAWER CONTENT: PICKUP ═══ */}
              {activeDrawer === 'pickup' && (
                <div className="p-6 flex flex-col gap-6">
                  <div className="flex flex-col gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Pickup Origin</label>
                      <input 
                        type="text" 
                        defaultValue="Mumbai Metropolitan Region (BOM)"
                        className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#10B981]/50 transition-colors text-sm"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Destination Country / City</label>
                      <select className="w-full bg-[#060E1E] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#10B981]/50 transition-colors appearance-none text-sm">
                        <option value="us">United States (JFK / LAX / ORD)</option>
                        <option value="uk">United Kingdom (London LHR)</option>
                        <option value="uae">United Arab Emirates (Dubai DXB)</option>
                        <option value="sg">Singapore (Changi SIN)</option>
                        <option value="de">Germany (Frankfurt FRA)</option>
                        <option value="au">Australia (Sydney SYD)</option>
                        <option value="domestic">India Domestic (Delhi, Bengaluru, Chennai)</option>
                      </select>
                    </div>
                  </div>

                  {/* Volumetric Calculator */}
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="flex items-center gap-2 mb-4 text-[#10B981]">
                      <Calculator className="w-4 h-4" />
                      <h4 className="text-sm font-semibold tracking-tight text-white">Volumetric Calculator (IATA Divisor 5000)</h4>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-gray-500 uppercase">Length (cm)</label>
                        <input 
                          type="number" 
                          value={length}
                          onChange={(e) => setLength(e.target.value)}
                          placeholder="0"
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#10B981]/50 font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-gray-500 uppercase">Width (cm)</label>
                        <input 
                          type="number" 
                          value={width}
                          onChange={(e) => setWidth(e.target.value)}
                          placeholder="0"
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#10B981]/50 font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono text-gray-500 uppercase">Height (cm)</label>
                        <input 
                          type="number" 
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          placeholder="0"
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#10B981]/50 font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-white/[0.06]">
                      <span className="text-xs text-gray-400">Chargeable Volumetric Weight</span>
                      <span className="text-lg font-mono text-[#10B981]">
                        {volumetricWeight > 0 ? volumetricWeight.toFixed(2) : '0.00'} <span className="text-xs text-gray-500">kg</span>
                      </span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => alert('Pickup Request Dispatched to Mumbai Hub dispatchers!')}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#10B981] text-slate-950 font-bold tracking-tight hover:bg-[#10B981]/90 transition-colors shadow-[0_0_20px_rgba(212,255,0,0.3)] cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Confirm Doorstep Dispatch</span>
                  </motion.button>
                </div>
              )}

              {/* ═══ DRAWER CONTENT: ENQUIRY & CONTACT DESK ═══ */}
              {activeDrawer === 'enquiry' && (
                <div className="p-6 flex flex-col gap-6">
                  {/* Verified Corporate Contact Info */}
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#00F0FF]">
                      Registered Corporate Office
                    </span>
                    <div className="text-xs text-white/80 space-y-1.5">
                      <p className="font-semibold text-white">OM International Courier & Cargo Services</p>
                      <p className="text-white/60 flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                        <span>51, Suraj Bhavan, Ground Floor, Karel Wadi, Thakurdwar, Mumbai - 400002, Maharashtra, India</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/[0.06] text-xs font-mono">
                      <a href="tel:+919820729615" className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors">
                        <Phone className="w-3.5 h-3.5 text-[#00F0FF]" />
                        <span>+91 9820729615</span>
                      </a>
                      <a href="tel:02223860032" className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors">
                        <Phone className="w-3.5 h-3.5 text-white/40" />
                        <span>022 2386 0032</span>
                      </a>
                      <a href="mailto:cs.omcourierservices@gmail.com" className="col-span-2 flex items-center gap-1.5 text-white/70 hover:text-white transition-colors truncate">
                        <Mail className="w-3.5 h-3.5 text-[#10B981]" />
                        <span>cs.omcourierservices@gmail.com</span>
                      </a>
                    </div>
                  </div>

                  {/* Direct WhatsApp Quick Connect */}
                  <a
                    href="https://wa.me/919869042220?text=Hello%20OM%20International%20Courier,%20I%20would%20like%20to%20inquire%20about%20freight%20and%20courier%20services."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp (+91 9869042220)</span>
                  </a>

                  {/* Quick Enquiry Form */}
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const cleanName = enquiryName.trim().slice(0, 80);
                      const cleanPhone = enquiryPhone.trim().slice(0, 25);
                      const cleanMsg = enquiryMsg.trim().slice(0, 500);

                      if (!cleanName || !cleanPhone) {
                        alert('Please provide your name and contact phone number.');
                        return;
                      }

                      // Check for suspicious script injection characters
                      if (/<[^>]*>|javascript:|data:/i.test(cleanName) || /<[^>]*>|javascript:|data:/i.test(cleanMsg)) {
                        alert('Invalid characters detected in message.');
                        return;
                      }

                      setEnquirySubmitted(true);
                      setTimeout(() => {
                        alert(`Thank you, ${cleanName}. Your enquiry has been securely dispatched to our Mumbai logistics coordinators.`);
                        setEnquiryName('');
                        setEnquiryPhone('');
                        setEnquiryMsg('');
                        setEnquirySubmitted(false);
                      }, 400);
                    }}
                    className="space-y-3"
                  >
                    <h4 className="text-xs uppercase font-mono tracking-widest text-white/40">Direct Desk Message</h4>
                    <input 
                      type="text" 
                      value={enquiryName}
                      onChange={(e) => setEnquiryName(e.target.value.slice(0, 80))}
                      placeholder="Your Name / Company" 
                      maxLength={80}
                      required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/40"
                    />
                    <input 
                      type="tel" 
                      value={enquiryPhone}
                      onChange={(e) => setEnquiryPhone(e.target.value.slice(0, 25))}
                      placeholder="Your Contact Phone Number" 
                      maxLength={25}
                      required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/40 font-mono"
                    />
                    <textarea 
                      rows={3} 
                      value={enquiryMsg}
                      onChange={(e) => setEnquiryMsg(e.target.value.slice(0, 500))}
                      placeholder="Shipment details, cargo weight, or destination..." 
                      maxLength={500}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/40 resize-none"
                    />
                    <button
                      type="submit"
                      disabled={enquirySubmitted}
                      className="w-full py-3 rounded-xl bg-white hover:bg-gray-200 text-slate-950 font-bold text-sm tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      <Send className="w-4 h-4" />
                      <span>{enquirySubmitted ? 'Transmitting...' : 'Transmit Message'}</span>
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
