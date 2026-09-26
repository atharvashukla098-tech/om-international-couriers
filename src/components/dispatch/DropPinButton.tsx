"use client";

import React from 'react';
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';

interface DropPinButtonProps {
  active: boolean;
  onToggle: () => void;
  visible?: boolean;
  rotateMode?: boolean;
  onToggleRotate?: () => void;
}

export default function DropPinButton({ 
  active, 
  onToggle, 
  visible = true,
  rotateMode = false,
  onToggleRotate,
}: DropPinButtonProps) {
  return (
    <div className="fixed bottom-20 sm:bottom-8 left-3 sm:left-8 z-30 pointer-events-none flex items-center gap-2 max-w-[calc(100vw-24px)]">
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        className={`pointer-events-auto flex items-center gap-1.5 sm:gap-2 rounded-2xl px-3 sm:px-5 py-2 sm:py-3.5 transition-all duration-300 text-xs sm:text-sm font-medium ${
          active
            ? 'bg-[#10B981] text-slate-950 font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)]'
            : 'backdrop-blur-md bg-slate-950/85 border border-white/10 text-white/80 hover:text-white'
        }`}
      >
        <MapPin className={`w-3.5 sm:w-4 h-3.5 sm:h-4 ${active ? 'text-slate-950' : 'text-[#10B981]'}`} />
        <span>{active ? 'Tap Globe to Pin' : 'Mark Drop-off'}</span>
      </motion.button>

      {onToggleRotate && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleRotate}
          className={`pointer-events-auto sm:hidden flex items-center gap-1.5 rounded-2xl px-3 py-2 transition-all duration-300 text-xs font-medium ${
            rotateMode
              ? 'bg-[#00F0FF] text-slate-950 font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]'
              : 'backdrop-blur-md bg-slate-950/85 border border-white/10 text-white/80 hover:text-white'
          }`}
        >
          <span className="text-sm">{rotateMode ? '↕' : '🧭'}</span>
          <span>{rotateMode ? 'Scroll Mode' : 'Rotate Earth'}</span>
        </motion.button>
      )}
    </div>
  );
}
