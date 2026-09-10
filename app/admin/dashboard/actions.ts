'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/admin';
import { supabaseAdmin } from '@/lib/supabase';

// Review actions for /admin/dashboard. Both re-verify admin (never trust the
// client), write to milestone_content with the service-role client, and
// revalidate the page so the new status shows on the next render.

async function setReview(
  milestoneId: string,
  course: string,
  fields: Record<string, unknown>,
) {
  const { user } = await requireAdmin();
  const { error } = await supabaseAdmin()
    .from('milestone_content')
    .update({
      reviewed_by: user.email ?? user.id,
      reviewed_at: new Date().toISOString(),
      ...fields,
    })
    .eq('milestone_id', milestoneId)
    .eq('course', course);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/dashboard');
}

export async function approveMilestone(milestoneId: string, course: string) {
  await setReview(milestoneId, course, { status: 'reviewed', review_notes: null });
}

export async function rejectMilestone(milestoneId: string, course: string, note: string) {
  const trimmed = note.trim();
  if (!trimmed) throw new Error('A note is required to reject.');
  await setReview(milestoneId, course, { status: 'rejected', review_notes: trimmed });
}
