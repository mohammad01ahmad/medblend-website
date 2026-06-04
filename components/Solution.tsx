const pillars = [
    {
        icon: '🎯',
        iconBg: 'bg-[var(--pulse-soft)]',
        title: 'Verified Mentors',
        desc: 'Every mentor is verified — real students, real residents, real doctors. No fake profiles, no incentivized advice.',
    },
    {
        icon: '🔥',
        iconBg: 'bg-[var(--ember-glow)]',
        title: 'Honest Conversations',
        desc: 'Get answers about workload, lifestyle, mental health, and money — the stuff nobody else talks about openly.',
    },
    {
        icon: '🌱',
        iconBg: 'bg-[var(--sage-glow)]',
        title: 'Community Growth',
        desc: 'Join a movement of students who believe medicine is better when shared — not hoarded.',
    },
];

export default function SolutionSection() {
    return (
        <section
            id="solution"
            className="relative bg-[var(--void)] px-[clamp(1.5rem,6vw,6rem)] py-[clamp(5rem,10vw,9rem)] text-white"
        >
            <div className="mx-auto max-w-[1200px]">
                {/* Replaces .sol-layout (Handles the 1024px media query) */}
                <div className="grid grid-cols-1 gap-16 items-center lg:grid-cols-2 lg:gap-24">

                    {/* Left Column: Copy & Pillars */}
                    <div>
                        <div className="reveal mb-6 inline-flex items-center gap-2">
                            <div className="h-px w-6 bg-emerald-500"></div>
                            <span className="font-['Syne',sans-serif] text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--white-dim)]">
                                Our Approach
                            </span>
                        </div>

                        <h2 className="reveal d1 mb-6 font-['Syne',sans-serif] text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.1]">
                            The guidance system medicine has always{' '}
                            <em className="font-['Instrument_Serif',serif] italic text-emerald-400">
                                needed.
                            </em>
                        </h2>

                        <p className="reveal d2 mb-8 text-[1.05rem] leading-[1.8] text-[var(--white-dim)]">
                            MedBlend is the platform where aspiring doctors connect with
                            medical students, residents, and attending physicians — people
                            who've navigated exactly what you're facing.
                        </p>

                        <div className="reveal d3 flex flex-col gap-[1px] overflow-hidden rounded-[var(--radius-4xl)] border border-gray-600 bg-black">
                            {pillars.map((pillar, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-4 bg-[var(--void)] p-[1.3rem_1.5rem] transition-colors duration-250 hover:bg-[var(--white-06)]"
                                >
                                    <div
                                        className={`flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[var(--radius-xs)] text-[1rem] ${pillar.iconBg}`}
                                    >
                                        {pillar.icon}
                                    </div>
                                    <div>
                                        <h4 className="mb-1 font-['Syne',sans-serif] text-[0.9rem] font-semibold">
                                            {pillar.title}
                                        </h4>
                                        <p className="text-[0.82rem] leading-[1.5] text-[var(--white-dim)]">
                                            {pillar.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="reveal d4 mt-8">
                            <a href="#waitlist" className="btn-primary inline-flex items-center gap-2 rounded-[var(--radius-4xl)] border-none bg-emerald-500 px-[2.2rem] py-[0.95rem] font-['Syne',sans-serif] text-[0.95rem] font-semibold text-white shadow-[0_0_30px_var(--pulse-glow),0_8px_24px_rgba(61,110,255,0.3)] transition-all duration-300 ease-[var(--ease-out)] hover:-translate-y-[3px] hover:shadow-[0_0_50px_var(--pulse-glow),0_16px_40px_rgba(61,110,255,0.4)]">
                                Get early access →
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Visual Card Stack */}
                    <div className="reveal-right d2 group relative w-full">
                        <div className="relative h-[300px] lg:h-[420px]">

                            {/* Card 1 (sc1) */}
                            <div className="absolute bottom-0 left-0 w-[85%] -rotate-2 rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--ink)] p-[1.8rem] transition-transform duration-300 ease-[var(--ease-out)] group-hover:-rotate-3 group-hover:translate-y-1">
                                <div className="mb-4 flex items-center gap-[10px]">
                                    <div
                                        className="flex h-[38px] w-[38px] items-center justify-center rounded-full text-[0.8rem] font-semibold"
                                        style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)' }}
                                    >
                                        DK
                                    </div>
                                    <div>
                                        <div className="font-['Syne',sans-serif] text-[0.85rem] font-semibold">
                                            Dr. Khalid, MD
                                        </div>
                                        <div className="text-[0.72rem] text-[var(--white-dim)]">
                                            Cardiologist · 12 years in medicine
                                        </div>
                                    </div>
                                </div>
                                <div className="text-[0.88rem] italic leading-[1.6] text-[var(--white-dim)]">
                                    "I wish I had something like this when I was a pre-med. The
                                    isolation is real — and completely unnecessary."
                                </div>
                            </div>

                            {/* Card 2 (sc2) */}
                            <div className="absolute left-[30px] top-[40px] z-10 w-[85%] rotate-1 rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--ink)] p-[1.8rem] transition-transform duration-300 ease-[var(--ease-out)] group-hover:rotate-2 group-hover:-translate-y-1">
                                <div className="mb-4 flex items-center gap-[10px]">
                                    <div
                                        className="flex h-[38px] w-[38px] items-center justify-center rounded-full text-[0.8rem] font-semibold"
                                        style={{ background: 'linear-gradient(135deg,#f093fb,#f5576c)' }}
                                    >
                                        SR
                                    </div>
                                    <div>
                                        <div className="font-['Syne',sans-serif] text-[0.85rem] font-semibold">
                                            Sara, MS2
                                        </div>
                                        <div className="text-[0.72rem] text-[var(--white-dim)]">
                                            2nd Year Medical Student
                                        </div>
                                    </div>
                                </div>
                                <div className="text-[0.88rem] italic leading-[1.6] text-[var(--white-dim)]">
                                    "One conversation with a third-year changed how I thought
                                    about <strong className="font-normal text-white">Step 1 prep entirely.</strong>"
                                </div>
                            </div>

                            {/* Card 3 (sc3) */}
                            <div className="absolute right-0 top-0 z-20 w-[75%] rounded-[var(--r-md)] border border-[var(--border)] bg-[var(--ink)] p-[1.8rem] transition-transform duration-300 ease-[var(--ease-out)]">
                                <div className="mb-4 flex items-center gap-[10px]">
                                    <div
                                        className="flex h-[38px] w-[38px] items-center justify-center rounded-full text-[0.8rem] font-semibold"
                                        style={{ background: 'linear-gradient(135deg,#43e97b,#38f9d7)' }}
                                    >
                                        JA
                                    </div>
                                    <div>
                                        <div className="font-['Syne',sans-serif] text-[0.85rem] font-semibold">
                                            James, Pre-Med
                                        </div>
                                        <div className="text-[0.72rem] text-[var(--white-dim)]">
                                            Junior · Biology Major
                                        </div>
                                    </div>
                                </div>
                                <div className="text-[0.88rem] italic leading-[1.6] text-[var(--white-dim)]">
                                    "I finally know what to actually expect. MedBlend made me feel
                                    like <strong className="font-normal text-white">someone gets it.</strong>"
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}