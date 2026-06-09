'use client';

import { useState } from 'react';

interface FAQItem {
    question: string;
    answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
    {
        question: 'What exactly is MedBlend?',
        answer: 'MedBlend is a mentorship and community platform that connects pre-med students with medical students, residents, and doctors. Think of it as the honest, human layer that medical education has always been missing — real conversations, real guidance, real community.',
    },
    {
        question: 'Who can join MedBlend?',
        answer: 'Anyone on the medical journey — from high schoolers exploring medicine to pre-meds preparing for the MCAT, medical students navigating rotations, and beyond. We also welcome residents and physicians who want to mentor the next generation.',
    },
    {
        question: 'Is MedBlend free?',
        answer: "We're still finalizing our model. Early access members will receive exclusive pricing and benefits. Our goal is to make quality guidance as accessible as possible — it shouldn't be a privilege.",
    },
    {
        question: 'When does the platform launch?',
        answer: "We're targeting a beta launch in late 2026. Waitlist members get early access before the general public, with priority onboarding and direct input into shaping the platform.",
    },
    {
        question: 'How are mentors verified?',
        answer: 'All mentors go through a verification process to confirm their medical school enrollment, residency, or physician status. We take authenticity seriously — no fake profiles, no misinformation.',
    },
    {
        question: 'How is MedBlend different from Reddit or SDN?',
        answer: "Reddit and SDN are anonymous forums. MedBlend is a structured mentorship platform with verified people, real relationships, and intentional community design. It's the difference between shouting into a crowd and having an actual conversation.",
    },
    {
        question: 'Can I follow MedBlend on social media?',
        answer: "Yes! Follow us on Instagram @medblendapp for updates, student stories, and behind-the-scenes from the build. We're building in public and love hearing from the community.",
    },
];

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        // If clicked item is already open, close it; otherwise open it and close others
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="bg-[var(--void)] py-16 md:py-30 overflow-hidden">
            {/* section-inner wrapper container */}
            <div className="max-w-[1200px] mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-12 md:gap-24 items-start">

                    {/* Left Block Content Columns */}
                    <div className="flex flex-col items-start text-left">
                        <div className="reveal flex items-center gap-3 mb-[1.2rem]">
                            <div className="w-8 h-px bg-[var(--border)]" />
                            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--pulse)]">FAQ</span>
                        </div>

                        <h2 className="reveal d1 text-[clamp(2rem,4vw,3rem)] font-bold font-syne leading-[1.1] text-white mb-4 tracking-tight">
                            Questions?<br />We&apos;ve got<br />answers.
                        </h2>

                        <p className="reveal d2 text-[0.95rem] text-[var(--white-dim)] leading-[1.7] mb-8 max-w-sm">
                            Can&apos;t find what you&apos;re looking for? We&apos;re happy to help.
                        </p>

                        <a
                            href="mailto:medblendapp@gmail.com"
                            className="reveal d3 btn-ghost inline-flex items-center justify-center gap-2 border border-white/15 px-6 py-3 rounded-full text-sm font-semibold hover:bg-white/5 transition-all text-white"
                        >
                            Email us →
                        </a>
                    </div>

                    {/* Interactive Accordion Stream Node */}
                    <div className="flex flex-col w-full">
                        {FAQ_ITEMS.map((item, index) => {
                            const isOpen = openIndex === index;
                            const delays = ['', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6'];
                            const delayClass = delays[index % delays.length];

                            return (
                                <div
                                    key={index}
                                    className={`reveal ${delayClass} border-b-[0.5px] border-gray-700 overflow-hidden transition-all duration-300`.trim()}
                                >
                                    {/* Question Row Header Click Target */}
                                    <button
                                        onClick={() => toggleFaq(index)}
                                        className="w-full flex justify-between items-center py-[1.25rem] text-left font-syne text-[0.95rem] font-semibold text-white select-none gap-4 transition-colors duration-200 hover:text-[var(--pulse)] group"
                                    >
                                        <span>{item.question}</span>

                                        {/* Circle Status Node Indicator */}
                                        <div
                                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[0.85rem] shrink-0 font-mono transition-all duration-300 ease-[var(--ease-out)]
                        ${isOpen
                                                    ? 'rotate-45 bg-[var(--pulse-soft)] text-[var(--pulse)]'
                                                    : 'bg-[var(--white-06)] text-white group-hover:text-[var(--pulse)] group-hover:bg-white/10'
                                                }`}
                                        >
                                            +
                                        </div>
                                    </button>

                                    {/* Collapsible Answer Body Box */}
                                    <div
                                        className="overflow-hidden transition-all duration-500 ease-[var(--ease-out)]"
                                        style={{
                                            maxHeight: isOpen ? '200px' : '0px',
                                            paddingBottom: isOpen ? '1.25rem' : '0px'
                                        }}
                                    >
                                        <p className="text-[0.9rem] text-[var(--white-dim)] leading-[1.7]">
                                            {item.answer}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </section>
    );
}