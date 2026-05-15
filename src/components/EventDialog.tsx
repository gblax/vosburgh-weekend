"use client";

import { useEffect, useRef, useState } from "react";
import { X, Trash2 } from "lucide-react";
import type { EventCategory, EventDay, ItineraryEvent } from "@/types/event";
import { CATEGORIES, CATEGORY_VALUES } from "@/lib/categories";

export type EventDraft = {
  day: EventDay;
  start_time: string;
  end_time: string;
  title: string;
  location: string;
  address: string;
  notes: string;
  category: EventCategory;
  link_url: string;
  photo_url: string;
};

interface EventDialogProps {
  open: boolean;
  mode: "create" | "edit";
  initial: EventDraft;
  existingId: string | null;
  onClose: () => void;
  onSave: (
    draft: EventDraft,
    existingId: string | null,
  ) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
}

export function EventDialog({
  open,
  mode,
  initial,
  existingId,
  onClose,
  onSave,
  onDelete,
}: EventDialogProps) {
  const [draft, setDraft] = useState<EventDraft>(initial);
  const [saving, setSaving] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setDraft(initial);
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.title.trim() || !draft.start_time) return;
    setSaving(true);
    try {
      await onSave(draft, existingId);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!existingId) return;
    if (!confirm("Delete this event?")) return;
    setSaving(true);
    try {
      await onDelete(existingId);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-harbor-900/50 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-cream-50 shadow-2xl sm:rounded-3xl"
        style={{ maxHeight: "min(92dvh, 760px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div aria-hidden className="flex justify-center pb-1 pt-2.5 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-harbor-200" />
        </div>

        <header className="flex items-center justify-between border-b border-harbor-100/70 px-5 py-3">
          <h2 className="font-serif text-xl font-semibold text-harbor-900">
            {mode === "create" ? "Add event" : "Edit event"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="-mr-1 rounded-full p-2 text-harbor-700/70 hover:bg-harbor-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-4">
            <Field label="Title">
              <input
                ref={titleRef}
                type="text"
                required
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                className="input"
                placeholder="Dinner at FIG"
                enterKeyHint="next"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Day">
                <select
                  value={draft.day}
                  onChange={(e) =>
                    setDraft({ ...draft, day: e.target.value as EventDay })
                  }
                  className="input min-w-0"
                >
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                  <option value="sunday">Sunday</option>
                  <option value="monday">Monday</option>
                </select>
              </Field>
              <Field label="Category">
                <select
                  value={draft.category}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      category: e.target.value as EventCategory,
                    })
                  }
                  className="input min-w-0"
                >
                  {CATEGORY_VALUES.map((c) => (
                    <option key={c} value={c}>
                      {CATEGORIES[c].emoji} {CATEGORIES[c].label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Start time">
                <input
                  type="time"
                  required
                  value={draft.start_time}
                  onChange={(e) =>
                    setDraft({ ...draft, start_time: e.target.value })
                  }
                  className="input min-w-0"
                />
              </Field>
              <Field label="End time">
                <input
                  type="time"
                  value={draft.end_time}
                  onChange={(e) =>
                    setDraft({ ...draft, end_time: e.target.value })
                  }
                  className="input min-w-0"
                />
              </Field>
            </div>

            <Field label="Location">
              <input
                type="text"
                value={draft.location}
                onChange={(e) =>
                  setDraft({ ...draft, location: e.target.value })
                }
                className="input"
                placeholder="FIG Restaurant"
              />
            </Field>

            <Field label="Address" hint="Used for the directions link">
              <input
                type="text"
                value={draft.address}
                onChange={(e) =>
                  setDraft({ ...draft, address: e.target.value })
                }
                className="input"
                placeholder="232 Meeting St, Charleston, SC"
              />
            </Field>

            <Field label="Notes">
              <textarea
                value={draft.notes}
                onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                className="input min-h-[88px] resize-y"
                placeholder="Reservation confirmation, dress code, etc."
              />
            </Field>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Link URL">
                <input
                  type="url"
                  value={draft.link_url}
                  onChange={(e) =>
                    setDraft({ ...draft, link_url: e.target.value })
                  }
                  className="input"
                  placeholder="https://…"
                  inputMode="url"
                />
              </Field>
              <Field label="Photo URL">
                <input
                  type="url"
                  value={draft.photo_url}
                  onChange={(e) =>
                    setDraft({ ...draft, photo_url: e.target.value })
                  }
                  className="input"
                  placeholder="https://…"
                  inputMode="url"
                />
              </Field>
            </div>
          </div>

          <footer
            className="flex items-center justify-between gap-2 border-t border-harbor-100/70 bg-cream-50 px-4 py-3"
            style={{
              paddingBottom:
                "max(0.75rem, calc(0.75rem + env(safe-area-inset-bottom)))",
            }}
          >
            {mode === "edit" && existingId ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="rounded-lg border border-harbor-200 bg-white px-4 py-2.5 text-sm font-medium text-harbor-800 hover:bg-harbor-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-harbor-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-harbor-700 disabled:opacity-50"
              >
                {saving ? "Saving…" : mode === "create" ? "Add" : "Save"}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-harbor-700/80">
          {label}
        </span>
        {hint && (
          <span className="text-[11px] font-normal text-harbor-700/55">
            {hint}
          </span>
        )}
      </span>
      {children}
    </label>
  );
}
