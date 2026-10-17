"use client";

interface TrackingInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TrackingInput({ value, onChange }: TrackingInputProps) {
  return (
    <div className="w-full">
      <label className="block text-xs text-white/40 uppercase tracking-widest mb-2 font-mono">
        Tracking Number
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 64))}
        maxLength={64}
        autoComplete="off"
        spellCheck="false"
        placeholder="Enter AWB or Container ID (e.g., OM-8921-IN)"
        className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#10B981]/40 focus:border-[#10B981]/30 transition-all duration-300"
      />
    </div>
  );
}
