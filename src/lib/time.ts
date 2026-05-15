import { DAYS } from "./days";
import type { EventDay, ItineraryEvent } from "@/types/event";

const CHARLESTON_TZ = "America/New_York";

export interface CharlestonNow {
  date: string;
  time: string;
}

export function getCharlestonNow(now: Date = new Date()): CharlestonNow {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: CHARLESTON_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  let hour = get("hour");
  if (hour === "24") hour = "00";
  const date = `${get("year")}-${get("month")}-${get("day")}`;
  const time = `${hour}:${get("minute")}:${get("second")}`;
  return { date, time };
}

export function findDayForDate(date: string): EventDay | null {
  return DAYS.find((d) => d.date === date)?.slug ?? null;
}

export function formatTime(value: string): string {
  const [hStr, mStr] = value.split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const period = h >= 12 ? "PM" : "AM";
  const display = h % 12 === 0 ? 12 : h % 12;
  const minutes = m.toString().padStart(2, "0");
  return `${display}:${minutes} ${period}`;
}

export function formatTimeRange(
  start: string,
  end: string | null | undefined,
): string {
  if (!end) return formatTime(start);
  return `${formatTime(start)} – ${formatTime(end)}`;
}

export interface EventStatus {
  state: "past" | "now" | "next" | "future";
  isCurrentDay: boolean;
}

export function classifyEvent(
  event: ItineraryEvent,
  now: CharlestonNow,
  nextEventId: string | null,
): EventStatus {
  const day = DAYS.find((d) => d.slug === event.day);
  if (!day) return { state: "future", isCurrentDay: false };
  const isCurrentDay = day.date === now.date;
  if (!isCurrentDay) {
    return {
      state: day.date < now.date ? "past" : "future",
      isCurrentDay: false,
    };
  }
  const start = event.start_time.slice(0, 8);
  const end = (event.end_time ?? event.start_time).slice(0, 8);
  if (now.time >= start && now.time < end) {
    return { state: "now", isCurrentDay: true };
  }
  if (now.time >= end) {
    return { state: "past", isCurrentDay: true };
  }
  if (event.id === nextEventId) {
    return { state: "next", isCurrentDay: true };
  }
  return { state: "future", isCurrentDay: true };
}

export function findNextEventId(
  events: ItineraryEvent[],
  now: CharlestonNow,
): string | null {
  const upcoming = events
    .filter((e) => {
      const day = DAYS.find((d) => d.slug === e.day);
      if (!day) return false;
      if (day.date > now.date) return true;
      if (day.date < now.date) return false;
      return e.start_time.slice(0, 8) > now.time;
    })
    .sort((a, b) => {
      const dayA = DAYS.find((d) => d.slug === a.day)!.date;
      const dayB = DAYS.find((d) => d.slug === b.day)!.date;
      if (dayA !== dayB) return dayA < dayB ? -1 : 1;
      return a.start_time < b.start_time ? -1 : 1;
    });
  return upcoming[0]?.id ?? null;
}

export function tripPhase(
  now: CharlestonNow,
): "before" | "during" | "after" {
  const first = DAYS[0].date;
  const last = DAYS[DAYS.length - 1].date;
  if (now.date < first) return "before";
  if (now.date > last) return "after";
  return "during";
}

export function daysUntilTrip(now: CharlestonNow): number {
  const first = DAYS[0].date;
  const startDate = new Date(`${first}T00:00:00Z`);
  const nowDate = new Date(`${now.date}T00:00:00Z`);
  return Math.round(
    (startDate.getTime() - nowDate.getTime()) / (24 * 60 * 60 * 1000),
  );
}
