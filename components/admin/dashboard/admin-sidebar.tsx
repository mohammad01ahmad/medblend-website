'use client';

import Image from 'next/image';
import { ScatterChart, ClipboardCheck, Database } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import SignOutButton from '@/components/admin/sign-out-button';
import { useSection, type SectionId } from './section-context';

const SECTIONS: { id: SectionId; label: string; icon: typeof ScatterChart }[] = [
  { id: 'umap', label: 'UMAP graph', icon: ScatterChart },
  { id: 'tsne', label: 't-SNE graph', icon: ScatterChart },
  { id: 'review', label: 'Milestone review', icon: ClipboardCheck },
  { id: 'sources', label: 'RAG Sources', icon: Database },
];

export default function AdminSidebar({ email }: { email: string | null | undefined }) {
  const { active, setActive } = useSection();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between gap-2 px-2 py-1 group-data-[collapsible=icon]:justify-center">
          <div className="flex items-center gap-2 overflow-hidden group-data-[collapsible=icon]:hidden">
            <Image src="/medblendapp-logo.png" alt="" width={20} height={20} className="shrink-0" />
            <span className="truncate text-sm font-semibold tracking-tight">
              MedblendApp Admin
            </span>
          </div>
          <SidebarTrigger />
        </div>
      </SidebarHeader>

      <SidebarRail />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Sections</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SECTIONS.map((s) => (
                <SidebarMenuItem key={s.id}>
                  <SidebarMenuButton
                    tooltip={s.label}
                    isActive={active === s.id}
                    onClick={() => setActive(s.id)}
                  >
                    <s.icon />
                    <span>{s.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex flex-col gap-1.5 px-2 py-1 group-data-[collapsible=icon]:hidden">
          <span className="truncate text-xs text-muted-foreground">{email ?? 'signed in'}</span>
          <SignOutButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
