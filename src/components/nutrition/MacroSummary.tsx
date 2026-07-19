"use client";

import ProgressBar from "@/components/ui/ProgressBar";
import type { NutritionGoals } from "@/lib/types";

interface Totals {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
}

const ROWS: { key: keyof Totals; label: string; color: string; unit: string }[] = [
  { key: "calories", label: "Calorias", color: "var(--purple-neon-2)", unit: "kcal" },
  { key: "carbs", label: "Carboidratos", color: "#fbbf24", unit: "g" },
  { key: "protein", label: "Proteínas", color: "#34d399", unit: "g" },
  { key: "fat", label: "Gorduras", color: "#fb7185", unit: "g" },
  { key: "fiber", label: "Fibras", color: "#38bdf8", unit: "g" },
];

export default function MacroSummary({ totals, goals }: { totals: Totals; goals: NutritionGoals }) {
  return (
    <div className="glass card-shadow rounded-2xl p-4 sm:p-5">
      <h2 className="mb-4 text-sm font-semibold text-[var(--text-secondary)]">Totais de hoje</h2>
      <div className="space-y-4">
        {ROWS.map((row) => {
          const goalValue = goals[row.key];
          const value = totals[row.key];
          return (
            <div key={row.key}>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-[var(--text-secondary)]">{row.label}</span>
                <span className="text-[var(--text-muted)]">
                  {Math.round(value)} / {goalValue} {row.unit}
                </span>
              </div>
              <ProgressBar value={value} max={goalValue} color={row.color} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
