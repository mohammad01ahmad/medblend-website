'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { approveMilestone, rejectMilestone } from './actions';

type Status = 'unreviewed' | 'reviewed' | 'rejected' | null;

export default function MilestoneActions({
  milestoneId,
  course,
  status,
  reviewNotes,
}: {
  milestoneId: string;
  course: string;
  status: Status;
  reviewNotes: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [rejecting, setRejecting] = useState(false);
  const [note, setNote] = useState(reviewNotes ?? '');
  const [error, setError] = useState<string | null>(null);

  function run(fn: () => Promise<void>) {
    setError(null);
    startTransition(async () => {
      try {
        await fn();
        setRejecting(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Action failed');
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={pending || status === 'reviewed'}
          onClick={() => run(() => approveMilestone(milestoneId, course))}
          className="border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500"
        >
          {status === 'reviewed' ? 'Approved' : 'Approve'}
        </Button>

        <Button
          size="sm"
          variant="outline"
          disabled={pending}
          onClick={() => {
            setError(null);
            setRejecting((v) => !v);
          }}
          className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          {status === 'rejected' ? 'Edit rejection' : 'Reject'}
        </Button>

        <Button
          size="sm"
          variant="ghost"
          disabled
          title="Regenerate from the CLI: npm run journey:generate -- --course MBBS --milestone <id> --refresh"
        >
          Regenerate
        </Button>

        {pending && <span className="text-xs text-muted-foreground">saving…</span>}
      </div>

      {rejecting && (
        <div className="flex flex-col gap-2">
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="What's wrong with this milestone? (required)"
            className="text-xs"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="destructive"
              disabled={pending || !note.trim()}
              onClick={() => run(() => rejectMilestone(milestoneId, course, note))}
            >
              Confirm rejection
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={pending}
              onClick={() => {
                setRejecting(false);
                setNote(reviewNotes ?? '');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
