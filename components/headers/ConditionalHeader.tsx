'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/headers/Header';

/**
 * Renders the global Header on every route EXCEPT the homepage ("/"),
 * which has its own navigation baked into the LandingHero component, and the
 * /admin area, which has its own minimal shell.
 */
export default function ConditionalHeader() {
  const pathname = usePathname();
  if (pathname === '/') return null;
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return null;
  return <Header />;
}
