// Landing route group layout — no Header, no Footer.
// This layout applies only to app/(landing)/page.tsx which maps to "/".
export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
