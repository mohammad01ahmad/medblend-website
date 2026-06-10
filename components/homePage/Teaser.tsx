// Extracted data to keep the JSX clean and maintainable
const problemCards = [
    {
        num: '01',
        icon: '🌀',
        quote: '"I had no idea what first year would actually feel like."',
        desc: "Generic content can't prepare you for reality. Students consistently report being blindsided by the lifestyle, workload, and mental toll of medicine.",
        animationClass: 'reveal',
    },
    {
        num: '02',
        icon: '🔍',
        quote: '"I didn\'t know which specialty was right for me until year three."',
        desc: 'Career decisions that take years to uncover could be clarified in a single honest conversation with someone already in that specialty.',
        animationClass: 'reveal d1',
    },
    {
        num: '03',
        icon: '💬',
        quote: '"I was asking Reddit for advice on the biggest decision of my life."',
        desc: "Anonymous forums aren't mentorship. Real guidance requires real relationships with verified people who've lived the journey.",
        animationClass: 'reveal d2',
    },
    {
        num: '04',
        icon: '😶',
        quote: '"I felt completely isolated — like everyone had a roadmap except me."',
        desc: 'Pre-med is lonely. Competition culture makes vulnerability taboo. Students struggle in silence when they should be growing together.',
        animationClass: 'reveal d3',
    },
];

export default function ProblemSection() {
    return (
        <section
            id="problem"
            className="relative bg-[var(--ink)] px-[clamp(1.5rem,6vw,6rem)] py-[clamp(5rem,10vw,9rem)] text-white"
        >
            <div className="mx-auto max-w-[1200px]">
                {/* Section Header */}
                <div className="mb-16 max-w-[700px]">
                    <div className="reveal mb-6 inline-flex items-center gap-2">
                        <div className="h-px w-6 bg-emerald-500"></div>
                        <span className="font-syne text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--white-dim)]">
                            The Problem
                        </span>
                    </div>

                    <h2 className="reveal d1 mb-[1.2rem] font-syne text-[clamp(2.2rem,5vw,4rem)] leading-[1.1]">
                        You're making one of the biggest decisions of your life{' '}
                        <em className="font-instrument italic text-emerald-500">
                            completely alone.
                        </em>
                    </h2>

                    <p className="reveal d2 max-w-[480px] text-[1.1rem] leading-[1.7] text-[var(--white-dim)]">
                        Most pre-med students rely on Reddit threads, outdated YouTube
                        videos, and guesswork. There's no structured way to reach people
                        who've actually been there.
                    </p>
                </div>

                {/* Cards Grid Container */}
                <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[1.5px] overflow-hidden rounded-4xl border border-white/10 bg-[var(--ink)]">
                    {problemCards.map((card) => (
                        <div
                            key={card.num}
                            className={`prob-card ${card.animationClass} relative bg-black p-10 transition-colors duration-300 hover:bg-[#0f0f18]`}
                        >
                            <div className="mb-6 font-syne text-[0.68rem] font-semibold tracking-[0.2em] text-[var(--pulse)]">
                                {card.num}
                            </div>

                            <div className="absolute right-10 top-10 text-[1.5rem] opacity-40">
                                {card.icon}
                            </div>

                            <p className="mb-4 font-instrument text-[1.4rem] leading-[1.4]">
                                {card.quote}
                            </p>

                            <p className="text-[0.88rem] leading-[1.7] text-[var(--white-dim)]">
                                {card.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}