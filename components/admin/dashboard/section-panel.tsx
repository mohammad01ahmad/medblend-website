'use client';

import type { ReactNode } from 'react';
import { useSection, type SectionId } from './section-context';

/** Shows/hides pre-rendered (server) content by section — stays mounted, just `hidden`. */
export default function SectionPanel({ id, children }: { id: SectionId; children: ReactNode }) {
  const { active } = useSection();
  return <div hidden={active !== id}>{children}</div>;
}
