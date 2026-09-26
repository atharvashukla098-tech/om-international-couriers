"use client";

import { motion } from "motion/react";

interface ModeSegmentSwitcherProps {
  activeMode: string;
  onModeChange: (mode: string) => void;
}

const modes = ['Express Courier', 'Commercial Air Freight', 'Ocean Cargo (FCL/LCL)'];

export function ModeSegmentSwitcher({ activeMode, onModeChange }: ModeSegmentSwitcherProps) {
  return (
    <div className="bg-white/[0.05] rounded-2xl p-1 flex flex-col sm:flex-row gap-1">
      {modes.map((mode) => (
        <button
          key={mode}
          onClick={() => onModeChange(mode)}
          className={`px-4 py-2 text-xs sm:text-sm rounded-xl relative flex-1 text-center transition-colors duration-300 z-10 ${
            activeMode === mode ? "text-white" : "text-white/50 hover:text-white/70"
          }`}
        >
          {activeMode === mode && (
            <motion.div
              layoutId="activeTabIndicator"
              className="absolute inset-0 bg-white/[0.1] rounded-xl -z-10"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          {mode}
        </button>
      ))}
    </div>
  );
}
