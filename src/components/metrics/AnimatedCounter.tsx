"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useTransform, animate, motion } from "motion/react";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
}

export function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
  duration = 1.8,
  decimals = 0,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const count = useMotionValue(0);

  const rounded = useTransform(count, (latest) => {
    return `${prefix}${latest.toFixed(decimals)}${suffix}`;
  });

  useEffect(() => {
    if (inView) {
      const animation = animate(count, target, {
        duration,
        type: "spring",
        bounce: 0.1,
      });
      return animation.stop;
    }
  }, [count, inView, target, duration]);

  return (
    <motion.span
      ref={ref}
      className="font-mono tabular-nums text-5xl md:text-6xl font-extrabold text-white"
    >
      {rounded}
    </motion.span>
  );
}
