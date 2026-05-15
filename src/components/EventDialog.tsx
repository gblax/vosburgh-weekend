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
    if (open) {
      setTimeout(() => titleRef.current?.focus(), 50);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
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
      className="fixed inset-0 z-50 flex items-end justify-center bg-harbor-900/40 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg overflow-y-auto rounded-t-2xl bg-cream-50 shadow-2xl sm:rounded-2xl"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-harbor-100 bg-cream-50 px-4 py-3">
          <h2 className="font-serif text-lg font-semibold text-harbor-900">
            {mode === "create" ? "Add Event" : "Edit Event"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-harbor-700/70 hover:bg-harbor-100"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </header>
        <form onSubmit={handleSubmit} className="space-y-3 px-4 py-4">
          <Field label="Title">
            <input
              ref={titleRef}
              type="text"
              required
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              className="input"
              placeholder="Dinner at FIG"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Day">
              <select
                value={draft.day}
                onChange={(e) =>
                  setDraft({ ...draft, day: e.target.value as EventDay })
                }
                className="input"
              >
                <option value="thursday">Thu · May 21</option>
                <option value="friday">Fri · May 22</option>
                <option value="saturday">Sat · May 23</option>
                <option value="sunday">Sun · May 24</option>
                <option value="monday">Mon · May 25</option>
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
                className="input"
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
                className="input"
              />
            </Field>
            <Field label="End time (optional)">
              <input
                type="time"
                value={draft.end_time}
                onChange={(e) =>
                  setDraft({ ...draft, end_time: e.target.value })
                }
                className="input"
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

          <Field label="Address (for map link)">
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
              className="input min-h-[72px]"
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
              />
            </Field>
          </div>

          <footer className="flex items-center justify-between gap-3 pt-2">
            {mode === "edit" && existingId ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 disabled:opacity-50"
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
                className="rounded-lg border border-harbor-200 bg-white px-4 py-2 text-sm font-medium text-harbor-800 hover:bg-harbor-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-harbor-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-harbor-700 disabled:opacity-50"
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
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-harbor-700/80">
        {label}
      </span>
      {children}
    </label>
  );
}
