const statsData = [
    {
        num: '500+',
        label: 'Students on waitlist',
        theme: 'accent',
        animationClass: 'reveal',
    },
    {
        num: '3',
        label: 'Founding team members',
        theme: 'default',
        animationClass: 'reveal d1',
    },
    {
        num: '∞',
        label: 'Questions that deserve real answers',
        theme: 'default',
        animationClass: 'reveal d2',
    },
    {
        num: '1',
        label: 'Mission: Make medicine human again',
        theme: 'accent',
        animationClass: 'reveal d3',
    },
];

export default function StatsSection() {
    return (
        <section
            id="stats"
            className="bg-[var(--void)] px-[clamp(1.5rem,6vw,6rem)] py-16 text-white"
        >
            {/* Replaces .stats-grid */}
            <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-[1.5px] overflow-hidden rounded-[var(--radius-4xl)] border border-gray-600 bg-black lg:grid-cols-4">
                {statsData.map((stat, index) => (
                    /* Replaces .stat-cell */
                    <div
                        key={index}
                        className={`${stat.animationClass} bg-[var(--void)] p-[2rem_1rem] sm:p-[3rem_2rem] text-center`}
                    >
                        {/* Replaces .stat-num and .stat-num.blue */}
                        <div
                            className={`mb-2 font-syne text-[clamp(1.75rem,4vw,3.5rem)] tracking-wide font-bold leading-none text-transparent bg-clip-text [-webkit-text-fill-color:transparent] ${stat.theme === 'accent'
                                ? 'bg-[linear-gradient(135deg,var(--pulse),var(--sage))]'
                                : 'bg-[linear-gradient(135deg,white,rgba(255,255,255,0.6))]'
                                }`}
                        >
                            {stat.num}
                        </div>

                        {/* Replaces .stat-lbl */}
                        <div className="text-[0.85rem] text-[var(--white-dim)]">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}