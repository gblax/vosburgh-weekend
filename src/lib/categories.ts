import type { EventCategory } from "@/types/event";

export interface CategoryStyle {
  label: string;
  emoji: string;
  cardBg: string;
  cardBorder: string;
  badgeBg: string;
  badgeText: string;
  dot: string;
}

export const CATEGORIES: Record<EventCategory, CategoryStyle> = {
  meal: {
    label: "Meal",
    emoji: "🍽️",
    cardBg: "bg-amber-50",
    cardBorder: "border-amber-200",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-800",
    dot: "bg-amber-500",
  },
  activity: {
    label: "Activity",
    emoji: "🎯",
    cardBg: "bg-harbor-50",
    cardBorder: "border-harbor-200",
    badgeBg: "bg-harbor-100",
    badgeText: "text-harbor-800",
    dot: "bg-harbor-500",
  },
  travel: {
    label: "Travel",
    emoji: "✈️",
    cardBg: "bg-violet-50",
    cardBorder: "border-violet-200",
    badgeBg: "bg-violet-100",
    badgeText: "text-violet-800",
    dot: "bg-violet-500",
  },
  lodging: {
    label: "Lodging",
    emoji: "🏠",
    cardBg: "bg-palmetto-50",
    cardBorder: "border-palmetto-200",
    badgeBg: "bg-palmetto-100",
    badgeText: "text-palmetto-800",
    dot: "bg-palmetto-500",
  },
  drinks: {
    label: "Drinks",
    emoji: "🍹",
    cardBg: "bg-rose-50",
    cardBorder: "border-rose-200",
    badgeBg: "bg-rose-100",
    badgeText: "text-rose-800",
    dot: "bg-rose-500",
  },
  free_time: {
    label: "Free Time",
    emoji: "☀️",
    cardBg: "bg-cream-100",
    cardBorder: "border-stone-200",
    badgeBg: "bg-stone-100",
    badgeText: "text-stone-700",
    dot: "bg-stone-400",
  },
};

export const CATEGORY_VALUES: EventCategory[] = [
  "meal",
  "activity",
  "travel",
  "lodging",
  "drinks",
  "free_time",
];
