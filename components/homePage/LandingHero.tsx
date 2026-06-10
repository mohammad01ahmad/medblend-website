'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { WordRotate } from '../ui/word-rotate';

const Dna3DCanvas = dynamic(() => import('@/components/ui/dna-3d-canvas'), { ssr: false });

const FOUNDING_TEAM = [
  { name: 'Omar Oqaili', role: 'CEO & Founder', image: '/omar-picture.jpeg' },
  { name: 'Rima Khattab', role: 'Director of Marketing', image: '/reema-picture.jpeg' },
  { name: 'Muhammad Ahmad', role: 'Chief Technology Officer', image: '/ahmad2.jpeg' },
] as const;

export default function LandingHero() {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const sliderBtnRef = useRef<HTMLDivElement>(null);
  const sliderTrackRef = useRef<HTMLDivElement>(null);
  const sliderTextRef = useRef<HTMLSpanElement>(null);
  const arrowIconRef = useRef<SVGSVGElement>(null);

  const [cardSize, setCardSize] = useState({ w: 950, h: 730 });

  // update card size on resize
  useEffect(() => {
    if (!cardRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setCardSize({ w: entry.contentRect.width, h: entry.contentRect.height });
      }
    });
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  // ── Slider drag ─────────────────────────────────────────────────────────
  useEffect(() => {
    const sliderBtn = sliderBtnRef.current;
    const sliderTrack = sliderTrackRef.current;
    const sliderText = sliderTextRef.current;
    const arrowIcon = arrowIconRef.current;
    if (!sliderBtn || !sliderTrack || !sliderText || !arrowIcon) return;

    let isDragging = false;
    let startX = 0;
    let maxOffset = 0;
    let currentOffset = 0;
    let isSuccess = false;

    const initSlider = () => {
      maxOffset = sliderTrack.clientWidth - sliderBtn.clientWidth - 8;
    };
    initSlider();
    window.addEventListener('resize', initSlider);

    const onDragStart = (e: MouseEvent | TouchEvent) => {
      if (isSuccess) return;
      isDragging = true;
      startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      sliderBtn.style.transition = 'none';
      e.preventDefault();
    };

    const onDragMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || isSuccess) return;
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      currentOffset = Math.max(0, Math.min(x - startX, maxOffset));
      sliderBtn.style.transform = `translateX(${currentOffset}px)`;
      const opacity = 1 - (currentOffset / maxOffset) * 1.2;
      sliderText.style.opacity = String(Math.max(0, opacity));
    };

    const onDragEnd = () => {
      if (!isDragging || isSuccess) return;
      isDragging = false;
      if (currentOffset >= maxOffset * 0.85) {
        isSuccess = true;
        sliderBtn.style.transition = 'transform 0.25s cubic-bezier(0.25,1,0.5,1)';
        sliderBtn.style.transform = `translateX(${maxOffset}px)`;
        sliderText.textContent = 'Welcome to MedBlend!';
        sliderText.style.opacity = '1';
        sliderTrack.classList.add('lh-slider--success');
        arrowIcon.style.transform = 'rotate(360deg)';

        setTimeout(() => {
          router.push('/waitlist');
        }, 800);
      } else {
        sliderBtn.style.transition = 'transform 0.3s ease-out';
        sliderBtn.style.transform = 'translateX(0px)';
        sliderText.style.opacity = '1';
        currentOffset = 0;
      }
    };

    sliderBtn.addEventListener('mousedown', onDragStart as EventListener);
    window.addEventListener('mousemove', onDragMove as EventListener);
    window.addEventListener('mouseup', onDragEnd);
    sliderBtn.addEventListener('touchstart', onDragStart as EventListener, { passive: false });
    window.addEventListener('touchmove', onDragMove as EventListener, { passive: false });
    window.addEventListener('touchend', onDragEnd);

    return () => {
      window.removeEventListener('resize', initSlider);
      sliderBtn.removeEventListener('mousedown', onDragStart as EventListener);
      window.removeEventListener('mousemove', onDragMove as EventListener);
      window.removeEventListener('mouseup', onDragEnd);
      sliderBtn.removeEventListener('touchstart', onDragStart as EventListener);
      window.removeEventListener('touchmove', onDragMove as EventListener);
      window.removeEventListener('touchend', onDragEnd);
    };
  }, []);

  const { w, h } = cardSize;
  const scale = w < 768 ? w / 950 : 1;
  const cTR = 322 * scale;
  const cBL = 322 * scale;
  const r = 32 * scale;
  const dynamicPath = `M 0,${r} A ${r},${r} 0 0,1 ${r},0 L ${w - cTR},0 A ${r},${r} 0 0,1 ${w - cTR + r},${r} L ${w - cTR + r},${43 * scale} A ${r},${r} 0 0,0 ${w - cTR + r + 32 * scale},${75 * scale} L ${w - r},${75 * scale} A ${r},${r} 0 0,1 ${w},${75 * scale + r} L ${w},${h - r} A ${r},${r} 0 0,1 ${w - r},${h} L ${cBL},${h} A ${r},${r} 0 0,1 ${cBL - r},${h - r} L ${cBL - r},${h - 43 * scale} A ${r},${r} 0 0,0 ${cBL - r - 32 * scale},${h - 75 * scale} L ${r},${h - 75 * scale} A ${r},${r} 0 0,1 0,${h - 75 * scale - r} Z`;

  return (
    <section
      id="landing-hero"
      className={cn(
        'relative flex w-full items-center justify-center overflow-hidden bg-background font-sans text-white',
        'xl:h-screen',
        'md:max-xl:h-screen md:max-xl:items-stretch md:max-xl:justify-start md:max-xl:overflow-hidden',
        'max-md:h-auto max-md:min-h-svh max-md:items-stretch max-md:justify-start max-md:overflow-visible',
        'max-md:pt-[max(10px,env(safe-area-inset-top))] max-md:px-3 max-md:pb-[max(16px,env(safe-area-inset-bottom))]',
        'max-sm:px-2',
        'max-md:landscape:min-h-0',
      )}
    >
      <div
        className={cn(
          'relative flex shrink-0 origin-center overflow-hidden bg-black',
          'xl:h-full xl:w-full xl:rounded-none xl:border-0 xl:shadow-none',
          'md:max-xl:h-full md:max-xl:w-full md:max-xl:flex-col md:max-xl:rounded-none md:max-xl:border-0',
          'max-md:h-auto max-md:w-full max-md:flex-col max-md:rounded-3xl max-md:border max-md:border-white/15',
          'max-md:shadow-[0_16px_48px_rgba(0,0,0,0.75),0_0_60px_var(--pulse-glow)]',
        )}
      >
        {/* Left Sidebar */}
        <aside
          className={cn(
            'relative z-10 flex shrink-0 flex-col justify-between bg-black',
            'xl:h-full xl:w-[250px] xl:px-2.5 xl:pb-[140px] xl:pt-[25px]',
            'md:max-xl:h-auto md:max-xl:w-full md:max-xl:flex-row md:max-xl:items-center md:max-xl:justify-between',
            'md:max-xl:border-b md:max-xl:border-white/8 md:max-xl:px-6 md:max-xl:py-4',
            'max-md:h-auto max-md:w-full max-md:flex-row max-md:items-center max-md:justify-between',
            'max-md:border-b max-md:border-white/8 max-md:px-4 max-md:py-3.5',
          )}
        >
          <div className="mb-5 flex items-center gap-0 max-xl:mb-0 max-xl:gap-2">
            <Image
              src="/MedBlend-logo.jpeg"
              alt="MedBlend Logo"
              width={64}
              height={64}
              className="shrink-0 rounded-lg object-cover max-xl:!h-11 max-xl:!w-11"
            />
            <span className="font-syne text-xl font-bold tracking-tight text-white max-xl:text-[17px] max-sm:text-[15px]">
              MedBlendApp
            </span>
          </div>

          <div className="mb-[35px] ml-5 mt-auto max-xl:hidden">
            <h2 className="mb-5 text-[26px] font-bold tracking-tight text-white">Get in Touch</h2>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:medblendapp@gmail.com"
                className="break-all text-[12.5px] text-white/50 no-underline transition-colors hover:text-white"
              >
                medblendapp@gmail.com
              </a>
              <div className="text-[12.5px] text-white/40">Instagram: @medblendapp</div>
              <div className="text-[12.5px] text-white/40">
                Real guidance from medical students and doctors.
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={cn(
            'relative h-full flex-1',
            'md:max-xl:flex md:max-xl:min-h-0 md:max-xl:w-full md:max-xl:flex-col md:max-xl:overflow-hidden',
            'max-md:flex max-md:min-h-0 max-md:w-full max-md:flex-col',
          )}
        >
          {/* Join Waitlist */}
          <div
            className={cn(
              'absolute right-[35px] top-[30px] z-[25] flex h-[55px] w-[270px] justify-center',

              // FIX TABLET: Added 'md:max-xl:my-6' to separate it vertically from elements above and below
              'md:max-xl:relative md:max-xl:right-auto md:max-xl:top-auto md:max-xl:order-1',
              'md:max-xl:mx-4 md:max-xl:my-2 md:max-xl:h-auto md:max-xl:w-[calc(100%-32px)]',

              // FIX MOBILE: Changed 'max-md:mt-3' to 'max-md:mt-0' to remove space above the button
              'max-md:relative max-md:right-auto max-md:top-auto max-md:order-1',
              'max-md:mx-3 max-md:mb-0 max-md:mt-0 max-md:h-auto max-md:w-[calc(100%-24px)] max-md:gap-2.5',
              'max-sm:flex-col max-sm:items-stretch max-sm:pt-2', // Changed 'max-sm:pt-2.5' to 'pt-0'
            )}
          >
            <a
              href="/waitlist"
              className={cn(
                // 1. mobile
                'flex h-full w-full items-center justify-center whitespace-nowrap rounded-[10px_22px_10px_22px]',
                'border-[1.5px] border-white/15 bg-[var(--pulse)] text-[clamp(12px,1.2vw,14px)] font-semibold text-white no-underline',
                'shadow-[0_4px_15px_var(--pulse-glow)] transition-all hover:-translate-y-px hover:border-white/40 hover:bg-[var(--sage)] hover:shadow-[0_6px_20px_var(--pulse-glow)]',

                // 2. Show on tablet and larger screens 
                'max-xl:inline-flex max-xl:min-h-11 max-xl:rounded-[50px] max-xl:px-[18px] max-xl:py-2.5 max-xl:text-xs',
                'md:max-xl:min-h-[52px] md:max-xl:text-[15px] md:max-xl:font-bold md:max-xl:tracking-wide md:max-xl:px-6',
              )}
            >
              Join the Waitlist →
            </a>
          </div>

          {/* Glowing border overlay */}
          <svg
            className="pointer-events-none absolute bottom-[25px] left-0 right-[25px] top-5 z-[6] h-[calc(100%-45px)] w-[calc(100%-25px)] max-xl:hidden"
            width="100%"
            height="100%"
          >
            <defs>
              <clipPath id="lh-card-clip">
                <path d={dynamicPath} />
              </clipPath>
            </defs>
            <path d={dynamicPath} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
          </svg>

          {/* Purple display card */}
          <div
            ref={cardRef}
            className={cn(
              'lh-purple-card absolute  z-[2] overflow-hidden bg-[var(--void)]',
              'xl:bottom-[25px] xl:left-0 xl:right-[25px] xl:top-5 xl:[clip-path:url(#lh-card-clip)]',
              // TABLET: flex column, hero text centered in middle, cards pinned at bottom
              'md:max-xl:relative md:max-xl:bottom-auto md:max-xl:left-auto md:max-xl:right-auto md:max-xl:top-auto',
              'md:max-xl:order-2 md:max-xl:mx-4 md:max-xl:flex md:max-xl:flex-1 md:max-xl:min-h-0 md:max-xl:flex-col md:max-xl:gap-0',
              'md:max-xl:rounded-[24px] md:max-xl:border md:max-xl:border-white/12 md:max-xl:px-5 md:max-xl:pb-4 md:max-xl:pt-0',
              'max-md:relative max-md:bottom-auto max-md:left-auto max-md:right-auto max-md:top-auto',
              'max-md:order-2 max-md:m-3 max-md:flex max-md:min-h-[420px] max-md:flex-col max-md:gap-[18px]',
              'max-md:rounded-[20px] max-md:border max-md:border-white/12 max-md:px-3.5 max-md:py-4',
              'max-sm:m-2 max-sm:gap-3.5 max-sm:px-3 max-sm:py-3.5',
              'max-md:landscape:gap-3 max-md:landscape:p-3',
            )}
          >
            <Dna3DCanvas className="opacity-90 max-xl:opacity-[0.85]" embedded />

            {/* Nav */}
            <nav
              className={cn(
                'absolute left-[40%] top-[2.6%] z-10 flex w-[min(340px,35%)] -translate-x-1/2 gap-2',
                'md:max-xl:relative md:max-xl:left-auto md:max-xl:top-auto md:max-xl:order-1 md:max-xl:w-full md:max-xl:translate-x-0 md:max-xl:justify-center',
                // TABLET: give the nav a fixed compact height so it doesn't steal space from the centered text
                'md:max-xl:flex-none md:max-xl:pt-4 md:max-xl:pb-2',
                'max-md:relative max-md:left-auto max-md:top-auto max-md:order-1 max-md:w-full max-md:translate-x-0 max-md:justify-center',
                'max-sm:gap-1.5',
              )}
            >
              {[
                { href: '/', label: 'Home', active: true },
                { href: '/#about', label: 'About', active: false },
                { href: '/#team', label: 'Team', active: false },
                { href: '/FAQ', label: 'FAQ', active: false },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'box-border flex flex-1 items-center justify-center rounded-[30px] border border-white/15',
                    'bg-white/[0.02] px-0 py-2 text-[clamp(11px,1vw,13px)] font-medium text-white/65 no-underline backdrop-blur-[5px] transition-all',
                    'hover:border-white/35 hover:bg-white/[0.06] hover:text-white',
                    item.active && 'border-white/10 bg-white text-black',
                    'max-xl:min-h-9 max-xl:text-[11px]',
                    'md:max-xl:min-h-[44px] md:max-xl:text-[14px] md:max-xl:font-semibold',
                    'max-sm:py-1.5 max-sm:text-[10px]',
                  )}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Hero text */}
            <div
              className={cn(
                'absolute left-[5.8%] top-[24%] z-10 max-w-[55%]',
                // TABLET: flex-1 so it takes all space between nav and cards, centers content vertically
                'md:max-xl:relative md:max-xl:left-auto md:max-xl:top-auto md:max-xl:order-2',
                'md:max-xl:flex-1 md:max-xl:flex md:max-xl:flex-col md:max-xl:items-center md:max-xl:justify-center',
                'md:max-xl:max-w-full md:max-xl:px-4 md:max-xl:text-center',

                // FIX MOBILE: Added 'max-md:py-6' to create breathing room above and below the content
                'max-md:relative max-md:left-auto max-md:top-auto max-md:order-2 max-md:max-w-full max-md:px-1 max-md:py-17 max-md:text-center',
              )}
            >
              <h1
                className={cn(
                  'font-syne text-[clamp(2.2rem,5vw,4rem)] leading-[1.1]',
                  'mb-4 font-bold leading-[1.12] tracking-tight text-white',

                  // TABLET: much larger, prominent
                  'md:max-xl:mb-5 md:max-xl:text-[clamp(44px,7vw,72px)]',
                  'max-xl:mb-3 max-sm:text-2xl max-md:landscape:text-[22px]',
                  // non-tablet max-xl fallback (mobile uses max-sm above)
                  '[&:not(.md\:max-xl)]:max-xl:text-[clamp(26px,7.5vw,36px)]',
                )}
              >
                Enter Medicine Knowing
                <br />
                What To Expect
                <br />
                <WordRotate
                  words={["Mentorship", "Guidance", "Insights", "Community", "Experiences"]}
                  className="font-instrument italic text-emerald-500"
                ></WordRotate>
              </h1>
              <p
                className={cn(
                  'max-w-[360px] text-[15.5px] leading-[1.45] text-white/65',
                  // TABLET: bigger subtitle
                  'md:max-xl:mx-auto md:max-xl:max-w-[520px] md:max-xl:text-[16px] md:max-xl:text-white/70',
                  'max-xl:mx-auto max-xl:max-w-full max-xl:text-[13px]',
                )}
              >
                Real guidance from students and doctors who&apos;ve already lived it.
              </p>
            </div>

            {/* Widget cards */}
            <div
              className={cn(
                'absolute right-[30px] top-[15.3%] z-10 flex w-[280px] flex-col gap-[clamp(10px,1.5%,16px)]',
                // TABLET: flex-none fixed height row pinned at bottom of purple card
                'md:max-xl:relative md:max-xl:right-auto md:max-xl:top-auto md:max-xl:order-3',
                'md:max-xl:w-full md:max-xl:flex-none md:max-xl:flex-row md:max-xl:gap-3 md:max-xl:h-[240px]',
                'max-md:relative max-md:right-auto max-md:top-auto max-md:order-3 max-md:w-full max-md:gap-3',
                'max-md:landscape:gap-2',
              )}
            >
              {/* Stats */}
              <div
                className={cn(
                  'group flex cursor-pointer items-center justify-between rounded-[20px] border border-white/12 bg-white/5 p-4',
                  'shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-[20px] transition-all duration-300',
                  'hover:scale-[1.02] hover:border-white/[0.18] hover:bg-white/[0.08] hover:shadow-[0_12px_40px_var(--pulse-glow)] hover:-translate-y-[3px]',
                  // TABLET: fill height, compact column
                  'md:max-xl:flex-1 md:max-xl:h-full md:max-xl:flex-col md:max-xl:items-start md:max-xl:justify-center md:max-xl:rounded-2xl md:max-xl:hover:translate-y-0 md:max-xl:hover:scale-100',
                  'max-md:rounded-2xl max-md:p-3.5 max-md:hover:translate-y-0 max-md:hover:scale-100',
                  'max-md:landscape:px-3 max-md:landscape:py-2.5',
                )}
              >
                <div className="flex-1 pr-3 md:max-xl:pr-0">
                  <div className="mb-1 text-[clamp(20px,2.2vw,26px)] font-bold tracking-tight text-white max-xl:text-[22px] md:max-xl:text-[42px] md:max-xl:mb-2">
                    500+
                  </div>
                  <div className="text-[clamp(8.5px,0.9vw,10px)] leading-snug text-white/50 md:max-xl:text-[13px] md:max-xl:leading-normal">
                    Aspiring medical students on our early access waitlist.
                  </div>
                </div>
              </div>

              {/* Founding Team */}
              <div
                className={cn(
                  'group flex cursor-default items-stretch justify-between rounded-[20px] border border-white/12 bg-white/5 px-3.5 py-3.5',
                  'shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-[20px] transition-all duration-300',
                  'hover:scale-[1.02] hover:border-white/[0.18] hover:bg-white/[0.08] hover:shadow-[0_12px_40px_var(--pulse-glow)] hover:-translate-y-[3px]',
                  // TABLET: flex-2 width, fixed height, hide full list — show label + stacked avatars only
                  'md:max-xl:flex-[2] md:max-xl:h-full md:max-xl:flex-col md:max-xl:items-start md:max-xl:justify-start md:max-xl:rounded-2xl md:max-xl:hover:translate-y-0 md:max-xl:hover:scale-100 md:max-xl:px-3 md:max-xl:py-3 md:max-xl:overflow-hidden',
                  'max-md:rounded-2xl max-md:p-3.5 max-md:hover:translate-y-0 max-md:hover:scale-100',
                  'max-md:landscape:px-3 max-md:landscape:py-2.5',
                )}
              >
                <div className="flex-1 pr-3 md:max-xl:pr-0 md:max-xl:w-full">
                  <div className="mb-2.5 text-[clamp(11.5px,1.2vw,13.5px)] font-semibold tracking-wide text-white max-xl:mb-2 md:max-xl:text-[15px] md:max-xl:mb-2">
                    Founding Team
                  </div>

                  {/* Full list — visible on mobile, desktop, AND tablet */}
                  <ul className="m-0 flex list-none flex-col gap-[7px] p-0 max-xl:gap-2 md:max-xl:gap-1.5 md:max-xl:w-full">
                    {FOUNDING_TEAM.map((member) => (
                      <li key={member.name} className="m-0 p-0">
                        <a
                          href="/#team"
                          className="group/team flex cursor-pointer items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-[9px] py-[7px] text-inherit no-underline transition-all hover:translate-x-0.5 hover:border-white/[0.14] hover:bg-white/[0.06] max-xl:hover:translate-x-0.5 md:max-xl:px-2.5 md:max-xl:py-1.5"
                          aria-label={`Meet ${member.name}, ${member.role}`}
                        >
                          <Image
                            src={member.image}
                            alt={member.name}
                            width={36}
                            height={36}
                            className={cn(
                              'size-[clamp(28px,3vw,36px)] shrink-0 rounded-full border-[1.5px] border-[var(--sage-glow)] object-cover',
                              'shadow-[0_3px_10px_rgba(0,0,0,0.35)] transition-all',
                              'group-hover/team:border-[var(--sage)] group-hover/team:shadow-[0_0_10px_var(--pulse-glow)]',
                              'max-xl:!size-[38px] max-sm:!size-[34px]',
                              'md:max-xl:!size-[40px]',
                            )}
                          />
                          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <span className="truncate text-[clamp(10px,1.1vw,12px)] font-semibold leading-tight tracking-wide text-white/92 max-xl:text-[13px] max-sm:text-xs md:max-xl:text-[14px]">
                              {member.name}
                            </span>
                            <span className="truncate text-[clamp(8px,0.8vw,9.5px)] font-medium leading-tight tracking-wide text-white/42 transition-colors group-hover/team:text-[var(--sage)] max-xl:text-[10.5px] md:max-xl:text-[12px]">
                              {member.role}
                            </span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>

                  {/* Compact avatar row — hidden now that full list shows on tablet */}
                  <div className="hidden">
                    <div className="flex gap-[-6px]">
                      {FOUNDING_TEAM.map((member) => (
                        <Image
                          key={member.name}
                          src={member.image}
                          alt={member.name}
                          width={38}
                          height={38}
                          className="size-[38px] shrink-0 rounded-full border-[1.5px] border-[var(--sage-glow)] object-cover shadow-[0_3px_10px_rgba(0,0,0,0.35)] -ml-1 first:ml-0"
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-white/40 leading-snug">
                      CEO, Marketing & CTO
                    </span>
                  </div>
                </div>
              </div>

              {/* Verified Mentors */}
              <div
                className={cn(
                  'hidden md:flex group cursor-pointer items-center justify-between rounded-[20px] border border-white/12 bg-white/5 p-4',
                  'shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-[20px] transition-all duration-300',
                  'hover:scale-[1.02] hover:border-white/[0.18] hover:bg-white/[0.08] hover:shadow-[0_12px_40px_var(--pulse-glow)] hover:-translate-y-[3px]',
                  // TABLET: fill height
                  'md:max-xl:flex-1 md:max-xl:h-full md:max-xl:flex-col md:max-xl:items-start md:max-xl:justify-center md:max-xl:rounded-2xl md:max-xl:hover:translate-y-0 md:max-xl:hover:scale-100',
                  'max-md:rounded-2xl max-md:p-3.5 max-md:hover:translate-y-0 max-md:hover:scale-100',
                  'max-md:landscape:px-3 max-md:landscape:py-2.5',
                )}
              >
                <div className="flex-1 pr-3 md:max-xl:pr-0">
                  <div className="mb-1.5 text-[clamp(11.5px,1.2vw,13.5px)] font-semibold text-white md:max-xl:text-[15px] md:max-xl:mb-3">Verified Mentors</div>
                  <div className="text-[clamp(8.5px,0.9vw,10px)] leading-snug text-white/50 md:max-xl:text-[13px] md:max-xl:leading-normal">
                    Every mentor is verified — real students, residents, and doctors giving real answers.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Swipe slider */}
        <div
          className={cn(
            'lh-slider-track absolute bottom-[35px] left-[25px] z-30 box-border flex h-[55px] w-[505px] items-center overflow-hidden',
            'rounded-[22px] border-[1.5px] border-white/35 bg-black p-1 shadow-[0_4px_15px_rgba(0,0,0,0.5)]',
            'md:max-xl:relative md:max-xl:bottom-auto md:max-xl:left-auto md:max-xl:order-3',
            'md:max-xl:mx-4 md:max-xl:mb-4 md:max-xl:mt-2 md:max-xl:h-[52px] md:max-xl:w-[calc(100%-32px)] md:max-xl:max-w-full',
            'max-md:relative max-md:bottom-auto max-md:left-auto max-md:order-3',
            'max-md:mx-3 max-md:mb-3.5 max-md:mt-1 max-md:h-[52px] max-md:w-[calc(100%-24px)] max-md:max-w-full',
            'max-sm:mx-2 max-sm:mb-3 max-sm:w-[calc(100%-16px)]',
          )}
          ref={sliderTrackRef}
        >
          <div
            className="lh-slider-btn z-[2] flex size-[46px] cursor-grab touch-none items-center justify-center rounded-full border-[1.5px] border-white bg-black text-white shadow-[0_0_10px_rgba(255,255,255,0.1)] active:cursor-grabbing max-xl:size-[42px]"
            ref={sliderBtnRef}
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="transition-transform duration-300"
              ref={arrowIconRef}
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
          <span
            className="lh-slider-text pointer-events-none absolute left-0 z-[1] w-full text-center text-[12.5px] font-medium tracking-[0.8px] text-white/45 transition-opacity duration-300 max-xl:px-12 max-xl:text-[11px] max-xl:tracking-[0.5px]"
            ref={sliderTextRef}
          >
            Swipe to Join Waitlist
          </span>
        </div>
      </div>
    </section>
  );
}