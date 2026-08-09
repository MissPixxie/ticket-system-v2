"use client";

export default function SkeletonTickets() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white/5 shadow-2xl">
      {/* FILTERS */}
      <div className="flex items-center gap-4 border-b border-white/10 p-5">
        <div className="h-5 w-12 animate-pulse rounded bg-white/10" />

        <div className="h-10 w-32 animate-pulse rounded-lg bg-white/10" />

        <div className="h-5 w-20 animate-pulse rounded bg-white/10" />

        <div className="h-10 w-36 animate-pulse rounded-lg bg-white/10" />

        <div className="h-10 w-56 animate-pulse rounded-lg bg-white/10" />
      </div>

      {/* TABLE HEADER */}
      <div className="grid grid-cols-6 border-b border-white/10 px-5 py-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-4 w-20 animate-pulse rounded bg-white/10" />
        ))}
      </div>

      {/* ROWS */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-6 items-center border-b border-white/5 px-5 py-5"
        >
          <div className="h-4 w-28 animate-pulse rounded bg-white/10" />

          <div className="h-4 w-20 animate-pulse rounded bg-white/10" />

          <div className="h-6 w-24 animate-pulse rounded-md bg-white/10" />

          <div className="h-6 w-16 animate-pulse rounded-md bg-white/10" />

          <div className="h-4 w-24 animate-pulse rounded bg-white/10" />

          <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
        </div>
      ))}
    </div>
  );
}
