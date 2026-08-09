"use client";

export default function SkeletonTicketDetails() {
  return (
    <main className="main-page-layout">
      <div className="container">
        {/* BACK */}
        <div className="mb-4 h-4 w-16 animate-pulse rounded bg-white/10" />

        {/* TICKET HEADER */}
        <div className="mb-10 flex items-center justify-between rounded-2xl bg-white/5 p-6 shadow-lg/15">
          <div>
            {/* Title */}
            <div className="h-7 w-40 animate-pulse rounded-lg bg-white/10" />

            {/* Department */}
            <div className="mt-2 h-4 w-12 animate-pulse rounded bg-white/10" />
          </div>

          {/* Status + Priority */}
          <div className="flex gap-2">
            <div className="h-6 w-20 animate-pulse rounded-full bg-white/10" />
            <div className="h-6 w-12 animate-pulse rounded-full bg-white/10" />
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          {/* LEFT */}
          <div className="space-y-6">
            {/* DESCRIPTION */}
            <div className="rounded-2xl bg-white/5 p-6 shadow-lg/15">
              <div className="h-5 w-28 animate-pulse rounded bg-white/10" />

              <div className="mt-5 space-y-3">
                <div className="h-4 w-full animate-pulse rounded bg-white/10" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
              </div>
            </div>

            {/* INFORMATION */}
            <div className="rounded-2xl bg-white/5 p-6 shadow-lg/15">
              <div className="h-5 w-28 animate-pulse rounded bg-white/10" />

              <div className="mt-6 grid grid-cols-2 gap-x-12 gap-y-6">
                {/* Created by */}
                <div>
                  <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
                  <div className="mt-2 h-4 w-16 animate-pulse rounded bg-white/10" />
                </div>

                {/* Assigned to */}
                <div>
                  <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
                  <div className="mt-2 h-4 w-20 animate-pulse rounded bg-white/10" />
                </div>

                {/* Participant */}
                <div>
                  <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
                  <div className="mt-2 h-4 w-20 animate-pulse rounded bg-white/10" />
                </div>

                {/* Created */}
                <div>
                  <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
                  <div className="mt-2 h-4 w-32 animate-pulse rounded bg-white/10" />
                </div>

                {/* Status */}
                <div>
                  <div className="h-3 w-14 animate-pulse rounded bg-white/10" />
                  <div className="mt-2 h-4 w-20 animate-pulse rounded bg-white/10" />
                </div>
              </div>

              {/* CONTROLS */}
              <div className="mt-6 flex items-end gap-4">
                <div>
                  <div className="mb-2 h-3 w-12 animate-pulse rounded bg-white/10" />
                  <div className="h-11 w-32 animate-pulse rounded-xl bg-white/10" />
                </div>

                <div>
                  <div className="mb-2 h-3 w-16 animate-pulse rounded bg-white/10" />
                  <div className="h-11 w-28 animate-pulse rounded-xl bg-white/10" />
                </div>

                <div className="ml-auto flex gap-3">
                  <div className="h-11 w-40 animate-pulse rounded-xl bg-white/10" />
                  <div className="h-11 w-40 animate-pulse rounded-xl bg-white/10" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* ATTACHMENT */}
            <div className="rounded-2xl bg-white/5 p-6 shadow-lg/15">
              <div className="h-5 w-20 animate-pulse rounded bg-white/10" />

              <div className="mt-5 h-48 w-full animate-pulse rounded-xl bg-white/10" />
            </div>

            {/* MESSAGES */}
            <div className="rounded-2xl bg-white/5 p-6 shadow-lg/15">
              <div className="h-5 w-28 animate-pulse rounded bg-white/10" />

              {/* Messages */}
              <div className="mt-5 h-16 w-full animate-pulse rounded-lg bg-black/20" />

              {/* Input */}
              <div className="mt-4 flex gap-2">
                <div className="h-20 flex-1 animate-pulse rounded-xl bg-white/10" />

                <div className="h-20 w-20 animate-pulse rounded-xl bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
