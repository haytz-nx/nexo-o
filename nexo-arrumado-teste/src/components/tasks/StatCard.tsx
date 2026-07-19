"use client";

import type { ReactNode } from "react";

export default function StatCard({
  label,
  value,
  icon,
  sublabel,
  accent = "var(--purple-neon-2)",
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  sublabel?: string;
  accent?: string;
}) {
  return (
    <div className="glass card-shadow flex flex-col gap-2 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">{label}</span>
        {icon && (
          <span className="flex h-7 w-7 items-center justify-center rounded-full" style={{ color: accent, background: `${accent}1f` }}>
            {icon}
          </span>
        )}
      </div>
      <p className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--text-primary)]">{value}</p>
      {sublabel && <p className="text-xs text-[var(--text-muted)]">{sublabel}</p>}
    </div>
  );
}
