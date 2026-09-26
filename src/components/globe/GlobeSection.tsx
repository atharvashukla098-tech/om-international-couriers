"use client";

import { Suspense } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, Globe } from 'lucide-react';
import RouteGlobe from './RouteGlobe';
import LoadingGlassSkeleton from '@/components/ui/LoadingGlassSkeleton';
import { ROUTE_DATA } from '@/lib/geo-utils';

export default function GlobeSection() {
  return (
    <section className="min-h-screen py-20 relative bg-gradient-to-b from-[#030712] to-[#060E1E] overflow-hidden flex items-center">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
                Global Route Network
              </h2>
              <p className="text-lg text-white/50 max-w-xl">
                Real-time shipping corridors from Mumbai to 220+ international destinations. Precision telemetry for every package.
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {ROUTE_DATA.map((route, i) => (
                <motion.div
                  key={route.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  className="bg-white/[0.03] backdrop-blur-[20px] border border-white/[0.08] rounded-full px-4 py-2 flex items-center gap-3 hover:bg-white/[0.06] transition-colors cursor-default"
                >
                  <div className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
                  <span className="text-white font-bold tracking-tight text-sm">{route.code}</span>
                  <span className="text-white/40 text-xs">/</span>
                  <span className="text-white/80 text-sm whitespace-nowrap">{route.name}</span>
                  <span className="text-[#00F0FF] font-mono text-xs ml-2 bg-[#00F0FF]/10 px-2 py-0.5 rounded-full">
                    {route.transitTime}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link
                href="/dispatch"
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-[#10B981] text-slate-950 font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(16, 185, 129,0.3)] hover:shadow-[0_0_35px_rgba(16, 185, 129,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98] group"
              >
                <Globe className="w-4 h-4 text-slate-950" />
                <span>Launch 3D Dispatch & Geocoding Globe</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Right Content: Globe Canvas */}
          <motion.div 
            className="w-full aspect-square md:h-[600px] lg:h-[700px] relative rounded-3xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Ambient glow behind globe */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.08)_0%,transparent_60%)] pointer-events-none" />
            
            <Suspense fallback={<LoadingGlassSkeleton />}>
              <RouteGlobe />
            </Suspense>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
