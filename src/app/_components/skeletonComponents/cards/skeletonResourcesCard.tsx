export default function SkeletonResourcesCard() {
  return (
    <div className="rounded-2xl bg-white/5 p-6 shadow-lg/15">
      {/* TITLE + CATEGORY */}
      <div className="mb-2 flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="h-5 w-40 animate-pulse rounded bg-white/10" />
          <div className="h-5 w-28 animate-pulse rounded bg-white/10" />
        </div>

        <div className="h-6 w-24 shrink-0 animate-pulse rounded-full bg-white/10" />
      </div>

      {/* DATE + AUTHOR */}
      <div className="mt-3 h-4 w-32 animate-pulse rounded bg-white/10" />

      {/* DESCRIPTION */}
      <div className="mt-4 space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-white/10" />
        <div className="h-4 w-11/12 animate-pulse rounded bg-white/10" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
      </div>

      {/* LINK */}
      <div className="mt-4 h-4 w-16 animate-pulse rounded bg-white/10" />
    </div>
  );
}
