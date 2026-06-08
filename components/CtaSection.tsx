import Link from 'next/link';

export default function CtaSection() {
  return (
    <section
      id="cta"
      className="relative overflow-hidden border-y border-white/10 bg-[var(--ink)] px-[clamp(1.5rem,6vw,6rem)] py-[clamp(4rem,8vw,6rem)] text-white"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--sage-soft),transparent_65%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-[800px] text-center">
        <div className="reveal mb-6 inline-flex items-center gap-2">
          <div className="h-px w-6 bg-[var(--pulse)]" />
          <span className="font-syne text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--white-dim)]">
            Early Access
          </span>
          <div className="h-px w-6 bg-[var(--pulse)]" />
        </div>

        <h2 className="reveal d1 font-syne text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.1]">
          Ready to enter medicine{' '}
          <em className="font-instrument italic text-[var(--sage)]">knowing what to expect?</em>
        </h2>

        <p className="reveal d2 mx-auto mt-5 max-w-[520px] text-[1.05rem] leading-[1.7] text-[var(--white-dim)]">
          Join 500+ aspiring medical students already on the waitlist. Real mentors, real answers,
          no guesswork.
        </p>

        <div className="reveal d3 mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/waitlist"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--pulse)] px-8 py-3.5 font-syne text-sm font-semibold text-white shadow-[0_0_30px_var(--pulse-glow)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--sage)] hover:shadow-[0_0_40px_var(--pulse-glow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sage)]"
          >
            Join the Waitlist →
          </Link>
          <a
            href="/#team"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-3.5 font-syne text-sm font-semibold text-white transition-colors hover:border-[var(--sage-glow)] hover:text-[var(--sage)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pulse)]"
          >
            Meet the team
          </a>
        </div>
      </div>
    </section>
  );
}
