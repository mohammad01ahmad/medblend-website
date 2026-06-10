"use client";

import LandingHero from "@/components/homePage/LandingHero";
import Tape from "@/components/homePage/Tape";
import FeatureSection from "@/components/homePage/FeatureSection";
import Team from "@/components/homePage/Team";
import Teaser from "@/components/homePage/Teaser";
import Solution from "@/components/homePage/Solution";
import Stats from "@/components/homePage/Stats";
import CtaSection from "@/components/homePage/CtaSection";
import StickyNav from "@/components/headers/StickyNav";
import StickyCTA from "@/components/homePage/StickyCTA";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-white smooth-scroll">

      <LandingHero />

      {/* Sentinel: sticky nav appears after hero scrolls out */}
      <div id="hero-end-sentinel" className="h-px w-full" aria-hidden />

      <StickyNav />

      <StickyCTA />

      <Tape />

      <Teaser />

      <Solution />

      <FeatureSection />

      <Stats />

      <Team />

      <FAQ />

      <CtaSection />

    </div>
  );
}
