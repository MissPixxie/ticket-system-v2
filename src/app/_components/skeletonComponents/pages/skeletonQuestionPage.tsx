"use client";

export default function SkeletonQuestionPage() {
  return (
    <main className="main-page-layout">
      <div className="container">
        {/* HEADER */}
        <div className="mb-8 flex items-center gap-4">
          {/* Icon */}
          <div className="h-9 w-9 animate-pulse rounded-full bg-white/10" />

          <div>
            {/* Title */}
            <div className="h-8 w-52 animate-pulse rounded-lg bg-white/10" />

            {/* Subtitle */}
            <div className="mt-2 h-4 w-72 animate-pulse rounded bg-white/10" />
          </div>
        </div>

        {/* CREATE QUESTION */}
        <div className="mb-8 rounded-3xl border border-white/5 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
          {/* Heading */}
          <div className="mb-3 flex items-center justify-between">
            <div className="h-5 w-28 animate-pulse rounded bg-white/10" />

            <div className="h-4 w-12 animate-pulse rounded bg-white/10" />
          </div>

          {/* Textarea */}
          <div className="h-28 w-full animate-pulse rounded-2xl bg-black/20" />

          {/* Button */}
          <div className="mt-4 flex justify-end">
            <div className="h-10 w-28 animate-pulse rounded-xl bg-white/10" />
          </div>
        </div>

        {/* QUESTIONS */}
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-3xl border border-white/5 bg-white/5 p-5 shadow-xl"
            >
              <div>
                {/* Question */}
                <div
                  className={`h-5 animate-pulse rounded bg-white/10 ${
                    index % 2 === 0 ? "w-64" : "w-80"
                  }`}
                />

                {/* Author + date */}
                <div className="mt-3 h-3 w-36 animate-pulse rounded bg-white/10" />
              </div>

              {/* Chevron */}
              <div className="h-5 w-5 animate-pulse rounded bg-white/10" />
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        <div className="mt-8 flex justify-center gap-3">
          <div className="h-9 w-24 animate-pulse rounded-xl bg-white/10" />
          <div className="h-9 w-28 animate-pulse rounded-xl bg-white/10" />
        </div>
      </div>
    </main>
  );
}
