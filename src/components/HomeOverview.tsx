"use client";

import { useMemo } from "react";
import Link from "next/link";
import { CalendarDays, MapPin, Plus, ArrowRight } from "lucide-react";
import { DAYS } from "@/lib/days";
import { CATEGORIES } from "@/lib/categories";
import type { ItineraryEvent } from "@/types/event";
import {
  classifyEvent,
  daysUntilTrip,
  findNextEventId,
  formatTime,
  getCharlestonNow,
  tripPhase,
} from "@/lib/time";

interface HomeOverviewProps {
  events: ItineraryEvent[];
}

export function HomeOverview({ events }: HomeOverviewProps) {
  const now = useMemo(() => getCharlestonNow(), []);
  const phase = useMemo(() => tripPhase(now), [now]);
  const countdown = useMemo(() => daysUntilTrip(now), [now]);
  const nextEventId = useMemo(
    () => findNextEventId(events, now),
    [events, now],
  );
  const nextEvent = events.find((e) => e.id === nextEventId) ?? null;
  const currentEvent = useMemo(
    () =>
      events.find(
        (e) => classifyEvent(e, now, nextEventId).state === "now",
      ) ?? null,
    [events, now, nextEventId],
  );

  const countsByDay = useMemo(() => {
    const map: Record<string, number> = {};
    for (const e of events) map[e.day] = (map[e.day] ?? 0) + 1;
    return map;
  }, [events]);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 pb-16 pt-6">
      <StatusBanner
        phase={phase}
        countdown={countdown}
        currentEvent={currentEvent}
        nextEvent={nextEvent}
      />

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-harbor-700/80">
          <CalendarDays className="h-3.5 w-3.5" />
          Five days in Charleston
        </h2>
        <ul className="space-y-3">
          {DAYS.map((day) => {
            const count = countsByDay[day.slug] ?? 0;
            const isToday = day.date === now.date;
            return (
              <li key={day.slug}>
                <Link
                  href={`/${day.slug}`}
                  className={[
                    "group flex items-center justify-between rounded-2xl border bg-white p-4 shadow-card transition-colors",
                    isToday
                      ? "border-peach-300 ring-2 ring-peach-200"
                      : "border-harbor-100 hover:border-harbor-300",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={[
                        "flex h-14 w-14 flex-col items-center justify-center rounded-xl",
                        isToday
                          ? "bg-peach-500 text-white"
                          : "bg-harbor-50 text-harbor-800",
                      ].join(" ")}
                    >
                      <span className="text-[10px] font-semibold uppercase tracking-wider">
                        {day.shortLabel}
                      </span>
                      <span className="text-xl font-bold leading-none">
                        {day.dateLabel.replace("May ", "")}
                      </span>
                    </div>
                    <div>
                      <p className="font-serif text-lg font-semibold text-harbor-900">
                        {day.weekday}
                      </p>
                      <p className="text-sm text-harbor-700/80">
                        {day.tagline}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-harbor-700/80">
                    <span className="hidden sm:inline">
                      {count} {count === 1 ? "event" : "events"}
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-2xl border border-harbor-100 bg-white p-5 shadow-card">
        <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-harbor-700/80">
          <MapPin className="h-3.5 w-3.5" />
          Home base
        </h2>
        <p className="mt-2 font-serif text-lg text-harbor-900">
          956 Pine Hollow Road
        </p>
        <p className="text-sm text-harbor-700/80">
          Mount Pleasant, SC 29464
        </p>
        <a
          href="https://www.google.com/maps/search/?api=1&query=956+Pine+Hollow+Road+Mount+Pleasant+SC+29464"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-harbor-700 underline-offset-2 hover:underline"
        >
          Open in Google Maps
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </section>

      <section className="rounded-2xl border border-dashed border-harbor-200 bg-cream-50/80 p-5 text-sm text-harbor-800">
        <p className="font-serif text-base">
          Anyone with this link can add and edit events.
        </p>
        <p className="mt-1 text-harbor-700/85">
          Tap a day above to see what&apos;s planned, or hit the{" "}
          <span className="inline-flex items-center gap-1 rounded-full bg-peach-500 px-2 py-0.5 text-xs font-semibold text-white">
            <Plus className="h-3 w-3" /> Add event
          </span>{" "}
          button on any day to add new plans.
        </p>
      </section>
    </div>
  );
}

function StatusBanner({
  phase,
  countdown,
  currentEvent,
  nextEvent,
}: {
  phase: "before" | "during" | "after";
  countdown: number;
  currentEvent: ItineraryEvent | null;
  nextEvent: ItineraryEvent | null;
}) {
  if (phase === "during" && currentEvent) {
    const cat = CATEGORIES[currentEvent.category];
    return (
      <div className="rounded-2xl border border-peach-300 bg-peach-50 p-5 shadow-card">
        <span className="inline-flex items-center gap-1 rounded-full bg-peach-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
          Happening now
        </span>
        <p className="mt-2 flex items-center gap-2 font-serif text-xl text-harbor-900">
          <span>{cat.emoji}</span>
          {currentEvent.title}
        </p>
        {currentEvent.location && (
          <p className="mt-0.5 text-sm text-harbor-700/85">
            {currentEvent.location}
          </p>
        )}
        {nextEvent && <NextUp event={nextEvent} />}
      </div>
    );
  }
  if (phase === "during" && nextEvent) {
    const cat = CATEGORIES[nextEvent.category];
    return (
      <div className="rounded-2xl border border-harbor-200 bg-harbor-50 p-5 shadow-card">
        <span className="inline-flex items-center gap-1 rounded-full bg-harbor-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
          Up next
        </span>
        <p className="mt-2 flex items-center gap-2 font-serif text-xl text-harbor-900">
          <span>{cat.emoji}</span>
          {nextEvent.title}
        </p>
        <p className="mt-0.5 text-sm text-harbor-700/85">
          {formatTime(nextEvent.start_time)}
          {nextEvent.location ? ` · ${nextEvent.location}` : ""}
        </p>
      </div>
    );
  }
  if (phase === "before") {
    const label =
      countdown === 0
        ? "The trip starts today"
        : countdown === 1
          ? "1 day until the Vosburghs arrive"
          : `${countdown} days until the Vosburghs arrive`;
    return (
      <div className="rounded-2xl border border-harbor-200 bg-white p-5 shadow-card">
        <span className="inline-flex items-center gap-1 rounded-full bg-harbor-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-harbor-800">
          Countdown
        </span>
        <p className="mt-2 font-serif text-2xl text-harbor-900">{label}</p>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-harbor-200 bg-white p-5 shadow-card">
      <span className="inline-flex items-center gap-1 rounded-full bg-palmetto-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-palmetto-800">
        Trip recap
      </span>
      <p className="mt-2 font-serif text-xl text-harbor-900">
        Hope it was a great weekend.
      </p>
    </div>
  );
}

function NextUp({ event }: { event: ItineraryEvent }) {
  const cat = CATEGORIES[event.category];
  return (
    <div className="mt-4 border-t border-peach-200 pt-3">
      <span className="text-[10px] font-bold uppercase tracking-wider text-peach-700">
        Up next
      </span>
      <p className="mt-1 flex items-center gap-2 text-base text-harbor-900">
        <span>{cat.emoji}</span>
        <span className="font-medium">{event.title}</span>
        <span className="text-harbor-700/70">
          · {formatTime(event.start_time)}
        </span>
      </p>
    </div>
  );
}
