'use client';

import { useState } from 'react';
import Link from 'next/link';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoClose } from 'react-icons/io5';
import { ShimmerButton } from './ui/shimmer-button';
import Image from 'next/image';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/#problem', label: 'About' },
  { href: '/#team', label: 'Team' },
  { href: '/waitlist', label: 'Register' },
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
          <Link href="/waitlist" className="hidden sm:block">
            <ShimmerButton className="text-sm sm:text-base">Get Early Access</ShimmerButton>
          </Link>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg p-2 text-2xl text-white transition-colors hover:bg-white/10 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <IoClose /> : <RxHamburgerMenu />}
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeMenu}
        aria-hidden={!isMenuOpen}
      />

      <nav
        className={`fixed top-0 right-0 z-50 flex h-full w-72 flex-col border-l border-white/10 bg-[var(--void)] shadow-2xl transition-transform duration-300 ease-out sm:w-80 md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <span className="font-syne text-lg font-bold text-white">Menu</span>
          <button onClick={closeMenu} className="rounded-lg p-2 text-2xl text-white hover:bg-white/10" aria-label="Close menu">
            <IoClose />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-1 p-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="rounded-xl px-4 py-3 text-base font-medium text-[var(--white-dim)] transition-colors hover:bg-[var(--sage-soft)] hover:text-[var(--sage)]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="border-t border-white/10 p-6">
          <Link href="/waitlist" onClick={closeMenu}>
            <ShimmerButton className="w-full">Get Early Access</ShimmerButton>
          </Link>
        </div>
      </nav>
    </header>
  );
}
