'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';

/**
 * Renders the global Header on every route EXCEPT the homepage ("/"),
 * which has its own navigation baked into the LandingHero component.
 */
export default function ConditionalHeader() {
  const pathname = usePathname();
  if (pathname === '/') return null;
  return <Header />;
}
