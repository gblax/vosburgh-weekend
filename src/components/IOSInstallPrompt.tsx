"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "vosburgh-ios-install-dismissed";

interface SafariNavigator extends Navigator {
  standalone?: boolean;
}

export function IOSInstallPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ua = window.navigator.userAgent;
    const isIos =
      /iPhone|iPad|iPod/.test(ua) ||
      (ua.includes("Macintosh") && "ontouchend" in document);
    const nav = window.navigator as SafariNavigator;
    const isStandalone =
      nav.standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches;
    let dismissed = false;
    try {
      dismissed = window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // ignore — fall back to showing it
    }
    if (isIos && !isStandalone && !dismissed) {
      const t = window.setTimeout(() => setShow(true), 1800);
      return () => window.clearTimeout(t);
    }
  }, []);

  function dismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3"
      style={{
        paddingBottom:
          "max(0.75rem, calc(0.75rem + env(safe-area-inset-bottom)))",
      }}
    >
      <div className="pointer-events-auto w-full max-w-md animate-[slideup_220ms_ease-out] rounded-2xl border border-harbor-200 bg-white p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-harbor-800 via-harbor-700 to-palmetto-700 font-serif text-xl font-bold italic text-cream-50 shadow-inner">
            C
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-serif text-base font-semibold text-harbor-900">
              Add to your Home Screen
            </p>
            <p className="mt-0.5 text-sm leading-snug text-harbor-700/85">
              Tap <IOSShareGlyph /> then{" "}
              <span className="font-medium text-harbor-900">
                Add to Home Screen
              </span>{" "}
              for a quicker way back to the trip.
            </p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="-mr-1 -mt-1 rounded-full p-1.5 text-harbor-700/55 hover:bg-harbor-100 hover:text-harbor-900"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function IOSShareGlyph() {
  return (
    <span className="mx-0.5 inline-flex h-5 w-5 -translate-y-0.5 items-center justify-center align-middle rounded-md bg-harbor-50 text-harbor-700">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5"
        aria-hidden
      >
        <path d="M12 3v12" />
        <path d="m7 8 5-5 5 5" />
        <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
      </svg>
    </span>
  );
}
