import { TextAnimate } from "@/components/ui/text-animate";
import Teammembercard from "./Teammembercard";
import Image from "next/image";
import { motion } from "motion/react";

const teamMembers = [
    {
        name: "Omar Oqaili",
        role: "CEO & Founder",
        linkedin: "https://www.linkedin.com/in/omar-oqaili-b51692231",
        image: "/omar-picture.jpeg",
        alt: "Omar Oqaili",
        delay: 0.1,
    },
    {
        name: "Rima Khattab",
        role: "Director of Marketing",
        linkedin: "https://www.linkedin.com/in/rima-khattab",
        image: "/reema-picture.jpeg",
        alt: "Rima Khattab",
        delay: 0.2,
    },
    {
        name: "Muhammad Ahmad",
        role: "Chief Technology Officer",
        linkedin: "https://www.linkedin.com/in/muhammad-ahmad-358b8a28a",
        image: "/ahmad2.jpeg",
        alt: "Muhammad Ahmad",
        delay: 0.3,
    },
];

export default function Team() {
    return (
        <section
            id="team"
            className="relative bg-[var(--void)] px-[clamp(1.5rem,6vw,6rem)] py-[clamp(4rem,8vw,7rem)] text-white"
        >
            <div className="mx-auto max-w-[1200px]">
                {/* Section header — matches Features / Solution */}
                <div className="mb-14 text-center sm:mb-16">
                    <div className="reveal mb-6 inline-flex items-center gap-2">
                        <div className="h-px w-6 bg-[var(--pulse)]" />
                        <span className="font-syne text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--white-dim)]">
                            Team Members
                        </span>
                        <div className="h-px w-6 bg-[var(--pulse)]" />
                    </div>

                    <h2 className="reveal d1 font-syne text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1]">
                        <TextAnimate by="word" animation="fadeIn" startOnView={true} once={true}>
                            Meet The People Behind
                        </TextAnimate>{' '}
                        <em className="font-instrument italic text-[var(--sage)]">
                            MedBlendApp
                        </em>
                    </h2>

                    <p className="reveal d2 mx-auto mt-5 max-w-[520px] text-[1.05rem] leading-[1.7] text-[var(--white-dim)]">
                        Students and builders who believe medicine is better when guidance is
                        honest, verified, and shared.
                    </p>
                </div>

                {/* Team grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8">
                    {teamMembers.map((member) => (
                        <motion.article
                            key={member.name}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.55, delay: member.delay, ease: [0.22, 1, 0.36, 1] }}
                            className="group relative"
                        >
                            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[var(--ink)] p-1 transition-all duration-300 hover:-translate-y-1.5 hover:border-[var(--sage-glow)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.45),0_0_40px_var(--pulse-glow)]">
                                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] sm:aspect-square">
                                    <Image
                                        src={member.image}
                                        alt={member.alt}
                                        width={400}
                                        height={400}
                                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                                    />

                                    {/* Image overlays */}
                                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12),transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                    <Teammembercard
                                        name={member.name}
                                        role={member.role}
                                        linkedin={member.linkedin}
                                    />
                                </div>

                                {/* Hover accent line */}
                                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--pulse)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
