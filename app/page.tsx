"use client";

import LandingHero from "@/components/LandingHero";
import Tape from "@/components/Tape";
import FeatureSection from "@/components/FeatureSection";
import Team from "@/components/Team";
import Teaser from "@/components/Teaser";
import Solution from "@/components/Solution";
import Stats from "@/components/Stats";
import CtaSection from "@/components/CtaSection";
import StickyNav from "@/components/StickyNav";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-white smooth-scroll">

      <LandingHero />

      {/* Sentinel: sticky nav appears after hero scrolls out */}
      <div id="hero-end-sentinel" className="h-px w-full" aria-hidden />

      <StickyNav />

      <Tape />

      <Teaser />

      <Solution />

      <FeatureSection />

      <Stats />

      <Team />

      <CtaSection />

    </div>
  );
}
