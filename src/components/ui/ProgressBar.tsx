"use client";

export default function ProgressBar({
  value,
  max,
  color = "var(--purple-neon-2)",
  height = 8,
  showOverflow = true,
}: {
  value: number;
  max: number;
  color?: string;
  height?: number;
  showOverflow?: boolean;
}) {
  const safeMax = max <= 0 ? 1 : max;
  const pct = Math.min(100, (value / safeMax) * 100);
  const overflow = showOverflow && value > safeMax;
  return (
    <div
      className="w-full overflow-hidden rounded-full bg-white/[0.06]"
      style={{ height }}
    >
      <div
        className="h-full rounded-full transition-[width] duration-500 ease-out"
        style={{
          width: `${pct}%`,
          background: overflow
            ? "linear-gradient(90deg, var(--red), #f87171)"
            : `linear-gradient(90deg, ${color}, var(--purple-neon))`,
        }}
      />
    </div>
  );
}
