'use client';

import { useState } from 'react';
import Link from 'next/link';

import { ShimmerButton } from '@/components/ui/shimmer-button';
import Image from 'next/image';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/#solution', label: 'Solution' },
  { href: '/#team', label: 'Team' },
  { href: '/FAQ', label: 'FAQ' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[var(--background)]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5">
        <Link href="/" onClick={closeMenu} className="flex items-center gap-2.5">
          <Image src="/MedBlend-logo.jpeg" alt="MedBlend" width={44} height={44} className="rounded-lg object-cover" />
          <span className="font-syne text-lg font-bold text-white sm:text-xl">MedBlendApp</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex lg:gap-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--white-dim)] transition-colors hover:bg-[var(--sage-soft)] hover:text-[var(--sage)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pulse)] lg:px-4"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/waitlist" className="hidden shrink-0 md:block px-4 py-2 text-xs sm:px-5 sm:text-sm border-none bg-[var(--pulse)] rounded-[var(--radius-4xl)] font-syne text-[0.95rem] font-semibold text-white shadow-[0_0_30px_var(--pulse-glow)] transition-all duration-300 ease-[var(--ease-out)] hover:-translate-y-[3px] hover:bg-[var(--sage)] hover:shadow-[0_0_50px_var(--pulse-glow)]">
            Get Early Access →
          </Link>

        {/* Mobile: hamburger button */}
        <button
          className="flex md:hidden items-center justify-center w-10 h-10 rounded-xl border border-white/15 bg-white/5 backdrop-blur-md transition-all hover:bg-white/10 active:scale-95"
          onClick={() => setIsMenuOpen((o) => !o)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
        >
          <span className="flex flex-col gap-[5px] w-[18px]">
            <span
              className="block h-[1.5px] w-full rounded-full bg-white transition-all duration-300 origin-center"
              style={isMenuOpen ? { transform: 'translateY(6.5px) rotate(45deg)' } : {}}
            />
            <span
              className="block h-[1.5px] w-full rounded-full bg-white transition-all duration-300"
              style={isMenuOpen ? { opacity: 0, transform: 'scaleX(0)' } : {}}
            />
            <span
              className="block h-[1.5px] w-full rounded-full bg-white transition-all duration-300 origin-center"
              style={isMenuOpen ? { transform: 'translateY(-6.5px) rotate(-45deg)' } : {}}
            />
          </span>
        </button>
      </div>
      </div>

      {/* Mobile dropdown menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isMenuOpen ? '320px' : '0px', opacity: isMenuOpen ? 1 : 0 }}
      >
        <nav className="flex flex-col gap-1 border-t border-white/10 px-4 pb-4 pt-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition-all hover:bg-white/6 hover:text-white border border-transparent hover:border-white/10"
            >
              {link.label}
            </a>
          ))}
          <Link href="/waitlist" onClick={closeMenu} className="mt-2">
            <ShimmerButton className="w-full justify-center py-3 text-sm">
              Get Early Access
            </ShimmerButton>
          </Link>
        </nav>
      </div>
    </header>
  );
}
