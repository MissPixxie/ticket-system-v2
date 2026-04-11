export default function SkeletonResourcesCard() {
  return (
    <div className="card relative overflow-hidden bg-white/5 shadow-lg/15 backdrop-blur-lg">
      {/* shimmer */}
      <div className="pointer-events-none absolute inset-0 animate-[shimmer_3.5s_ease-in-out_infinite] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.08),transparent)] bg-size-[200%_100%]" />

      <div className="space-y-4">
        {/* TITLE */}
        <div className="h-5 w-1/3 rounded bg-white/10" />

        {/* CONTENT */}
        <div className="space-y-2">
          <div className="h-5 w-full rounded bg-white/10" />
        </div>
      </div>
    </div>
  );
}
