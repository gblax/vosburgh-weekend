export function TripHeader() {
  return (
    <header className="relative overflow-hidden bg-harbor-800 isolate">
      <div className="absolute inset-0 bg-gradient-to-br from-harbor-800 via-harbor-700 to-palmetto-700" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/25 to-transparent" />
      <Palmettos />
      <div className="relative mx-auto flex max-w-3xl flex-col items-start px-5 pb-10 pt-12 sm:px-6 sm:pb-12 sm:pt-16">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-white ring-1 ring-inset ring-white/25 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-peach-300" />
          Vosburgh family weekend
        </span>
        <h1 className="mt-5 font-serif text-[2.25rem] font-bold leading-[1.05] tracking-tight text-white sm:text-[3.25rem]">
          Charleston,
          <br />
          <span className="text-peach-200">South Carolina</span>
        </h1>
        <p className="mt-3 text-sm font-medium text-white sm:text-base">
          Thursday, May 21 — Monday, May 25, 2026
        </p>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-cream-50 to-transparent" />
    </header>
  );
}

function Palmettos() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 240"
      className="pointer-events-none absolute -right-10 bottom-0 h-52 w-80 text-palmetto-300/40 sm:h-64 sm:w-[28rem]"
      preserveAspectRatio="xMaxYMax meet"
    >
      <g fill="currentColor">
        <path d="M310 240 V128 q-12 -10 -12 -26 q16 8 22 22 q-2 -28 8 -52 q4 30 -2 46 q16 -18 38 -22 q-12 22 -34 32 q26 -2 42 8 q-22 14 -42 10 q14 16 14 36 q-16 -8 -26 -24 V240z" />
        <path d="M362 240 V152 q-8 -8 -8 -22 q14 6 16 18 q-2 -20 6 -38 q4 22 -2 36 q14 -16 32 -18 q-12 18 -28 26 q22 -2 36 6 q-18 12 -36 8 q12 14 12 28 q-14 -6 -22 -20 V240z" />
      </g>
    </svg>
  );
}
