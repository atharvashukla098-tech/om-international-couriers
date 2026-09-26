"use client";

import { Html } from '@react-three/drei';

interface RouteTooltipProps {
  name: string;
  code: string;
  transitTime: string;
  mode: string;
  position: [number, number, number];
  visible: boolean;
}

export default function RouteTooltip({ name, code, transitTime, mode, position, visible }: RouteTooltipProps) {
  if (!visible) return null;

  return (
    <Html
      position={position}
      center
      distanceFactor={8}
      className="pointer-events-none z-50"
      transform
    >
      <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 transform -translate-y-12 w-max">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-white text-lg tracking-tight">{code}</span>
          <span className="text-white/60 text-sm">/ {name}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-[#00F0FF] font-mono">{transitTime}</span>
          <span className="text-xs text-white/40">{mode}</span>
        </div>
      </div>
    </Html>
  );
}
