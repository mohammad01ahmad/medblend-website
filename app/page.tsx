import Image from "next/image";
import Link from "next/link";
import { WordRotate } from "@/components/ui/word-rotate";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";
import { TextAnimate } from "@/components/ui/text-animate";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-['Inter']">
      <DotPattern
        glow={true}
        cr={2}
        className={cn(
          "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]"
        )}
      />

      {/* Hero section  */}
      <section className="pt-32 pb-20 px-6 min-h-screen flex items-center justify-center animate-fade-in-up">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-6xl md:text-6xl font-bold mb-6 mt-15 leading-tight animate-fade-in-up">
            Clarity for Every Step In Medicine <WordRotate words={["Mentorship", "Guidance", "Real Insights", "Community", "Real Experiences"]} />
          </h1>
          <p className="text-xl text-gray-400 mb-8 animate-fade-in-up animation-delay-200">
            Simplifying your Medical University Life
          </p>
          <Link href="/#" className="cursor-pointer flex items-center justify-center">
            <ShimmerButton className="px-8 py-4 cursor-pointer">
              Get Started
            </ShimmerButton>
          </Link>
        </div>
      </section>

      {/* About section */}
      <section className="pt-20 pb-32 px-6 flex items-center justify-center">
        <div className="max-w-5xl mx-auto flex flex-col items-center justify-top text-center">
          <h2 className="text-6xl md:text-6xl font-bold leading-tight animate-fade-in-up mb-5">
            <TextAnimate
              by="word"
              animation="fadeIn"
              startOnView={true}
            >
              About Us
            </TextAnimate>
          </h2>
          <NeonGradientCard
            className="w-full max-w-6xl mx-auto mt-5 rounded-lg p-8"
            neonColors={{
              firstColor: "#0F0C08",
              secondColor: "#353E43",
            }}
          >
            <div className="grid md:grid-cols-2 gap-12 border border-gray-600 items-center">
              <div>
                <p className="text-lg text-gray-700 mb-4">
                  Universitifier is transforming the way students complete their assignment and study for exams.
                </p>
                <p className="text-lg text-gray-700">
                  We believe in making tools that students really need to save time and energy.
                </p>
              </div>
              <div className="relative w-full h-64 rounded-lg overflow-hidden">
                <Image
                  src="/about-us-picture.jpeg"
                  alt="University Students Working on Assignment"
                  fill
                  className="rounded-lg object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </NeonGradientCard>
        </div>
      </section>

    </div>
  );
}
