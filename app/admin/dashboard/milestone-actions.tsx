'use client';

import { useState, useTransition } from 'react';
import { approveMilestone, rejectMilestone } from './actions';

type Status = 'unreviewed' | 'reviewed' | 'rejected' | null;

const btn =
  'rounded-md border px-3 py-1.5 text-xs font-medium transition disabled:opacity-40';

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
        <button
          type="button"
          disabled={pending || status === 'reviewed'}
          onClick={() => run(() => approveMilestone(milestoneId, course))}
          className={`${btn} border-[var(--pulse)] text-[var(--pulse)] hover:bg-[var(--pulse-soft)]`}
        >
          {status === 'reviewed' ? 'Approved' : 'Approve'}
        </button>

        <button
          type="button"
          disabled={pending}
          onClick={() => {
            setError(null);
            setRejecting((v) => !v);
          }}
          className={`${btn} border-[var(--ember)] text-[var(--ember)] hover:bg-[var(--ember-glow)]`}
        >
          {status === 'rejected' ? 'Edit rejection' : 'Reject'}
        </button>

        <button
          type="button"
          disabled
          title="Regenerate from the CLI: npm run journey:generate -- --course MBBS --milestone <id> --refresh"
          className={`${btn} border-[var(--border-subtle)] text-[var(--white-dim)]`}
        >
          Regenerate
        </button>

        {pending && <span className="text-xs text-[var(--white-dim)]">saving…</span>}
      </div>

      {rejecting && (
        <div className="flex flex-col gap-2">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="What's wrong with this milestone? (required)"
            className="w-full rounded-md border border-[var(--border-subtle)] bg-black/30 px-2 py-1.5 text-xs text-white"
          />
          <div className="flex gap-2">
            <button
              type="button"
              disabled={pending || !note.trim()}
              onClick={() => run(() => rejectMilestone(milestoneId, course, note))}
              className={`${btn} border-[var(--ember)] bg-[var(--ember-glow)] text-[var(--ember)]`}
            >
              Confirm rejection
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                setRejecting(false);
                setNote(reviewNotes ?? '');
              }}
              className={`${btn} border-[var(--border-subtle)] text-[var(--white-dim)]`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-[var(--ember)]">{error}</p>}
    </div>
  );
}
