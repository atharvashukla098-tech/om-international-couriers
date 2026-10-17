"use client";

import React, { useRef, useEffect, useState } from "react";
import type { MotionValue } from "motion/react";

const FRAME_COUNT = 300;
const LIFTOFF_START = 0.60;
const LIFTOFF_END   = 0.92;

function framePath(index: number, isMobile: boolean): string {
  const dir = isMobile ? "/frames-mobile" : "/frames";
  return `${dir}/ezgif-frame-${index.toString().padStart(3, "0")}.webp`;
}

interface AirplaneHeroProps {
  progress?: number;
  scrollProgress?: MotionValue<number>;
  active?: boolean;
}

function AirplaneHero({ progress, scrollProgress, active = true }: AirplaneHeroProps) {
  const canvasRef         = useRef<HTMLCanvasElement>(null);
  const logoRef           = useRef<HTMLDivElement>(null);
  // Desktop welcome overlay
  const welcomeRef        = useRef<HTMLDivElement>(null);
  // Mobile welcome card (separate DOM node)
  const welcomeMobRef     = useRef<HTMLDivElement>(null);
  // Desktop telemetry panels
  const altimeterRef      = useRef<HTMLDivElement>(null);
  const speedRef          = useRef<HTMLDivElement>(null);
  // Mobile inline telemetry cells
  const altimeterMobRef   = useRef<HTMLDivElement>(null);
  const speedMobRef       = useRef<HTMLDivElement>(null);
  const progressBarRef    = useRef<HTMLDivElement>(null);
  const progressLabelRef  = useRef<HTMLSpanElement>(null);
  const imagesRef         = useRef<HTMLImageElement[]>([]);
  const loadedMapRef      = useRef<Uint8Array>(new Uint8Array(FRAME_COUNT)); // 1 = loaded

  const [loaded, setLoaded] = useState(false);
  const [loadPct, setLoadPct]  = useState(0);

  const targetProgressRef = useRef(progress ?? 0);
  const smoothProgressRef = useRef(progress ?? 0);
  const animFrameRef      = useRef<number | null>(null);
  const startLoopRef      = useRef<(() => void) | null>(null);
  const activeRef         = useRef(active);
  const lastIndexRef      = useRef<number>(-1);
  const isMobRef          = useRef(false);
  const ctxRef            = useRef<CanvasRenderingContext2D | null>(null);

  // ── Scroll subscription (zero React re-renders)
  useEffect(() => {
    if (!scrollProgress) return;
    const unsub = scrollProgress.on("change", (p) => {
      if (!activeRef.current) return;
      targetProgressRef.current = Math.min(1, Math.max(0, p / 0.20));
      startLoopRef.current?.();
    });
    return unsub;
  }, [scrollProgress]);

  useEffect(() => {
    if (progress !== undefined) {
      targetProgressRef.current = progress;
      if (activeRef.current) startLoopRef.current?.();
    }
  }, [progress]);

  useEffect(() => {
    activeRef.current = active;
    if (active) startLoopRef.current?.();
  }, [active]);

  // ── Frame preloader
  useEffect(() => {
    let cancelled = false;
    let doneCount = 0;
    const images    = new Array<HTMLImageElement>(FRAME_COUNT);
    const loadedMap = new Uint8Array(FRAME_COUNT);
    imagesRef.current  = images;
    loadedMapRef.current = loadedMap;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    isMobRef.current = isMobile;

    // Mobile loads every 2nd frame; desktop loads all
    const step = isMobile ? 2 : 1;
    // Keyframe skeleton: distributed across the full 0..299 range
    const kStep = isMobile ? 6 : 5;
    const keyframes: number[] = [];
    for (let i = 0; i < FRAME_COUNT; i += kStep) keyframes.push(i);
    if (keyframes[keyframes.length - 1] !== FRAME_COUNT - 1) keyframes.push(FRAME_COUNT - 1);

    const rest: number[] = [];
    for (let i = 0; i < FRAME_COUNT; i += step) {
      if (!keyframes.includes(i)) rest.push(i);
    }
    const total = keyframes.length + rest.length;

    const load = (i: number): Promise<void> =>
      new Promise((resolve) => {
        const img = new Image();
        img.src = framePath(i + 1, isMobile);
        const done = () => {
          if (cancelled) { resolve(); return; }
          images[i]    = img;
          loadedMap[i] = 1;
          doneCount++;
          setLoadPct(doneCount / total);
          resolve();
        };
        img.onload = done;
        img.onerror = done;
      });

    const minReady = isMobile ? Math.min(10, keyframes.length) : Math.min(14, keyframes.length);
    let kDone = 0;
    keyframes.forEach((idx) =>
      load(idx).then(() => {
        if (cancelled) return;
        kDone++;
        if (kDone >= minReady) setLoaded(true);
      })
    );

    let batchStart = 0;
    const BATCH = 12;
    const streamNext = () => {
      if (cancelled || batchStart >= rest.length) return;
      const batch = rest.slice(batchStart, batchStart + BATCH);
      batchStart += BATCH;
      Promise.all(batch.map(load)).then(() => {
        if (cancelled) return;
        if ("requestIdleCallback" in window) {
          (window as unknown as { requestIdleCallback: (fn: () => void) => void })
            .requestIdleCallback(streamNext);
        } else {
          setTimeout(streamNext, 20);
        }
      });
    };
    const t = setTimeout(streamNext, 60);

    return () => { cancelled = true; clearTimeout(t); };
  }, []);

  // ── Canvas pipeline
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) return;
    ctxRef.current = ctx;

    // O(1) nearest loaded frame lookup using loadedMap
    const findFrame = (target: number): HTMLImageElement | null => {
      const imgs = imagesRef.current;
      const map  = loadedMapRef.current;
      if (map[target] && imgs[target]) return imgs[target];
      for (let off = 1; off < FRAME_COUNT; off++) {
        const b = target - off;
        if (b >= 0 && map[b] && imgs[b]) return imgs[b];
        const f = target + off;
        if (f < FRAME_COUNT && map[f] && imgs[f]) return imgs[f];
      }
      return null;
    };

    const drawFrame = (idx: number) => {
      const img = findFrame(idx);
      if (!img || img.naturalWidth === 0) return;

      const cw = canvas.width, ch = canvas.height;
      const iw = img.naturalWidth  || 2560;
      const ih = img.naturalHeight || 1440;
      const hr = cw / iw, vr = ch / ih;
      const isMob = isMobRef.current;

      // Mobile → contain (show full plane); Desktop → cover (fill edge-to-edge)
      const ratio = isMob ? Math.min(hr, vr) : Math.max(hr, vr);
      const dw = iw * ratio, dh = ih * ratio;
      const dx = (cw - dw) * 0.5, dy = (ch - dh) * 0.5;

      if (isMob) { ctx.fillStyle = "#030712"; ctx.fillRect(0, 0, cw, ch); }
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    const handleResize = () => {
      const mob = window.innerWidth < 768;
      isMobRef.current = mob;
      const dpr = mob ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width  = Math.floor(window.innerWidth  * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = mob ? "low" : "high";
      if (lastIndexRef.current >= 0) drawFrame(lastIndexRef.current);
    };
    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    let running = true;
    let loopActive = false;

    const loop = () => {
      if (!running || !activeRef.current) { loopActive = false; return; }

      const target  = targetProgressRef.current;
      const current = smoothProgressRef.current;
      const delta   = target - current;
      const abs     = Math.abs(delta);

      let cont = true;
      if (abs > 0.00035) {
        // 1:1 mobile finger tracking — high lerp on mobile, smooth inertia on desktop
        const factor = isMobRef.current
          ? Math.min(0.88, 0.70 + abs * 2.0)  // fast, near-instant tracking
          : Math.min(0.65, 0.35 + abs * 1.5); // silky inertia on desktop
        smoothProgressRef.current += delta * factor;
      } else {
        smoothProgressRef.current = target;
        cont = false;
      }

      const p = Math.max(0, Math.min(1, smoothProgressRef.current));
      const idx = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(p * (FRAME_COUNT - 1))));

      if (idx !== lastIndexRef.current) {
        drawFrame(idx);
        lastIndexRef.current = idx;
      }

      // ── HUD telemetry updates (direct DOM, zero re-renders) ──────────
      const speedKt  = Math.round(p * 290);   // 0 → 290 knots
      const altFt    = Math.round(p * 35000); // 0 → 35,000 ft
      const pctInt   = Math.round(p * 100);
      const altText  = altFt >= 1000 ? `${(altFt / 1000).toFixed(1)}k ft` : `${altFt} ft`;
      const spdText  = `${speedKt} kt`;

      // Desktop panels
      if (altimeterRef.current)    altimeterRef.current.textContent    = altText;
      if (speedRef.current)        speedRef.current.textContent        = spdText;
      // Mobile inline cells
      if (altimeterMobRef.current) altimeterMobRef.current.textContent = altText;
      if (speedMobRef.current)     speedMobRef.current.textContent     = spdText;

      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${pctInt}%`;
      }
      if (progressLabelRef.current) {
        progressLabelRef.current.textContent = pctInt < 100 ? `${pctInt}% thrust` : "Airborne";
      }

      // Welcome prompt fade (applies to whichever ref is currently visible)
      const fade = Math.max(0, 1 - p / 0.10);
      const fadeStyle = (el: HTMLDivElement | null) => {
        if (!el) return;
        if (fade <= 0.01) {
          el.style.display = "none";
        } else {
          el.style.display = "flex";
          el.style.opacity = fade.toFixed(3);
          el.style.transform = `translateY(${((1 - fade) * -18).toFixed(1)}px)`;
        }
      };
      fadeStyle(welcomeRef.current);
      fadeStyle(welcomeMobRef.current);

      // Logo fade-in at liftoff
      if (logoRef.current) {
        let op = 0;
        if (p >= LIFTOFF_START && p <= LIFTOFF_END) {
          const fadeIn  = (p - LIFTOFF_START) / 0.10;
          const fadeOut = (LIFTOFF_END - p) / 0.10;
          op = Math.min(1, fadeIn, fadeOut);
        }
        logoRef.current.style.opacity   = op.toFixed(3);
        logoRef.current.style.transform = `translateY(${op > 0.01 ? 0 : 20}px)`;
      }

      if (cont && activeRef.current) {
        animFrameRef.current = requestAnimationFrame(loop);
      } else {
        loopActive = false;
      }
    };

    const trigger = () => {
      if (!loopActive && running && activeRef.current) {
        loopActive = true;
        animFrameRef.current = requestAnimationFrame(loop);
      }
    };
    startLoopRef.current = trigger;
    trigger();

    return () => {
      running = false; loopActive = false;
      startLoopRef.current = null;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [loaded]);

  return (
    <div className="absolute inset-0 bg-[#030712] overflow-hidden">

      {/* ── Loading Screen ── */}
      {!loaded && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-[#030712]">
          {/* Animated logo mark */}
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-[#10B981]/20 animate-ping" />
            <div className="absolute inset-2 rounded-full border border-[#10B981]/40" />
            <span className="text-[#10B981] font-extrabold font-mono text-lg">FF</span>
          </div>
          <p className="text-white/50 text-[11px] font-mono tracking-[0.3em] uppercase">
            Initializing Flight Systems
          </p>
          <div className="w-48 h-[3px] bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#10B981] to-[#00F0FF] rounded-full transition-all duration-100"
              style={{ width: `${loadPct * 100}%` }}
            />
          </div>
          <p className="text-white/25 text-[10px] font-mono">{Math.round(loadPct * 100)}%</p>
        </div>
      )}

      {/* ── Main Canvas ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
        style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease-out" }}
      />

      {/* ── Cinematic Vignette + Gradient overlay ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 100%, rgba(3,7,18,0.85) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 50% 0%,   rgba(3,7,18,0.55) 0%, transparent 60%),
            radial-gradient(ellipse 30% 60% at 0% 50%,   rgba(3,7,18,0.45) 0%, transparent 70%),
            radial-gradient(ellipse 30% 60% at 100% 50%, rgba(3,7,18,0.45) 0%, transparent 70%)
          `,
        }}
      />

      {/* ── Scanline grid atmosphere (desktop only — GPU cost on mobile) ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025] hidden sm:block"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,240,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,240,255,1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ══════════════════════════════════════════════════════════════
          MOBILE LAYOUT: Compact bottom card with inline telemetry
          DESKTOP LAYOUT: Left-side text with separate right panels
          ══════════════════════════════════════════════════════════════ */}

      {/* ── DESKTOP ONLY: Left-side welcome text (hidden on mobile) ── */}
      <div
        ref={welcomeRef}
        className="absolute inset-0 z-20 flex-col justify-end pb-20 px-10 hidden sm:flex"
      >
        {/* Status pill */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex items-center justify-center w-2 h-2">
            <span className="absolute inline-flex w-full h-full rounded-full bg-[#10B981] opacity-75 animate-ping" />
            <span className="relative w-2 h-2 rounded-full bg-[#10B981]" />
          </div>
          <span className="text-xs font-mono tracking-widest text-[#10B981] uppercase font-semibold">
            BOM Runway 27L · Heavy Freight Dispatch
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05] drop-shadow-2xl max-w-2xl">
          First{" "}
          <span style={{ background: "linear-gradient(135deg, #10B981 0%, #00F0FF 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Flight
          </span>
          <br />
          <span className="text-white/90">Global Express</span>
        </h1>

        <p className="text-white/50 text-sm mt-3 max-w-sm font-light tracking-wide">
          Next-Gen Air · Ocean · Express Cargo Network — Demo Showcase
        </p>

        <div className="mt-6 flex items-center gap-3 text-white/35">
          <div className="flex flex-col gap-[3px]">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-[2px] bg-[#10B981] rounded-full"
                style={{ width: `${14 + i * 6}px`, opacity: 0.4 + i * 0.3 }}
              />
            ))}
          </div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Scroll to Takeoff</span>
        </div>
      </div>

      {/* ── MOBILE ONLY: Compact centered-bottom welcome card ── */}
      <div
        ref={welcomeMobRef}
        className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center pb-14 px-4 sm:hidden"
      >
        {/* Glass card containing everything */}
        <div className="w-full max-w-sm bg-black/50 border border-white/10 rounded-2xl px-4 pt-3 pb-3 backdrop-blur-none">
          {/* Top row: status beacon + brand */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="relative w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-[#10B981] opacity-75 animate-ping" />
                <span className="relative block w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              </div>
              <span className="text-[9px] font-mono tracking-widest text-[#10B981] uppercase font-semibold">
                BOM Runway 27L · Live
              </span>
            </div>
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider">Demo Showcase</span>
          </div>

          {/* Brand name */}
          <h1 className="text-xl font-extrabold text-white tracking-tight leading-tight mb-0.5">
            First{" "}
            <span style={{ background: "linear-gradient(135deg, #10B981 0%, #00F0FF 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Flight
            </span>{" "}
            <span className="text-white/85">Global</span>
          </h1>
          <p className="text-white/45 text-[11px] font-light mb-3">
            Air · Ocean · Express · Global Logistics Demo
          </p>

          {/* Inline telemetry row */}
          <div className="flex items-center gap-3 mb-2.5">
            <div className="flex-1 bg-white/5 rounded-lg px-2.5 py-1.5 border border-white/[0.08]">
              <div className="text-[8px] font-mono text-white/35 uppercase tracking-widest">ALT</div>
              <div ref={altimeterMobRef} className="text-xs font-mono font-bold text-[#00F0FF]">0 ft</div>
            </div>
            <div className="flex-1 bg-white/5 rounded-lg px-2.5 py-1.5 border border-white/[0.08]">
              <div className="text-[8px] font-mono text-white/35 uppercase tracking-widest">SPD</div>
              <div ref={speedMobRef} className="text-xs font-mono font-bold text-[#D4FF00]">0 kt</div>
            </div>
            <div className="flex-1 bg-white/5 rounded-lg px-2.5 py-1.5 border border-white/[0.08]">
              <div className="text-[8px] font-mono text-white/35 uppercase tracking-widest">FROM</div>
              <div className="text-xs font-mono font-bold text-white">BOM</div>
            </div>
          </div>

          {/* Scroll cue */}
          <div className="flex items-center gap-2 text-white/30">
            <div className="flex-1 h-[1px] bg-white/10 rounded-full" />
            <span className="text-[9px] font-mono uppercase tracking-[0.15em] whitespace-nowrap">Scroll to Takeoff</span>
            <div className="flex-1 h-[1px] bg-white/10 rounded-full" />
          </div>
        </div>
      </div>

      {/* ── DESKTOP ONLY: Right-side stacked telemetry panels ── */}
      <div className="absolute top-20 right-8 z-20 flex-col gap-2 pointer-events-none hidden sm:flex">
        <div className="bg-black/60 border border-white/10 rounded-xl px-3 py-2 backdrop-blur-sm min-w-[100px]">
          <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest mb-0.5">ALT</div>
          <div ref={altimeterRef} className="text-sm font-mono font-bold text-[#00F0FF]">0 ft</div>
        </div>
        <div className="bg-black/60 border border-white/10 rounded-xl px-3 py-2 backdrop-blur-sm min-w-[100px]">
          <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest mb-0.5">SPD</div>
          <div ref={speedRef} className="text-sm font-mono font-bold text-[#D4FF00]">0 kt</div>
        </div>
        <div className="bg-black/60 border border-white/10 rounded-xl px-3 py-2 backdrop-blur-sm min-w-[100px]">
          <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest mb-0.5">FROM</div>
          <div className="text-sm font-mono font-bold text-white">BOM</div>
        </div>
      </div>

      {/* ── Thrust Progress Bar (bottom — both mobile + desktop, different positions) ── */}
      <div className="absolute bottom-[54px] sm:bottom-6 left-4 right-4 sm:left-8 sm:right-8 z-20 pointer-events-none">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[8px] sm:text-[10px] font-mono text-white/25 uppercase tracking-widest">Thrust</span>
          <span ref={progressLabelRef} className="text-[8px] sm:text-[10px] font-mono text-[#10B981]">0% thrust</span>
        </div>
        <div className="h-[2px] sm:h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
          <div
            ref={progressBarRef}
            className="h-full rounded-full"
            style={{
              width: "0%",
              background: "linear-gradient(90deg, #10B981, #00F0FF)",
              boxShadow: "0 0 8px rgba(0,240,255,0.6)",
              transition: "width 0.05s linear",
            }}
          />
        </div>
      </div>

      {/* ── DESKTOP ONLY: Flight stats strip ── */}
      <div className="absolute bottom-14 left-8 z-20 pointer-events-none hidden sm:flex items-center gap-4">
        {[
          { label: "Dest",   value: "220+ Nations" },
          { label: "Class",  value: "Air Cargo"    },
          { label: "Flight", value: "FF-BOM-001"   },
        ].map((s) => (
          <div key={s.label} className="text-left">
            <div className="text-[8px] font-mono text-white/25 uppercase tracking-widest">{s.label}</div>
            <div className="text-[11px] font-mono font-semibold text-white/70">{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── Liftoff Logo Overlay (fades in mid-flight, both breakpoints) ── */}
      <div
        ref={logoRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none"
        style={{ opacity: 0, transform: "translateY(20px)", transition: "none" }}
      >
        <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-2xl sm:text-4xl shadow-[0_0_50px_rgba(16,185,129,0.5)] mb-3 sm:mb-4">
          FF
        </div>
        <h1
          className="font-extrabold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-center px-4"
          style={{
            fontSize: "clamp(1.2rem, 5vw, 3rem)",
            background: "linear-gradient(135deg, #fff 30%, #10B981 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          First Flight Global
        </h1>
        <p className="text-white/40 text-[10px] sm:text-sm tracking-[0.12em] mt-1 font-light text-center">
          Air · Ocean · Express Cargo Network
        </p>
      </div>

    </div>
  );
}

export default React.memo(AirplaneHero);
