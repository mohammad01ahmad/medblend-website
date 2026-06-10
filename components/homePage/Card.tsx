import React from 'react';

// Mock data to keep the JSX clean and scalable
const problemCards = [
    {
        num: '01',
        icon: '🌀',
        quote: '"I had no idea what first year would actually feel like."',
        desc: "Generic content can't prepare you for reality. Students consistently report being blindsided by the lifestyle, workload, and mental toll of medicine.",
        delayClass: '',
    },
    {
        num: '02',
        icon: '🔍',
        quote: '"I didn\'t know which specialty was right for me until year three."',
        desc: 'Career decisions that take years to uncover could be clarified in a single honest conversation with someone already in that specialty.',
        delayClass: 'delay-100', // Replaces .d1
    },
    {
        num: '03',
        icon: '💬',
        quote: '"I was asking Reddit for advice on the biggest decision of my life."',
        desc: "Anonymous forums aren't mentorship. Real guidance requires real relationships with verified people who've lived the journey.",
        delayClass: 'delay-200', // Replaces .d2
    },
    {
        num: '04',
        icon: '😶',
        quote: '"I felt completely isolated — like everyone had a roadmap except me."',
        desc: 'Pre-med is lonely. Competition culture makes vulnerability taboo. Students struggle in silence when they should be growing together.',
        delayClass: 'delay-300', // Replaces .d3
    },
];

export default function Card() {
    return (
        // Replaces #problem { background: var(--ink) }
        <section className="bg-[var(--ink)] py-16 px-4 md:px-8">

            {/* Replaces .prob-head */}
            <div className="max-w-[700px] mb-16 mx-auto lg:mx-0">
                {/* Replaces .prob-h2 (using fluid text simulation or standard sizing) */}
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-none mb-5 text-[var(--foreground)]">
                    The Problem
                </h2>
                {/* Replaces .prob-lead */}
                <p className="text-lg text-[var(--white-dim)] max-w-[480px] leading-relaxed">
                    Navigating your journey shouldn't feel like guesswork. Here is what students frequently experience.
                </p>
            </div>

            {/* Replaces .prob-cards Grid container */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[1.5px] bg-[var(--border)] border border-[var(--border)] rounded-[var(--r-lg)] overflow-hidden">
                {problemCards.map((card) => (
                    <div
                        key={card.num}
                        className={`prob-card reveal ${card.delayClass} relative bg-[var(--ink)] p-10 transition-colors duration-300 hover:bg-[#0f0f18]`}
                    >
                        {/* Replaces .prob-num */}
                        <div className="font-['Syne',sans-serif] text-[0.68rem] font-semibold tracking-[0.2em] text-[var(--pulse)] mb-6">
                            {card.num}
                        </div>

                        {/* Replaces .prob-icon */}
                        <div className="absolute top-10 right-10 text-2xl opacity-40">
                            {card.icon}
                        </div>

                        {/* Replaces .prob-quote */}
                        <p className="font-['Instrument_Serif',serif] text-2xl italic leading-tight mb-4 text-[var(--foreground)]">
                            {card.quote}
                        </p>

                        {/* Replaces .prob-desc */}
                        <p className="text-[0.88rem] text-[var(--white-dim)]Sub text-slate-400 leading-relaxed">
                            {card.desc}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}