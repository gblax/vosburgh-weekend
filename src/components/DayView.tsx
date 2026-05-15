"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { EventCard } from "./EventCard";
import { EventDialog, type EventDraft } from "./EventDialog";
import { WeatherWidget } from "./WeatherWidget";
import type { ItineraryEvent, EventDay } from "@/types/event";
import { getDay } from "@/lib/days";
import {
  classifyEvent,
  findNextEventId,
  getCharlestonNow,
} from "@/lib/time";
import { createClient } from "@/lib/supabase";

interface DayViewProps {
  day: EventDay;
  initialEvents: ItineraryEvent[];
}

function emptyDraft(day: EventDay): EventDraft {
  return {
    day,
    start_time: "09:00",
    end_time: "",
    title: "",
    location: "",
    address: "",
    notes: "",
    category: "activity",
    link_url: "",
    photo_url: "",
  };
}

function eventToDraft(event: ItineraryEvent): EventDraft {
  return {
    day: event.day,
    start_time: event.start_time.slice(0, 5),
    end_time: event.end_time ? event.end_time.slice(0, 5) : "",
    title: event.title,
    location: event.location ?? "",
    address: event.address ?? "",
    notes: event.notes ?? "",
    category: event.category,
    link_url: event.link_url ?? "",
    photo_url: event.photo_url ?? "",
  };
}

export function DayView({ day, initialEvents }: DayViewProps) {
  const router = useRouter();
  const dayInfo = getDay(day);
  const [events, setEvents] = useState(initialEvents);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [draftInitial, setDraftInitial] = useState<EventDraft>(emptyDraft(day));
  const [existingId, setExistingId] = useState<string | null>(null);

  const now = useMemo(() => getCharlestonNow(), []);
  const nextEventId = useMemo(
    () => findNextEventId(events, now),
    [events, now],
  );

  const sorted = useMemo(
    () => [...events].sort((a, b) => a.start_time.localeCompare(b.start_time)),
    [events],
  );

  function openCreate() {
    setDialogMode("create");
    setExistingId(null);
    setDraftInitial(emptyDraft(day));
    setDialogOpen(true);
  }

  function openEdit(event: ItineraryEvent) {
    setDialogMode("edit");
    setExistingId(event.id);
    setDraftInitial(eventToDraft(event));
    setDialogOpen(true);
  }

  async function handleSave(draft: EventDraft, id: string | null) {
    const supabase = createClient();
    const payload = {
      day: draft.day,
      start_time: draft.start_time,
      end_time: draft.end_time || null,
      title: draft.title.trim(),
      location: draft.location.trim() || null,
      address: draft.address.trim() || null,
      notes: draft.notes.trim() || null,
      category: draft.category,
      link_url: draft.link_url.trim() || null,
      photo_url: draft.photo_url.trim() || null,
    };
    if (id) {
      const { data, error } = await supabase
        .from("events")
        .update(payload)
        .eq("id", id)
        .select()
        .single();
      if (error) {
        alert(`Could not save: ${error.message}`);
        return;
      }
      if (draft.day === day) {
        setEvents((prev) =>
          prev.map((e) => (e.id === id ? (data as ItineraryEvent) : e)),
        );
      } else {
        setEvents((prev) => prev.filter((e) => e.id !== id));
      }
    } else {
      const { data, error } = await supabase
        .from("events")
        .insert(payload)
        .select()
        .single();
      if (error) {
        alert(`Could not add: ${error.message}`);
        return;
      }
      if (draft.day === day) {
        setEvents((prev) => [...prev, data as ItineraryEvent]);
      }
    }
    setDialogOpen(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) {
      alert(`Could not delete: ${error.message}`);
      return;
    }
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setDialogOpen(false);
    router.refresh();
  }

  return (
    <div
      style={{
        paddingBottom:
          "calc(6rem + env(safe-area-inset-bottom))",
      }}
    >
      <header className="mx-auto max-w-3xl px-4 pb-4 pt-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-peach-600">
              {dayInfo.dateLabel} · 2026
            </p>
            <h1 className="mt-1 font-serif text-3xl font-semibold text-harbor-900 sm:text-4xl">
              {dayInfo.weekday}
            </h1>
            <p className="mt-1 text-sm text-harbor-700/80">{dayInfo.tagline}</p>
          </div>
          <WeatherWidget date={dayInfo.date} />
        </div>
      </header>

      <section className="mx-auto max-w-3xl space-y-3 px-4">
        {sorted.length === 0 ? (
          <EmptyState onAdd={openCreate} />
        ) : (
          sorted.map((event) => {
            const { state } = classifyEvent(event, now, nextEventId);
            return (
              <EventCard
                key={event.id}
                event={event}
                status={state}
                onEdit={openEdit}
              />
            );
          })
        )}
      </section>

      <button
        type="button"
        onClick={openCreate}
        className="fixed right-5 z-20 inline-flex items-center gap-2 rounded-full bg-peach-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-peach-500/30 hover:bg-peach-600 active:translate-y-px"
        style={{
          bottom:
            "max(1.25rem, calc(1.25rem + env(safe-area-inset-bottom)))",
        }}
      >
        <Plus className="h-4 w-4" />
        Add event
      </button>

      <EventDialog
        open={dialogOpen}
        mode={dialogMode}
        initial={draftInitial}
        existingId={existingId}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-harbor-200 bg-white/60 p-8 text-center">
      <p className="font-serif text-lg text-harbor-900">Nothing planned yet</p>
      <p className="mt-1 text-sm text-harbor-700/80">
        Add the first event to start filling out this day.
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-harbor-600 px-4 py-2 text-sm font-semibold text-white hover:bg-harbor-700"
      >
        <Plus className="h-4 w-4" />
        Add event
      </button>
    </div>
  );
}
