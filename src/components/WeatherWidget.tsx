"use client";

import { useEffect, useState } from "react";

interface WeatherWidgetProps {
  date: string;
}

interface WeatherData {
  high: number;
  low: number;
  code: number;
  description: string;
  emoji: string;
}

export function WeatherWidget({ date }: WeatherWidgetProps) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/weather?date=${date}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed");
        return r.json();
      })
      .then((d: WeatherData | { error: string }) => {
        if (cancelled) return;
        if ("error" in d) {
          setError(d.error);
        } else {
          setData(d);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Forecast unavailable");
      });
    return () => {
      cancelled = true;
    };
  }, [date]);

  if (error) {
    return (
      <span className="text-xs text-harbor-700/60">
        Forecast not yet available
      </span>
    );
  }

  if (!data) {
    return (
      <span className="text-xs text-harbor-700/60">Loading forecast…</span>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-harbor-200 bg-white/80 px-3 py-1 text-sm text-harbor-900 shadow-sm">
      <span className="text-base leading-none">{data.emoji}</span>
      <span className="font-medium">
        {Math.round(data.high)}° / {Math.round(data.low)}°
      </span>
      <span className="text-xs text-harbor-700/80">{data.description}</span>
    </div>
  );
}
