"use client";

import { motion } from "motion/react";
import { ArrowRight, Loader2 } from "lucide-react";

interface MagneticSubmitButtonProps {
  onClick: () => void;
  loading?: boolean;
}

export function MagneticSubmitButton({ onClick, loading = false }: MagneticSubmitButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={loading}
      whileHover={loading ? {} : { scale: 1.02 }}
      whileTap={loading ? {} : { scale: 0.98 }}
      className="w-full bg-[#10B981] disabled:opacity-70 hover:shadow-[0_0_20px_rgba(16, 185, 129,0.3)] transition-all duration-300 text-slate-950 font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 text-sm tracking-wide cursor-pointer disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
          <span>Verifying Official Telemetry...</span>
        </>
      ) : (
        <>
          <span>Track Consignment</span>
          <motion.span
            variants={{
              hover: { x: 4 },
              rest: { x: 0 },
            }}
            initial="rest"
            whileHover="hover"
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <ArrowRight size={18} />
          </motion.span>
        </>
      )}
    </motion.button>
  );
}

