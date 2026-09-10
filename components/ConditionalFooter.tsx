'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';

/** The marketing Footer everywhere except the /admin area. */
export default function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return null;
  return <Footer />;
}
