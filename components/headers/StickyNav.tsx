'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShimmerButton } from '@/components/ui/shimmer-button';

/**
 * Renders the global Header on the homepage ("/") ONLY,
 * in addition to the header in the LandingHero component.
 */

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/#about', label: 'About' },
  { href: '/#team', label: 'Team' },
  { href: '/FAQ', label: 'FAQ' },
];

export default function StickyNav() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (pathname !== '/') {
      setVisible(false);
      return;
    }

    const sentinel = document.getElementById('hero-end-sentinel');
    if (!sentinel) return;

    // This automatically tracks matches without needing manual window.innerWidth checks
    const mediaQuery = window.matchMedia('(min-width: 768px)');

    const createObserver = () => {
      return new IntersectionObserver(
        ([entry]) => {
          // Safe dead-zone check: If the page bounding top is near 0, force hide
          if (window.scrollY <= 10) {
            setVisible(false);
            return;
          }

          // Dynamically checks if the viewport matches Tailwind's md breakpoint
          if (mediaQuery.matches) {
            setVisible(!entry.isIntersecting);
          } else {
            // Fallback safely using the sentinel's position relative to viewport top
            setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 80);
          }
        },
        { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
      );
    };

    let observer = createObserver();
    observer.observe(sentinel);

    // Re-evaluate whenever the browser crosses the mobile/desktop boundary
    const handleBreakpointChange = () => {
      observer.disconnect();
      observer = createObserver();
      observer.observe(sentinel);
    };

    // Modern event listener for media queries
    mediaQuery.addEventListener('change', handleBreakpointChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleBreakpointChange);
    };
  }, [pathname]);


  // Close menu on nav link click
  const handleLinkClick = () => setMenuOpen(false);

  if (pathname !== '/' || !visible) return null;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[var(--background)]/88 backdrop-blur-xl transition-all duration-300"
      aria-label="Site navigation"
    >
      {/* Main bar */}
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2" onClick={handleLinkClick}>
          <Image
            src="/MedBlend-logo.jpeg"
            alt="MedBlend"
            width={36}
            height={36}
            className="rounded-md object-cover"
          />
          <span className="font-syne text-base font-bold text-white">
            MedBlendApp
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex lg:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--white-dim)] transition-colors hover:bg-[var(--sage-soft)] hover:text-[var(--sage)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pulse)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <Link href="/waitlist" className="hidden shrink-0 md:block">
          <ShimmerButton className="px-4 py-2 text-xs sm:px-5 sm:text-sm">
            Get Early Access
          </ShimmerButton>
        </Link>

        {/* Mobile: hamburger button */}
        <button
          className="flex md:hidden items-center justify-center w-10 h-10 rounded-xl border border-white/15 bg-white/5 backdrop-blur-md transition-all hover:bg-white/10 active:scale-95"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className="flex flex-col gap-[5px] w-[18px]">
            <span
              className="block h-[1.5px] w-full rounded-full bg-white transition-all duration-300 origin-center"
              style={menuOpen ? { transform: 'translateY(6.5px) rotate(45deg)' } : {}}
            />
            <span
              className="block h-[1.5px] w-full rounded-full bg-white transition-all duration-300"
              style={menuOpen ? { opacity: 0, transform: 'scaleX(0)' } : {}}
            />
            <span
              className="block h-[1.5px] w-full rounded-full bg-white transition-all duration-300 origin-center"
              style={menuOpen ? { transform: 'translateY(-6.5px) rotate(-45deg)' } : {}}
            />
          </span>
        </button>
      </div>

      {/* Mobile dropdown menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: menuOpen ? '320px' : '0px', opacity: menuOpen ? 1 : 0 }}
      >
        <nav className="flex flex-col gap-1 border-t border-white/10 px-4 pb-4 pt-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className="rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition-all hover:bg-white/6 hover:text-white border border-transparent hover:border-white/10"
            >
              {link.label}
            </a>
          ))}
          <Link href="/waitlist" onClick={handleLinkClick} className="mt-2">
            <ShimmerButton className="w-full justify-center py-3 text-sm">
              Get Early Access
            </ShimmerButton>
          </Link>
        </nav>
      </div>
    </header>
  );
}
