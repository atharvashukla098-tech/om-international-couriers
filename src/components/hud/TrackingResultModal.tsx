"use client";

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, PackageCheck, AlertCircle, MapPin, Calendar, Clock, Truck, FileText, ExternalLink } from 'lucide-react';
import type { TrackingResult } from '@/lib/tracking-api';

interface TrackingResultModalProps {
  result: TrackingResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TrackingResultModal({ result, isOpen, onClose }: TrackingResultModalProps) {
  if (!isOpen || !result) return null;

  const isDelivered = result.status?.toLowerCase().includes('delivered');
  const isError = !result.success;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 25 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#030712]/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] z-10 flex flex-col gap-6"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-white/10 pb-5">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-mono tracking-widest text-[#00F0FF]">
                  First Flight Global
                </span>
                {result.isDemo && (
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 font-semibold">
                    Simulated Preview
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <span>AWB: {result.trackingNo}</span>
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Error Message */}
          {isError ? (
            <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-start gap-4 text-red-300">
              <AlertCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-semibold text-white">Consignment Not Found</h4>
                <p className="text-sm text-white/70">{result.error || 'Please double check the docket number and try again.'}</p>
                <div className="mt-3 text-xs font-mono text-white/50">
                  Tip: Try testing with <span className="text-[#10B981] font-bold">FF-8921-IN</span> to preview telemetry details.
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Status Ribbon */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${isDelivered ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : 'bg-[#10B981] shadow-[0_0_10px_#10B981] animate-pulse'}`} />
                  <span className="text-lg font-bold text-white tracking-wide">
                    {result.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-white/60">
                  {result.pieces && <span>📦 {result.pieces}</span>}
                  {result.weight && <span>⚖️ {result.weight}</span>}
                </div>
              </div>

              {/* Consignment Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.consignee && (
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">Consignee</span>
                    <p className="text-sm font-semibold text-white truncate">{result.consignee}</p>
                  </div>
                )}
                {result.destination && (
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">Destination</span>
                    <p className="text-sm font-semibold text-white flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#00F0FF] shrink-0" />
                      {result.destination}
                    </p>
                  </div>
                )}
                {result.bookedDate && (
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">Booked Date</span>
                    <p className="text-sm font-mono text-white/80 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-white/40" />
                      {result.bookedDate}
                    </p>
                  </div>
                )}
                {result.deliveredDate && (
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">Delivered Date</span>
                    <p className="text-sm font-mono text-emerald-400 flex items-center gap-1.5">
                      <PackageCheck className="w-3.5 h-3.5" />
                      {result.deliveredDate}
                    </p>
                  </div>
                )}
              </div>

              {/* Proof of Delivery if available */}
              {result.podImage && (
                <a
                  href={result.podImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-[#10B981]/40 transition-colors text-xs font-mono text-white/80"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#10B981]" />
                    Verified Proof of Delivery (POD) Image Available
                  </span>
                  <ExternalLink className="w-4 h-4 text-white/40" />
                </a>
              )}

              {/* Docket Transit History Timeline */}
              {result.events && result.events.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs uppercase font-mono tracking-widest text-white/50 flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>Real-Time Telemetry Timeline</span>
                  </h4>

                  <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
                    {result.events.map((ev, i) => (
                      <div key={i} className="relative space-y-1">
                        <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-[#030712] border-2 border-[#00F0FF]" />
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-white">{ev.event_description}</p>
                          <span className="text-xs font-mono text-white/40 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {ev.event_at}
                          </span>
                        </div>
                        <p className="text-xs text-white/60 font-mono flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#10B981]" />
                          {ev.event_location}
                        </p>
                        {ev.event_remark && (
                          <p className="text-xs text-white/40 italic mt-0.5">{ev.event_remark}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Footer note */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/40">
            <span>First Flight Global Express • Est. 1996</span>
            <span>HQ Sahar Cargo Complex, Mumbai</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
