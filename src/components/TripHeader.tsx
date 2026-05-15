export function TripHeader() {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-harbor-900 via-harbor-800 to-palmetto-800" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/30 via-black/5 to-transparent" />
      <Palmettos />
      <div className="relative mx-auto flex max-w-3xl flex-col items-start px-4 pb-6 pt-10 text-white sm:pb-8 sm:pt-14">
        <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white ring-1 ring-inset ring-white/25 backdrop-blur-sm">
          Vosburgh family weekend
        </span>
        <h1
          className="mt-3 font-serif text-4xl font-bold leading-tight text-white sm:text-5xl"
          style={{ textShadow: "0 2px 16px rgba(10, 35, 50, 0.6)" }}
        >
          Charleston,
          <br className="sm:hidden" /> South Carolina
        </h1>
        <p className="mt-2 text-sm font-medium text-white sm:text-base">
          Thursday, May 21 — Monday, May 25, 2026
        </p>
      </div>
    </header>
  );
}

function Palmettos() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 200"
      className="absolute -right-8 -bottom-2 h-44 w-72 opacity-30 text-palmetto-200 sm:h-56 sm:w-96"
      preserveAspectRatio="xMaxYMax meet"
    >
      <g fill="currentColor">
        <path d="M310 200 V120 q-10 -8 -10 -22 q14 6 18 18 q-2 -22 6 -42 q4 24 0 38 q14 -16 32 -18 q-10 18 -28 26 q22 -2 36 6 q-20 12 -36 8 q12 14 12 30 q-14 -6 -22 -20 V200z" />
        <path d="M350 200 V140 q-8 -6 -8 -18 q12 4 14 16 q-2 -16 4 -32 q4 18 0 30 q12 -12 26 -14 q-10 14 -22 22 q18 -2 30 4 q-16 10 -30 6 q10 12 10 24 q-12 -4 -18 -16 V200z" />
      </g>
    </svg>
  );
}
