import type { EventDay } from "@/types/event";

export interface DayInfo {
  slug: EventDay;
  shortLabel: string;
  weekday: string;
  date: string;
  dateLabel: string;
  tagline: string;
}

export const DAYS: readonly DayInfo[] = [
  {
    slug: "thursday",
    shortLabel: "Thu",
    weekday: "Thursday",
    date: "2026-05-21",
    dateLabel: "May 21",
    tagline: "Arrival day",
  },
  {
    slug: "friday",
    shortLabel: "Fri",
    weekday: "Friday",
    date: "2026-05-22",
    dateLabel: "May 22",
    tagline: "First full day",
  },
  {
    slug: "saturday",
    shortLabel: "Sat",
    weekday: "Saturday",
    date: "2026-05-23",
    dateLabel: "May 23",
    tagline: "Weekend in the Holy City",
  },
  {
    slug: "sunday",
    shortLabel: "Sun",
    weekday: "Sunday",
    date: "2026-05-24",
    dateLabel: "May 24",
    tagline: "Lowcountry Sunday",
  },
  {
    slug: "monday",
    shortLabel: "Mon",
    weekday: "Monday",
    date: "2026-05-25",
    dateLabel: "May 25",
    tagline: "Departure day",
  },
] as const;

export function isValidDay(slug: string): slug is EventDay {
  return DAYS.some((d) => d.slug === slug);
}

export function getDay(slug: EventDay): DayInfo {
  const day = DAYS.find((d) => d.slug === slug);
  if (!day) throw new Error(`Unknown day: ${slug}`);
  return day;
}
