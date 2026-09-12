'use client';

import { useState } from 'react';
import { ExternalLink, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { addSource, updateSource } from '@/lib/admin/sources-actions';

export interface SourceRow {
  id: string;
  title: string;
  url: string | null;
  type: string | null;
  emirate: string | null;
  licensing_body: string | null;
  course_applicability: string[] | null;
  comments: string | null;
}

const inputClass =
  'h-8 min-w-28 border-transparent bg-transparent px-2 text-sm hover:border-input focus-visible:border-input';

/** One inline-editable text cell — saves itself on blur. */
function EditableCell({
  id,
  field,
  initialValue,
  placeholder,
  className,
}: {
  id: string;
  field: 'title' | 'url' | 'type' | 'emirate' | 'licensing_body' | 'comments';
  initialValue: string;
  placeholder?: string;
  className?: string;
}) {
  const [value, setValue] = useState(initialValue);
  const [saved, setSaved] = useState(initialValue);
  const [error, setError] = useState(false);

  async function save() {
    if (value === saved) return;
    try {
      await updateSource(id, { [field]: value || null });
      setSaved(value);
      setError(false);
    } catch {
      setError(true);
    }
  }

  return (
    <Input
      value={value}
      placeholder={placeholder}
      onChange={(e) => setValue(e.target.value)}
      onBlur={save}
      className={`${inputClass} ${error ? 'text-destructive' : ''} ${className ?? ''}`}
      title={error ? 'Failed to save — try again' : undefined}
    />
  );
}

function CourseCheckboxes({ id, initial }: { id: string; initial: string[] }) {
  const [courses, setCourses] = useState<string[]>(initial);

  async function toggle(course: string) {
    const next = courses.includes(course)
      ? courses.filter((c) => c !== course)
      : [...courses, course];
    setCourses(next);
    try {
      await updateSource(id, { course_applicability: next });
    } catch {
      setCourses(courses); // revert on failure
    }
  }

  return (
    <div className="flex gap-3">
      {['MBBS', 'MD'].map((course) => (
        <label key={course} className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={courses.includes(course)}
            onChange={() => toggle(course)}
            className="accent-primary"
          />
          {course}
        </label>
      ))}
    </div>
  );
}

export default function SourcesTable({ sources }: { sources: SourceRow[] }) {
  const [adding, setAdding] = useState(false);

  return (
    <section className="flex min-w-0 flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight">RAG Sources</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {sources.length} sources · every field editable — corrects labels here only, doesn&apos;t
            re-tag chunks or change retrieval.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          disabled={adding}
          onClick={async () => {
            setAdding(true);
            try {
              await addSource();
            } finally {
              setAdding(false);
            }
          }}
        >
          <Plus /> Add source
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-48">Title</TableHead>
              <TableHead className="min-w-56">URL</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Emirate</TableHead>
              <TableHead>Licensing body</TableHead>
              <TableHead>Course</TableHead>
              <TableHead className="min-w-48">Comments</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sources.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <EditableCell id={s.id} field="title" initialValue={s.title} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <EditableCell
                      id={s.id}
                      field="url"
                      initialValue={s.url ?? ''}
                      placeholder="https://…"
                    />
                    {s.url && (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-muted-foreground hover:text-foreground"
                        title="Open source"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <EditableCell
                    id={s.id}
                    field="type"
                    initialValue={s.type ?? ''}
                    placeholder="pdf, website…"
                    className="min-w-20"
                  />
                </TableCell>
                <TableCell>
                  <EditableCell id={s.id} field="emirate" initialValue={s.emirate ?? ''} className="min-w-24" />
                </TableCell>
                <TableCell>
                  <EditableCell
                    id={s.id}
                    field="licensing_body"
                    initialValue={s.licensing_body ?? ''}
                    className="min-w-24"
                  />
                </TableCell>
                <TableCell>
                  <CourseCheckboxes id={s.id} initial={s.course_applicability ?? []} />
                </TableCell>
                <TableCell>
                  <EditableCell id={s.id} field="comments" initialValue={s.comments ?? ''} placeholder="—" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
