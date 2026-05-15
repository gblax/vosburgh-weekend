"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DAYS } from "@/lib/days";

export function DayTabs() {
  const pathname = usePathname();
  const active = pathname.split("/")[1] || "home";

  return (
    <nav
      className="sticky top-0 z-30 border-b border-harbor-100 bg-cream-50/90 backdrop-blur supports-[backdrop-filter]:bg-cream-50/75"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto max-w-3xl px-3">
        <ul className="flex items-stretch justify-between gap-1 py-2 sm:gap-2">
          <li className="flex">
            <Link
              href="/"
              className={tabClass(active === "home")}
              aria-current={active === "home" ? "page" : undefined}
            >
              <span className="text-base font-semibold leading-tight">
                Trip
              </span>
              <span className="text-[10px] uppercase tracking-wider text-harbor-700/70">
                Overview
              </span>
            </Link>
          </li>
          {DAYS.map((day) => {
            const isActive = active === day.slug;
            return (
              <li key={day.slug} className="flex">
                <Link
                  href={`/${day.slug}`}
                  className={tabClass(isActive)}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="text-base font-semibold leading-tight">
                    {day.shortLabel}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-harbor-700/70">
                    {day.dateLabel.replace("May ", "")}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

function tabClass(active: boolean) {
  return [
    "flex flex-1 flex-col items-center justify-center rounded-lg px-2 py-1.5 transition-colors min-w-0",
    active
      ? "bg-harbor-600 text-white shadow-sm [&_span]:text-white"
      : "text-harbor-800 hover:bg-harbor-100/70",
  ].join(" ");
}
