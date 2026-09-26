"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Package, Plane, Ship, Shield } from "lucide-react";

const services = [
  {
    icon: Package,
    title: "Cross-Border Express",
    description:
      "Door-to-door international courier with real-time tracking, customs pre-clearance, and guaranteed delivery windows across 220+ countries.",
    accent: "#10B981",
  },
  {
    icon: Plane,
    title: "Commercial Air Freight",
    description:
      "Scheduled cargo flights and full aircraft charters for time-critical shipments. Direct routing from BOM to major global hubs.",
    accent: "#00F0FF",
  },
  {
    icon: Ship,
    title: "Ocean Freight (FCL/LCL)",
    description:
      "Full container and less-than-container maritime shipping with port-to-port and door-to-door multimodal options.",
    accent: "#0284c7",
  },
  {
    icon: Shield,
    title: "Customs & DGR Handling",
    description:
      "Mumbai port customs brokerage, dangerous goods classification, IATA/IMDG compliance, and regulatory documentation.",
    accent: "#e11d48",
  },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const Icon = service.icon;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.14 }}
      whileHover={{ y: -8, scale: 1.01 }}
      className="relative group bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8 overflow-hidden transition-colors duration-300"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, ${service.accent}10, transparent 60%)`,
        }}
      />
      <div className="relative z-10">
        <Icon className="w-8 h-8" style={{ color: service.accent }} />
        <h3 className="text-xl font-bold text-white mt-4">{service.title}</h3>
        <p className="text-sm text-white/50 mt-2 leading-relaxed">{service.description}</p>
      </div>
    </motion.div>
  );
}

export function ServiceBentoGrid() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-4xl font-extrabold text-white tracking-tight mb-4">
        Enterprise Logistics Suite
      </h2>
      <p className="text-lg text-white/50 mb-12">
        End-to-end multimodal freight solutions from Mumbai to the world.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service, index) => (
          <ServiceCard key={index} service={service} index={index} />
        ))}
      </div>
    </section>
  );
}
