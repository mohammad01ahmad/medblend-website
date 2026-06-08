'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShimmerButton } from './ui/shimmer-button';

const navLinks = [
  { href: '/#problem', label: 'About' },
  { href: '/#solution', label: 'Solution' },
  { href: '/#features', label: 'Features' },
  { href: '/#team', label: 'Team' },
];

export default function StickyNav() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pathname !== '/') {
      setVisible(false);
      return;
    }

    const sentinel = document.getElementById('hero-end-sentinel');
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [pathname]);

  if (pathname !== '/' || !visible) return null;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[var(--background)]/88 backdrop-blur-xl transition-all duration-300"
      aria-label="Site navigation"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/MedBlend-logo.jpeg"
            alt="MedBlend"
            width={36}
            height={36}
            className="rounded-md object-cover"
          />
          <span className="font-syne hidden text-base font-bold text-white sm:inline">
            MedBlendApp
          </span>
        </Link>

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

        <Link href="/waitlist" className="shrink-0">
          <ShimmerButton className="px-4 py-2 text-xs sm:px-5 sm:text-sm">
            Get Early Access
          </ShimmerButton>
        </Link>
      </div>
    </header>
  );
}
