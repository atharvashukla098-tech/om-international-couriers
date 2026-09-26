"use client";

import { AnimatedCounter } from "./AnimatedCounter";

const metrics = [
  {
    target: 28,
    suffix: "+",
    label: "Years Maritime & Aviation Legacy",
  },
  {
    target: 220,
    suffix: "+",
    label: "Countries & Global Ports",
  },
  {
    target: 1,
    suffix: "M+",
    label: "Secure Deliveries Completed",
  },
  {
    target: 99.4,
    suffix: "%",
    label: "On-Time Customs Clearance",
    decimals: 1,
  },
];

export function TelemetryCounters() {
  return (
    <div className="border-t border-white/[0.03]">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {metrics.map((metric, index) => (
            <div key={index} className="flex flex-col items-center text-center gap-2">
              <AnimatedCounter
                target={metric.target}
                suffix={metric.suffix}
                decimals={metric.decimals}
              />
              <span className="text-sm text-white/40">{metric.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
