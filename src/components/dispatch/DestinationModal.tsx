"use client";

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, X, Navigation, ArrowRight } from 'lucide-react';

interface DestinationModalProps {
  destination: {
    address: string;
    lat: number;
    lng: number;
    distanceKm: number;
  } | null;
  onClose: () => void;
  onBook: () => void;
}

export default function DestinationModal({ destination, onClose, onBook }: DestinationModalProps) {
  return (
    <AnimatePresence>
      {destination && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-[110] w-full rounded-t-3xl rounded-b-none md:bottom-8 md:left-auto md:right-8 md:w-96 md:rounded-3xl backdrop-blur-2xl bg-slate-950/95 border border-white/15 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.95)]"
        >
          {/* Mobile drag handle */}
          <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-3 md:hidden" />

          {/* Header row */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#00F0FF]" />
              <span className="text-xs uppercase tracking-widest text-white/40 font-mono">
                Delivery Destination
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-white/30 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Address Block */}
          <div className="mt-3">
            <h3 className="text-lg font-bold text-white leading-snug">
              {destination.address}
            </h3>
            <p className="text-xs text-white/30 font-mono mt-1">
              {Math.abs(destination.lat).toFixed(4)}°{destination.lat >= 0 ? 'N' : 'S'},{' '}
              {Math.abs(destination.lng).toFixed(4)}°{destination.lng >= 0 ? 'E' : 'W'}
            </p>
          </div>

          {/* Distance Badge */}
          <div className="inline-flex items-center gap-2 bg-white/[0.05] rounded-full px-3 py-1.5 mt-3">
            <Navigation className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span className="text-sm font-mono text-[#00F0FF]">
              {destination.distanceKm.toLocaleString()} km / {(destination.distanceKm * 0.621371).toFixed(0)} mi
            </span>
          </div>

          {/* Transit Estimates Grid */}
          <div className="mt-5 space-y-2">
            {[
              { mode: 'Express Air Cargo', time: '2-3 Days' },
              { mode: 'Standard Air Freight', time: '4-7 Days' },
              { mode: 'Ocean Freight', time: '14-21 Days' },
            ].map((estimate, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-2 border-b border-white/[0.04] last:border-b-0"
              >
                <span className="text-sm text-white/60">{estimate.mode}</span>
                <span className="text-sm font-mono text-white">{estimate.time}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBook}
            className="mt-5 w-full bg-[#10B981] text-slate-950 font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 text-sm tracking-wide cursor-pointer"
          >
            Book Instant Pickup
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
