"use client";

import Image from "next/image";
import Link from "next/link";
import { WordRotate } from "@/components/ui/word-rotate";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";
import { TextAnimate } from "@/components/ui/text-animate";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { motion } from "framer-motion";
import FeatureDiv from "@/components/FeatureDiv";
import { CiLinkedin } from "react-icons/ci";
import { useRouter } from "next/navigation";
import Teammembercard from "@/components/Teammembercard";


export default function Home() {

  const router = useRouter();

  const handleClick = () => {
    router.push("/waitlist");
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white font-['Inter'] smooth-scroll">
      {/* <DotPattern
        glow={true}
        cr={2}
        className={cn(
          "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]"
        )}
      /> */}

      {/* Hero section  */}
      <section className="py-20 sm:py-24 md:py-32 px-10 sm:px-6 lg:px-10 min-h-screen flex items-center justify-center">

        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <StarsBackground className="bg-[hsl(0,0%,0%)]" />
          <ShootingStars starColor="#ffffff" trailColor="#c4c4c4" />
        </div>

        {/* Content Layer */}
        <div className="max-w-5xl mx-auto text-center z-10">
          {/* Main Heading - Responsive text sizes */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            <TextAnimate by="word" animation="slideUp" startOnView={true} once={true}>
              Enter Medicine Knowing What To Expect
            </TextAnimate>
          </h1>

          {/* Word Rotation - Responsive text sizes */}
          <WordRotate
            className="text-[hsla(245,72%,59%)] text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight"
            words={["Mentorship", "Guidance", "Insights", "Community", "Experiences"]}
          />
          <TextAnimate by="word" animation="slideUp" delay={0.5} startOnView={true} once={true} className="text-xl text-gray-400 mb-8">
            Real Guidance From Students And Doctors Who’ve Already Lived It.
          </TextAnimate>

          <div className="flex justify-center">
            <ShimmerButton onClick={handleClick} className="px-8 py-4 flex items-center justify-center">
              Get Early Access
            </ShimmerButton>
          </div>

        </div>
      </section>

      {/* About section */}
      <section id="about" className="py-16 sm:py-20 md:py-24 px-6 sm:px-6 lg:px-10 flex items-center justify-center bg-[hsl(0,0%,5%)]">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6 px-4 sm:px-12 lg:px-24">
            <TextAnimate by="word" animation="fadeIn" startOnView={true} once={true}>
              Medicine Is Hard. Not Knowing Is Harder.
            </TextAnimate>
          </h2>

          {/* Subheading */}
          <TextAnimate delay={0.5} startOnView={true} once={true} className="text-base sm:text-lg md:text-xl text-[hsl(0,0%,60%)] mb-12 sm:mb-16 max-w-3xl">
            MedBlend Connects you with Real People at Every Stage — So Expectations Match Reality.
          </TextAnimate>

          {/* Features Grid*/}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-stretch">

            {/* Left Column - Two stacked cards (desktop only) */}
            <div className="flex flex-col gap-6 md:gap-8">

              {/* Feature Card 1 */}
              <div className="bg-[hsl(0,0%,10%)] rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

                {/* Text Content */}
                <div className="flex flex-1 flex-col justify-center lg:max-w-[55%] lg:gap-1">
                  <h3 className="flex flex-none text-white text-2xl sm:text-3xl text-left mb-8">
                    Direction
                  </h3>
                  <TextAnimate delay={0.5} startOnView={true} once={true} className="text-base sm:text-lg text-[hsl(0,0%,60%)] text-left leading-relaxed max-w-md">
                    Move forward with confidence. Make decisions about medicine with clarity — not pressure, assumptions, or luck.
                  </TextAnimate>
                </div>

                {/* Image */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="w-full lg:w-[45%] flex justify-end"
                >
                  <Image
                    src="/road-map.jpg"
                    alt="About"
                    width={280}
                    height={280}
                    className="rounded-3xl w-full h-auto object-cover aspect-square"
                  />
                </motion.div>
              </div>

              {/* Feature Card 2 */}
              <div className="bg-[hsl(0,0%,10%)] rounded-3xl p-6 sm:p-8 flex flex-col-reverse lg:flex-row lg:items-center lg:justify-between gap-10">
                {/* Image - Shows on left for desktop */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="w-full lg:w-[45%] flex justify-start"
                >
                  <Image
                    src="/checklist.jpg"
                    alt="About"
                    width={280}
                    height={280}
                    className="rounded-3xl w-full h-auto object-cover aspect-square"
                  />
                </motion.div>

                {/* Text Content */}
                <div className="flex flex-col lg:max-w-[55%]">
                  <h3 className="text-white text-xl sm:text-2xl text-left mb-8 lg:mb-12">
                    Honesty
                  </h3>
                  <TextAnimate delay={0.5} startOnView={true} once={true} className="text-base sm:text-lg text-[hsl(0,0%,60%)] text-left">
                    Get real answers. Understand workload, lifestyle, exams, and expectations before you experience them.
                  </TextAnimate>
                </div>
              </div>
            </div>

            {/* Right Column - One big card */}
            <div className="bg-[hsl(0,0%,10%)] rounded-3xl p-6 sm:p-8 flex flex-col h-full overflow-hidden">
              {/* Section Tag */}
              {/* <p className="w-fit bg-[hsl(245,72%,59%)] py-2 px-6 rounded-full text-left text-xs sm:text-sm font-semibold text-[hsl(0,0,90%)] mb-4 lg:mb-6 uppercase tracking-wider">
                Community
              </p> */}

              {/* Heading - Shows first on mobile/tablet, hidden on desktop */}
              <h3 className="text-white text-xl sm:text-2xl text-left mb-4 lg:hidden">
                Talk to people ahead of you.
              </h3>

              {/* Description - Shows second on mobile/tablet, hidden on desktop */}
              <TextAnimate delay={0.5} startOnView={true} once={true} className="text-base sm:text-lg text-[hsl(0,0%,60%)] text-left mb-6 lg:hidden">
                Ask questions to medical students, residents, and doctors — not forums, not guesses.
              </TextAnimate>

              {/* Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-6 lg:mb-8 w-full lg:flex-1 lg:h-0"
              >
                <Image
                  src="/doctor-images.jpeg"
                  alt="About"
                  width={500}
                  height={500}
                  className="rounded-2xl w-full h-full object-cover"
                />
              </motion.div>

              {/* Bottom Section - Heading and Description (Desktop only) */}
              <div className="hidden lg:flex flex-col gap-8">
                {/* Heading */}
                <h3 className="text-white text-xl sm:text-xl lg:text-2xl text-left w-full">
                  Talk to people ahead of you.
                </h3>

                {/* Description */}
                <TextAnimate startOnView={true} once={true} delay={0.5} className="text-base sm:text-lg text-[hsl(0,0%,60%)] text-left w-full">
                  Ask questions to medical students, residents, and doctors — not forums, not guesses.
                </TextAnimate>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Meet the team */}
      <section id="team" className="py-16 sm:py-20 md:py-24 px-6">
        {/* Section Tag */}
        <p className="w-fit bg-[hsl(245,72%,59%)] py-2 px-6 rounded-full text-xs mx-auto w-1/2 text-center sm:text-sm font-semibold text-[hsl(0,0,100)] mb-6 lg:mb-6 uppercase tracking-wider">
          Team Members
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl text-center font-bold leading-tight mb-12 sm:mb-16">
          <TextAnimate by="word" animation="fadeIn" startOnView={true} once={true}>
            Meet The Team
          </TextAnimate>
        </h2>

        {/* Team Grid - 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">

          {/* Team Member 1 */}
          <a className="group">
            <div className="bg-[hsl(0,0%,12%)] rounded-3xl p-1 transition-transform hover:scale-105">
              <div className="relative overflow-hidden rounded-3xl">
                {/* Image */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <Image
                    src="/omar-picture.jpeg"
                    alt="Omar Oqaili"
                    width={400}
                    height={400}
                    className="rounded-3xl w-full h-auto object-cover aspect-square"
                  />
                </motion.div>

                {/* Name and Title - Overlay at Bottom */}
                <Teammembercard name="Omar Oqaili" role="CEO & Founder" />
              </div>
            </div>
          </a>

          {/* Team Member 2 */}
          <a className="group">
            <div className="bg-[hsl(0,0%,12%)] rounded-3xl p-1 transition-transform hover:scale-105">
              <div className="relative overflow-hidden rounded-3xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Image
                    src="/reema-picture.jpeg"
                    alt="Reema"
                    width={400}
                    height={400}
                    className="rounded-3xl w-full h-auto object-cover aspect-square"
                  />
                </motion.div>
                <Teammembercard name="Reema Khattab" role="Director of Marketing" />
              </div>
            </div>
          </a>

          {/* Team Member 3 */}
          <a className="group">
            <div className="bg-[hsl(0,0%,12%)] rounded-3xl p-1 transition-transform hover:scale-105">
              <div className="relative overflow-hidden rounded-3xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Image
                    src="/ahmad2.jpeg"
                    alt="Muhammad Ahmad"
                    width={400}
                    height={400}
                    className="rounded-3xl w-full h-auto object-cover aspect-square"
                  />
                </motion.div>
                <Teammembercard name="Muhammad Ahmad" role="CTO" />
              </div>
            </div>
          </a>

        </div>
      </section>

    </div>
  );
}
