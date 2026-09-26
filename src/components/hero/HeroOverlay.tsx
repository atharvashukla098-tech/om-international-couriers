"use client";

import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";

export default function HeroOverlay() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
  };

  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-center">
      <div className="container mx-auto px-6 md:px-12 pointer-events-auto">
        <motion.div
          className="max-w-4xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            <motion.div variants={itemVariants}>Global Logistics</motion.div>
            <motion.div variants={itemVariants}>Delivered at the</motion.div>
            <motion.div variants={itemVariants} className="text-[#10B981]">
              Speed of Light.
            </motion.div>
          </h1>
          <motion.p
            variants={itemVariants}
            className="mt-6 text-lg text-white/60 max-w-2xl"
          >
            Mumbai&apos;s Premier International Courier & Cargo Network — Air, Ocean, Express.
          </motion.p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-0 right-0 flex flex-col items-center justify-center text-white/50 pointer-events-auto"
      >
        <span className="text-sm mb-2 font-medium tracking-widest uppercase">Scroll to Explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </div>
  );
}
