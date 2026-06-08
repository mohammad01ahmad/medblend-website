import Image from 'next/image';

const featuresData = [
    {
        icon: '/handshake.png',
        title: '1-on-1 Async Spaces',
        desc: 'Drop deep questions without the pressure of a live call. Mentors respond with voice notes, long-form reviews, or tactical roadmaps when they are off-duty.',
        accentColor: 'via-[var(--pulse)]',
        animationClass: 'reveal',
    },
    {
        icon: '/Verified.png',
        title: 'Verified Backgrounds',
        desc: 'Every contributor uploads institutional verification. Know instantly if you\'re talking to an M1, an orthopedic resident, or a chief fellow.',
        accentColor: 'via-[var(--sage)]',
        animationClass: 'reveal d1',
    },
    {
        icon: '/bars.png',
        title: 'Specialty Breakdowns',
        desc: 'Browse authentic day-in-the-life logs detailing real hours, actual call schedules, compensation, and emotional highs/lows across 40+ paths.',
        accentColor: 'via-[var(--ember)]',
        animationClass: 'reveal d2',
    },
];

export default function FeaturesSection() {
    return (
        <section id="features" className="relative px-[clamp(1.5rem,6vw,6rem)] py-[clamp(5rem,10vw,9rem)] text-white">
            <div className="mx-auto max-w-[1200px]">

                {/* Section Header */}
                <div className="mb-16 max-w-[700px]">
                    <div className="reveal mb-6 inline-flex items-center gap-2">
                        <div className="h-px w-6 bg-[var(--pulse)]"></div>
                        <span className="font-syne text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--white-dim)]">
                            Features
                        </span>
                    </div>

                    <h2 className="reveal d1 mb-[1.2rem] font-syne text-[clamp(2.2rem,5vw,4rem)] leading-[1.1]">
                        Everything you need to find{' '}
                        <em className="font-instrument italic text-[var(--sage)]">
                            your blend.
                        </em>
                    </h2>

                    <p className="reveal d2 max-w-[480px] text-[1.1rem] leading-[1.7] text-[var(--white-dim)]">
                        We're stripping away the noise of anonymous forums and replacing it
                        with direct, structured, and verified clarity.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {featuresData.map((feat, index) => (

                        <div
                            key={index}
                            className={`${feat.animationClass} group relative overflow-hidden rounded-[var(--radius-2xl)] border border-gray-700 bg-black p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(255,255,255,0.15)]`}
                        >
                            {/* Feature Icon */}
                            <div className="mb-6">
                                <Image src={feat.icon} alt={feat.title} width={64} height={64} className="object-contain" />
                            </div>

                            {/* Feature Title */}
                            <h3 className="mb-3 font-syne text-xl font-semibold">
                                {feat.title}
                            </h3>

                            {/* Feature Description */}
                            <p className="mb-6 text-[0.9rem] leading-relaxed text-[var(--white-dim)]">
                                {feat.desc}
                            </p>

                            {/* Interactive bottom accent border on hover */}
                            <div
                                className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent ${feat.accentColor} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                            ></div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}