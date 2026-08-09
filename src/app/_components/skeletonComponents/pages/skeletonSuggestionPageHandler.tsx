"use client";

export default function SkeletonSuggestionPageHandler() {
  return (
    <main className="main-page-layout">
      <div className="container">
        {/* HEADER */}
        <div className="header-container">
          <div className="h-9 w-9 animate-pulse rounded-full bg-white/10" />

          <div className="h-8 w-72 animate-pulse rounded-lg bg-white/10" />
        </div>

        {/* FILTER + SEARCH */}
        <div className="mt-10 flex items-end justify-between">
          <div className="flex gap-3">
            {/* Senaste */}
            <div className="h-9 w-24 animate-pulse rounded-lg bg-white/10" />

            {/* Mest röster */}
            <div className="h-9 w-32 animate-pulse rounded-lg bg-white/10" />

            {/* Status */}
            <div className="h-9 w-24 animate-pulse rounded-lg bg-white/10" />
          </div>

          {/* Search */}
          <div className="h-12 w-100 animate-pulse rounded-xl bg-white/10" />
        </div>

        {/* SUGGESTIONS */}
        <div className="mt-10 space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SuggestionSkeletonCard key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}

function SuggestionSkeletonCard() {
  return (
    <div className="flex items-center gap-5 rounded-xl bg-white/5 p-4">
      {/* VOTES */}
      <div className="flex w-12 shrink-0 flex-col items-center gap-1">
        <div className="h-6 w-6 animate-pulse rounded bg-white/10" />
        <div className="h-4 w-5 animate-pulse rounded bg-white/10" />
      </div>

      {/* CONTENT */}
      <div className="min-w-0 flex-1">
        {/* Title */}
        <div className="h-5 w-3/5 animate-pulse rounded bg-white/10" />

        {/* User + date */}
        <div className="mt-2 h-3 w-32 animate-pulse rounded bg-white/10" />
      </div>

      {/* STATUS */}
      <div className="h-7 w-28 shrink-0 animate-pulse rounded-full bg-white/10" />
    </div>
  );
}
