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
import { LuMessageCircle } from "react-icons/lu";


export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-['Inter']">
      {/* <DotPattern
        glow={true}
        cr={2}
        className={cn(
          "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]"
        )}
      /> */}

      {/* Hero section  */}
      <section className="pt-32 pb-20 px-6 min-h-screen flex items-center justify-center">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-6xl md:text-6xl font-bold mt-15 leading-tight animate-fade-in-up">
            <TextAnimate by="word" animation="slideUp" startOnView={true}>
              Clarity for Every Step In Medicine
            </TextAnimate>
          </h1>
          <WordRotate className="text-6xl md:text-6xl font-bold mb-6 leading-tight " words={["Mentorship", "Guidance", "Real Insights", "Community", "Real Experiences"]} />

          <TextAnimate by="word" animation="slideUp" delay={0.5} startOnView={true} className="text-xl text-gray-400 mb-8">
            Simplifying your Medical University Life
          </TextAnimate>

          <Link href="/newsletter" className="flex items-center justify-center">
            <ShimmerButton className="px-8 py-4">
              Join Our Newsletter
            </ShimmerButton>
          </Link>
        </div>
        <ShootingStars starColor="#ffffffff" trailColor="#c4c4c4ff" />
        <StarsBackground />
      </section>

      {/* About section */}
      <section className="pt-20 pb-32 px-6 flex items-center justify-center">
        <div className="max-w-5xl mx-auto flex flex-col items-center justify-top text-center">
          <h2 className="text-6xl md:text-6xl font-bold leading-tight animate-fade-in-up mb-10">
            <TextAnimate
              by="word"
              animation="fadeIn"
              startOnView={true}
            >
              About Us
            </TextAnimate>
          </h2>
          <div className="shadow-[0_0_10px_3px_rgba(255,255,255,0.2)] flex flex-row gap-10 items-center justify-center border border-gray-900 rounded-lg p-10 ">
            <div className="flex-1">
              <TextAnimate by="line" as="p" delay={0.5} className="text-xl text-gray-400 mb-8 animate-fade-in-up animation-delay-200">
                {`Medblend is a platform that aims to provide\n\nclarity for every step in medicine. We provide\n\nmentorship, guidance, real insight,\n\ncommunity, and real experiences to help you succeed in your medical journey.`}
              </TextAnimate>
            </div>

            <motion.div
              className="flex-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2 }}
            >
              <Image
                src="/about-us-picture.jpeg"
                alt="About"
                width={400}
                height={400}
                className="rounded-lg w-full h-auto object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="pt-32 pb-20 px-6 min-h-screen">
        <h2 className="text-6xl md:text-6xl font-bold leading-tight mb-10 text-center">
          <TextAnimate
            by="word"
            animation="fadeIn"
            startOnView={true}
          >
            Features
          </TextAnimate>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pl-40 pr-40">
          <FeatureDiv
            icon={LuMessageCircle}
            heading="Share team inboxes"
            description="Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same page and in the loop."
          />
          <FeatureDiv
            icon={LuMessageCircle}
            heading="Team Collaboration"
            description="Work together seamlessly with your team."
          />
          <FeatureDiv
            icon={LuMessageCircle}
            heading="Real-time Updates"
            description="Stay informed with instant notifications."
          />
        </div>
      </section>

    </div>
  );
}
