export default function SkeletonCampaignCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/5 p-6 shadow-lg/15 backdrop-blur-lg">
      {/* SHIMMER */}
      <div className="pointer-events-none absolute inset-0 animate-[shimmer_3.5s_ease-in-out_infinite] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.08),transparent)] bg-size-[200%_100%]" />

      {/* Optional: fake height to match expanded cards */}
      <div className="h-20" />
    </div>
  );
}
