"use client";

import Tape from "@/components/Tape";
import Hero from "@/components/Hero";
import FeatureSection from "@/components/FeatureSection";
import Team from "@/components/Team";
import Teaser from "@/components/Teaser";
import Solution from "@/components/Solution";
import Stats from "@/components/Stats";

export default function Home() {

  return (
    <div className="min-h-screen bg-[#121212] text-white font-['Inter'] smooth-scroll">

      {/* Hero section  */}
      <Hero />

      {/* Animation Tape */}
      <Tape />

      {/* Teaser section */}
      <Teaser />

      {/* Solution section */}
      <Solution />

      {/* Stats section */}
      <Stats />

      {/* Feature section */}
      <FeatureSection />

      {/* Meet the team */}
      <Team />

    </div>
  );
}
