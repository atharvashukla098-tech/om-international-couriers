"use client";

import { motion } from "motion/react";

export default function LoadingGlassSkeleton() {
  return (
    <div className="w-full h-full min-h-[600px] rounded-3xl bg-white/[0.02] backdrop-blur-[20px] border border-white/[0.08] flex items-center justify-center relative overflow-hidden">
      {/* Animated gradient sweep */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -skew-x-12"
        initial={{ x: "-150%" }}
        animate={{ x: "150%" }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
      />
      
      {/* Central pulsing element */}
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="w-16 h-16 rounded-full border-2 border-white/10 border-t-[#00F0FF]"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        <p className="text-[#00F0FF] font-mono text-sm uppercase tracking-widest opacity-60">Initializing Map...</p>
      </div>
    </div>
  );
}
