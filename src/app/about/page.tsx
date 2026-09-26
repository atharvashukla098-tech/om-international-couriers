import type { Metadata } from "next";
import { AboutNavbar } from "@/components/about/AboutNavbar";
import { AboutHero } from "@/components/about/AboutHero";
import { WhyChooseUsGrid } from "@/components/about/WhyChooseUsGrid";
import { MilestoneTimeline } from "@/components/about/MilestoneTimeline";
import { MumbaiGatewaySection } from "@/components/about/MumbaiGatewaySection";
import { AboutCTA } from "@/components/about/AboutCTA";
import { Footer } from "@/components/footer/Footer";

export const metadata: Metadata = {
  title: "About Us | OM International Courier Cargo Services (Est. 1996)",
  description: "Delivering trust across the globe since 1996. Over three decades of unbroken operational excellence in air cargo, maritime freight, and express logistics from Girgaon, Mumbai to 195+ sovereign nations.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#030712] text-white selection:bg-[#10B981]/30 selection:text-white">
      {/* Subpage Header Navigation */}
      <AboutNavbar />

      {/* Hero: Who We Are & 30-Year Heritage */}
      <AboutHero />

      {/* Why Choose Us: 6 Core Pillars Bento Grid */}
      <WhyChooseUsGrid />

      {/* 4-Era Chronological Milestone Timeline (1996 -> Today) */}
      <MilestoneTimeline />

      {/* Mumbai Gateway Infrastructure & Direct Operations Desk */}
      <MumbaiGatewaySection />

      {/* Next Generation Platform CTA & Modular Portal Slots */}
      <AboutCTA />

      {/* Global Shared Footer */}
      <Footer />
    </main>
  );
}
