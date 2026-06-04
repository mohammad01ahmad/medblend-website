import { TextAnimate } from "@/components/ui/text-animate";
import Teammembercard from "./Teammembercard";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Team() {
    return (
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
    )
}