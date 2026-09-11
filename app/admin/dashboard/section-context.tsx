'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

export type SectionId = 'umap' | 'tsne' | 'review' | 'sources';

interface SectionCtx {
  active: SectionId;
  setActive: (id: SectionId) => void;
}

const Ctx = createContext<SectionCtx | null>(null);

export function SectionProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<SectionId>('umap');
  return <Ctx.Provider value={{ active, setActive }}>{children}</Ctx.Provider>;
}

export function useSection(): SectionCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSection must be used within a SectionProvider');
  return ctx;
}
