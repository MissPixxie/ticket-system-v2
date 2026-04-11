export default function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded bg-white/10 ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 animate-[shimmer_3.5s_ease-in-out_infinite] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.08),transparent)] bg-size-[200%_100%]" />
    </div>
  );
}
