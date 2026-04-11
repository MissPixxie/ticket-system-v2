export default function SkeletonNewsCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/5 p-6 shadow-lg/15 backdrop-blur-lg">
      {/* shimmer */}
      <div className="pointer-events-none absolute inset-0 animate-[shimmer_3.5s_ease-in-out_infinite] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.08),transparent)] bg-size-[200%_100%]" />

      <div className="space-y-4">
        {/* TITLE */}
        <div className="h-5 w-1/3 rounded bg-white/10" />

        {/* CONTENT */}
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-white/10" />
          <div className="h-3 w-5/6 rounded bg-white/10" />
        </div>

        {/* META */}
        <div className="h-3 w-1/4 rounded bg-white/10" />

        {/* VOTE SECTION */}
        <div className="flex items-center gap-3 pt-2">
          <div className="h-8 w-24 rounded-lg bg-white/10" />
          <div className="h-8 w-24 rounded-lg bg-white/10" />
        </div>
      </div>
    </div>
  );
}
