// This file intentionally redirects — the actual homepage is app/page.tsx
import { redirect } from 'next/navigation';

export default function LandingGroupPage() {
  redirect('/');
}
