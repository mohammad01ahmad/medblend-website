import type { Metadata } from 'next';
import { TooltipProvider } from '@/components/ui/tooltip';

export const metadata: Metadata = {
  title: 'MedBlend Admin',
  robots: { index: false, follow: false },
};

// Own shell — no marketing Header/Footer (suppressed in ConditionalHeader /
// ConditionalFooter). `dark` is scoped to /admin only: it activates the
// shadcn dark palette already defined in globals.css (unused everywhere
// else — the marketing site never applies the class). TooltipProvider is
// required by the installed shadcn Sidebar (icon-collapsed mode shows
// tooltips on hover). No app-shell header here — branding + the sidebar
// collapse trigger live in the dashboard's own AdminSidebar; the login page
// (no sidebar) is a self-contained centered card with its own heading.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
    </div>
  );
}
