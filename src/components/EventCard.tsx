"use client";

import { MapPin, Pencil, ExternalLink, FileText } from "lucide-react";
import type { ItineraryEvent } from "@/types/event";
import { CATEGORIES } from "@/lib/categories";
import { formatTimeRange } from "@/lib/time";

interface EventCardProps {
  event: ItineraryEvent;
  status: "past" | "now" | "next" | "future";
  onEdit: (event: ItineraryEvent) => void;
}

export function EventCard({ event, status, onEdit }: EventCardProps) {
  const cat = CATEGORIES[event.category];
  const ringByStatus =
    status === "now"
      ? "ring-2 ring-peach-400 ring-offset-2 ring-offset-cream-50"
      : status === "next"
        ? "ring-1 ring-harbor-300"
        : "";
  const fade = status === "past" ? "opacity-60" : "";
  const mapHref = event.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`
    : event.location
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`
      : null;

  return (
    <article
      className={[
        "relative rounded-2xl border bg-white p-4 shadow-card transition-all",
        cat.cardBorder,
        ringByStatus,
        fade,
      ].join(" ")}
    >
      {(status === "now" || status === "next") && (
        <div className="absolute -top-2 left-4 z-10">
          <span
            className={[
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow-sm",
              status === "now"
                ? "bg-peach-500 animate-pulse"
                : "bg-harbor-600",
            ].join(" ")}
          >
            {status === "now" ? "Happening now" : "Up next"}
          </span>
        </div>
      )}
      <div className="flex items-start gap-3">
        <div
          className={[
            "flex flex-col items-center rounded-xl px-3 py-2 text-center",
            cat.cardBg,
          ].join(" ")}
        >
          <span className="text-lg leading-none">{cat.emoji}</span>
          <span className="mt-1 whitespace-nowrap text-xs font-semibold text-harbor-900">
            {formatTimeRange(event.start_time, event.end_time).split(" – ")[0]}
          </span>
          {event.end_time && (
            <span className="text-[10px] text-harbor-700/70">
              to{" "}
              {formatTimeRange(event.start_time, event.end_time).split(" – ")[1]}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-lg font-semibold leading-tight text-harbor-900">
              {event.title}
            </h3>
            <button
              type="button"
              onClick={() => onEdit(event)}
              className="rounded-full p-1.5 text-harbor-700/60 hover:bg-harbor-100 hover:text-harbor-900"
              aria-label="Edit event"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span
              className={[
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                cat.badgeBg,
                cat.badgeText,
              ].join(" ")}
            >
              {cat.label}
            </span>
            {event.location && (
              <span className="inline-flex items-center gap-1 text-xs text-harbor-700/80">
                <MapPin className="h-3.5 w-3.5" />
                {event.location}
              </span>
            )}
          </div>
          {event.notes && (
            <p className="mt-2 flex items-start gap-1.5 text-sm leading-relaxed text-harbor-800/85">
              <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-harbor-700/50" />
              <span>{event.notes}</span>
            </p>
          )}
          {(mapHref || event.link_url || event.photo_url) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {mapHref && (
                <a
                  href={mapHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-harbor-200 bg-white px-2.5 py-1 text-xs font-medium text-harbor-800 hover:bg-harbor-50"
                >
                  <MapPin className="h-3 w-3" />
                  Directions
                </a>
              )}
              {event.link_url && (
                <a
                  href={event.link_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-harbor-200 bg-white px-2.5 py-1 text-xs font-medium text-harbor-800 hover:bg-harbor-50"
                >
                  <ExternalLink className="h-3 w-3" />
                  Link
                </a>
              )}
            </div>
          )}
          {event.photo_url && (
            <div className="mt-3 overflow-hidden rounded-lg border border-harbor-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={event.photo_url}
                alt={event.title}
                className="max-h-64 w-full object-cover"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
