'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { addComment } from '@/lib/admin/milestone-actions';

/** Freeform note on a milestone, independent of Approve/Reject. No constraints. */
export default function CommentBox({
  milestoneId,
  course,
  initialNote,
}: {
  milestoneId: string;
  course: string;
  initialNote: string | null;
}) {
  const [note, setNote] = useState(initialNote ?? '');
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function save() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      try {
        await addComment(milestoneId, course, note);
        setSaved(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to save comment');
      }
    });
  }

  return (
    <div className="mt-1 flex flex-col gap-2">
      <Textarea
        value={note}
        onChange={(e) => {
          setNote(e.target.value);
          setSaved(false);
        }}
        rows={2}
        placeholder="Leave a comment…"
        className="text-xs"
      />
      <div className="flex items-center gap-2">
        <Button type="button" size="sm" variant="outline" disabled={pending} onClick={save}>
          {pending ? 'Saving…' : 'Add Comment'}
        </Button>
        {saved && !pending && <span className="text-xs text-emerald-500">saved</span>}
        {error && <span className="text-xs text-destructive">{error}</span>}
      </div>
    </div>
  );
}
