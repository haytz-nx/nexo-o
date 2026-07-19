"use client";

import { Droplets, Minus, Plus } from "lucide-react";
import ProgressBar from "@/components/ui/ProgressBar";

export default function WaterCard({
  totalMl,
  goalMl,
  onAdd,
  onRemove,
}: {
  totalMl: number;
  goalMl: number;
  onAdd: (ml: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="glass card-shadow rounded-2xl p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)]">
          <Droplets size={16} className="text-[#38bdf8]" /> Água
        </h2>
        <span className="text-xs text-[var(--text-muted)]">
          {(totalMl / 1000).toFixed(2)}L / {(goalMl / 1000).toFixed(1)}L
        </span>
      </div>
      <ProgressBar value={totalMl} max={goalMl} color="#38bdf8" height={10} />
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {[100, 250, 500].map((ml) => (
          <button
            key={ml}
            onClick={() => onAdd(ml)}
            className="tap-scale neon-ring flex items-center gap-1 rounded-full bg-[#38bdf81f] px-3 py-1.5 text-xs font-semibold text-[#38bdf8] hover:bg-[#38bdf833]"
          >
            <Plus size={12} /> {ml}ml
          </button>
        ))}
        <button
          onClick={onRemove}
          className="tap-scale neon-ring ml-auto flex items-center gap-1 rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] hover:bg-white/10"
        >
          <Minus size={12} /> desfazer
        </button>
      </div>
    </div>
  );
}
