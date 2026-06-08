'use client';

import Image from 'next/image';
import Link from 'next/link';
import { IoLogoInstagram } from 'react-icons/io5';
import { LuMail } from 'react-icons/lu';
import DnaCanvas from '@/components/DnaCanvas';

const companyLinks = [
  { href: '/#problem', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const supportLinks = [
  { href: '/FAQ', label: 'FAQ' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/waitlist', label: 'Join Waitlist' },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[var(--background)] text-white">
      {/* DNA helix — subdued, behind scrim */}
      <div className="pointer-events-none absolute inset-0">
        <DnaCanvas muted className="scale-105 opacity-50" />
      </div>

      {/* Blurred dull overlay for readability */}
      <div
        className="pointer-events-none absolute inset-0 bg-[var(--background)]/75 backdrop-blur-xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[rgba(10,14,12,0.55)] via-[rgba(8,12,10,0.82)] to-[var(--void)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-6xl px-[clamp(1.25rem,4vw,2rem)] py-12 sm:py-14">
        <div className="mb-10 grid gap-10 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2.5">
              <Image
                src="/MedBlend-logo.jpeg"
                alt="MedBlend"
                width={48}
                height={48}
                className="rounded-lg object-cover"
              />
              <span className="font-syne text-lg font-bold tracking-tight">
                MedBlendApp
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-[var(--white-dim)]">
              Real guidance from students and doctors who&apos;ve already lived it.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 font-syne text-xs font-semibold uppercase tracking-[0.16em] text-[var(--pulse)]">
              Company
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--white-dim)] transition-colors hover:text-[var(--sage)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="mb-4 font-syne text-xs font-semibold uppercase tracking-[0.16em] text-[var(--pulse)]">
              Support
            </h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--white-dim)] transition-colors hover:text-[var(--sage)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-syne text-xs font-semibold uppercase tracking-[0.16em] text-[var(--pulse)]">
              Connect
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://www.instagram.com/medblendapp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-sm text-[var(--white-dim)] transition-colors hover:text-[var(--sage)]"
                >
                  <span className="flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/5">
                    <IoLogoInstagram className="text-lg" />
                  </span>
                  @medblendapp
                </a>
              </li>
              <li>
                <a
                  href="mailto:medblendapp@gmail.com"
                  className="inline-flex items-center gap-2.5 text-sm text-[var(--white-dim)] transition-colors hover:text-[var(--sage)]"
                >
                  <span className="flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/5">
                    <LuMail className="text-lg" />
                  </span>
                  medblendapp@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-[var(--white-dim)] md:flex-row md:items-center md:justify-between">
          <p>Copyright © 2026 MedBlend. All rights reserved.</p>
          <p className="text-xs sm:text-sm">
            Built for aspiring physicians — enter medicine knowing what to expect.
          </p>
        </div>
      </div>
    </footer>
  );
}
