"use client";

import { FOOD_CATEGORY_META } from "@/lib/foodDatabase";
import type { FoodCategory } from "@/lib/types";

export default function CategoryGrid({
  active,
  onSelect,
}: {
  active: FoodCategory | "all";
  onSelect: (c: FoodCategory | "all") => void;
}) {
  const entries = Object.entries(FOOD_CATEGORY_META) as [FoodCategory, { label: string; emoji: string }][];
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect("all")}
        className={`tap-scale neon-ring flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
          active === "all"
            ? "bg-gradient-to-br from-[var(--purple-neon)] to-[var(--purple-deep)] text-white"
            : "glass text-[var(--text-secondary)] hover:bg-white/10"
        }`}
      >
        ✨ Tudo
      </button>
      {entries.map(([key, meta]) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          className={`tap-scale neon-ring flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
            active === key
              ? "bg-gradient-to-br from-[var(--purple-neon)] to-[var(--purple-deep)] text-white"
              : "glass text-[var(--text-secondary)] hover:bg-white/10"
          }`}
        >
          {meta.emoji} {meta.label}
        </button>
      ))}
    </div>
  );
}
