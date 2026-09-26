"use client";

export function StatusTelemetryRibbon() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
      <div className="flex items-center gap-2 text-xs text-white/50 font-mono">
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </div>
        BOM Gateway Active
      </div>
      
      <div className="flex items-center gap-2 text-xs text-white/50 font-mono">
        <div className="h-2 w-2 rounded-full bg-[#00F0FF]"></div>
        24/7 Dispatch
      </div>

      <div className="flex items-center gap-2 text-xs text-white/50 font-mono">
        <div className="h-2 w-2 rounded-full bg-[#00F0FF]"></div>
        220+ Countries
      </div>
    </div>
  );
}
