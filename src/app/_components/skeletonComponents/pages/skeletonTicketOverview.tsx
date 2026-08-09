"use client";

export default function SkeletonTicketOverview() {
  return (
    <main className="main-page-layout">
      <div className="container">
        {/* HEADER */}
        <div className="mb-10 flex items-center gap-4">
          <div className="h-9 w-9 animate-pulse rounded-lg bg-white/10" />

          <div className="h-8 w-52 animate-pulse rounded-lg bg-white/10" />
        </div>

        {/* STATISTICS */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white/5 p-6 shadow-lg/15"
            >
              {/* Label */}
              <div className="h-4 w-28 animate-pulse rounded bg-white/10" />

              {/* Number */}
              <div className="mt-3 h-8 w-10 animate-pulse rounded bg-white/10" />
            </div>
          ))}
        </div>

        {/* TICKET TABLE */}
        <div className="mt-24 overflow-hidden rounded-2xl bg-white/5 shadow-lg/15">
          {/* FILTERS */}
          <div className="flex items-center gap-4 border-b border-white/10 p-5">
            {/* Status label */}
            <div className="h-4 w-12 animate-pulse rounded bg-white/10" />

            {/* Status select */}
            <div className="h-10 w-32 animate-pulse rounded-lg bg-white/10" />

            {/* Department label */}
            <div className="h-4 w-20 animate-pulse rounded bg-white/10" />

            {/* Department select */}
            <div className="h-10 w-36 animate-pulse rounded-lg bg-white/10" />

            {/* Search */}
            <div className="h-10 w-56 animate-pulse rounded-lg bg-white/10" />

            {/* New ticket */}
            <div className="ml-auto h-12 w-36 animate-pulse rounded-lg bg-white/10" />
          </div>

          {/* TABLE HEADER */}
          <div className="grid grid-cols-6 border-b border-white/10 px-5 py-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-4 w-20 animate-pulse rounded bg-white/10"
              />
            ))}
          </div>

          {/* TICKET ROWS */}
          <div>
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-6 items-center border-b border-white/5 px-5 py-5 last:border-b-0"
              >
                {/* Titel */}
                <div
                  className={`h-4 animate-pulse rounded bg-white/10 ${
                    index % 2 === 0 ? "w-24" : "w-32"
                  }`}
                />

                {/* Avdelning */}
                <div className="h-4 w-20 animate-pulse rounded bg-white/10" />

                {/* Status */}
                <div className="h-6 w-24 animate-pulse rounded-md bg-white/10" />

                {/* Prioritet */}
                <div className="h-6 w-16 animate-pulse rounded-md bg-white/10" />

                {/* Skapad */}
                <div className="h-4 w-24 animate-pulse rounded bg-white/10" />

                {/* Hanteras av */}
                <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
