import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import { TextAnimate } from "@/components/ui/text-animate";
import { WordRotate } from "@/components/ui/word-rotate";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { useRouter } from "next/navigation";


export default function Hero() {

    const router = useRouter();
    const handleClick = () => {
        router.push("/waitlist");
    }
    return (
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
    );
}