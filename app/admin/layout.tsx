import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MedBlend Admin',
  robots: { index: false, follow: false },
};

// Own shell — no marketing Header/Footer (suppressed in ConditionalHeader /
// ConditionalFooter). Forced dark, matching the app's permanent-dark palette.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--void)] text-white">
      <header className="border-b border-[var(--border-subtle)] px-6 py-4">
        <span className="font-syne text-sm font-bold tracking-[0.2em] text-[var(--pulse)] uppercase">
          MedBlend Admin
        </span>
      </header>
      <main className="px-6 py-8">{children}</main>
    </div>
  );
}
