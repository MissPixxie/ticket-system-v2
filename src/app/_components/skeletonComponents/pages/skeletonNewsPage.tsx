"use client";

export default function SkeletonNewsPage() {
  return (
    <main className="main-page-layout">
      <div className="container">
        {/* HEADER */}
        <div className="mb-8 flex items-center gap-4">
          {/* Icon */}
          <div className="h-9 w-9 animate-pulse rounded-full bg-white/10" />

          <div>
            {/* Title */}
            <div className="h-8 w-64 animate-pulse rounded-lg bg-white/10" />
          </div>
        </div>

        {/* SEARCH */}
        <div className="relative">
          <div className="h-12 w-full animate-pulse rounded-xl bg-white/5" />
        </div>

        {/* NEWS */}
        <div className="mt-4 space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="card w-full">
              {/* TITLE */}
              <div
                className={`h-5 animate-pulse rounded bg-white/10 ${
                  index % 2 === 0 ? "w-40" : "w-56"
                }`}
              />

              {/* CONTENT */}
              <div className="mt-3 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />
              </div>

              {/* AUTHOR / DATE */}
              <div className="mt-3 h-3 w-32 animate-pulse rounded bg-white/10" />

              {/* VOTES */}
              <div className="mt-4 flex items-center gap-3">
                <div className="h-4 w-36 animate-pulse rounded bg-white/10" />

                <div className="h-8 w-14 animate-pulse rounded-lg bg-white/10" />

                <div className="h-8 w-14 animate-pulse rounded-lg bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
