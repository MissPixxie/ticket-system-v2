"use client";

import SkeletonResourcesCard from "../cards/skeletonResourcesCard";

export default function SkeletonResourcesPage() {
  return (
    <main className="main-page-layout">
      <div className="container">
        {/* HEADER */}
        <div className="mb-8 flex items-center gap-4">
          {/* Icon */}
          <div className="h-9 w-9 animate-pulse rounded-lg bg-white/10" />

          {/* Title */}
          <div className="h-8 w-72 animate-pulse rounded-lg bg-white/10" />
        </div>

        {/* CREATE RESOURCE */}
        <div className="mb-10 rounded-2xl bg-white/5 p-6 shadow-lg/15">
          {/* Heading */}
          <div className="mb-5 h-5 w-36 animate-pulse rounded bg-white/10" />

          {/* Title */}
          <div className="h-11 w-full animate-pulse rounded-lg bg-white/10" />

          {/* Description */}
          <div className="mt-4 h-24 w-full animate-pulse rounded-lg bg-white/10" />

          {/* Category */}
          <div className="mt-4 h-12 w-full animate-pulse rounded-lg bg-white/10" />

          {/* URL */}
          <div className="mt-4 h-11 w-full animate-pulse rounded-lg bg-white/10" />

          {/* Tags */}
          <div className="mt-4 flex items-center justify-between">
            <div className="h-4 w-14 animate-pulse rounded bg-white/10" />

            <div className="h-10 w-36 animate-pulse rounded-lg bg-white/10" />
          </div>

          {/* Submit */}
          <div className="mt-4 h-10 w-full animate-pulse rounded-lg bg-white/10" />
        </div>

        {/* RESOURCES */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonResourcesCard key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
