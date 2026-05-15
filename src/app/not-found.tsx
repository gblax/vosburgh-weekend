import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-peach-600">
        404
      </p>
      <h1 className="mt-2 font-serif text-3xl text-harbor-900">
        That day isn&apos;t on this trip.
      </h1>
      <p className="mt-2 text-harbor-700/80">
        Try one of the days in the tab bar above, or go back to the overview.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-full bg-harbor-600 px-4 py-2 text-sm font-semibold text-white hover:bg-harbor-700"
      >
        Back to overview
      </Link>
    </div>
  );
}
