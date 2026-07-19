"use client";

import { useMemo, useState } from "react";
import { addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight, Search, Settings2, Trash2 } from "lucide-react";
import ClientOnly from "@/components/ui/ClientOnly";
import Button from "@/components/ui/Button";
import CategoryGrid from "@/components/nutrition/CategoryGrid";
import AddFoodModal from "@/components/nutrition/AddFoodModal";
import MacroSummary from "@/components/nutrition/MacroSummary";
import WaterCard from "@/components/nutrition/WaterCard";
import GoalsModal from "@/components/nutrition/GoalsModal";
import { useNutritionStore } from "@/lib/store/useNutritionStore";
import { usePrefsStore } from "@/lib/store/usePrefsStore";
import { FOOD_CATEGORY_META, searchFoods } from "@/lib/foodDatabase";
import { formatFriendly, toKey } from "@/lib/dateUtils";
import type { FoodCategory, FoodItem } from "@/lib/types";

function Skeleton() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse space-y-6">
      <div className="h-8 w-56 rounded-lg bg-white/5" />
      <div className="h-12 w-full rounded-xl bg-white/5" />
      <div className="h-64 rounded-2xl bg-white/5" />
    </div>
  );
}

function NutritionContent() {
  const [cursorDate, setCursorDate] = useState(new Date());
  const dateKey = toKey(cursorDate);

  const entriesByDate = useNutritionStore((s) => s.entriesByDate);
  const addFoodEntry = useNutritionStore((s) => s.addFoodEntry);
  const removeFoodEntry = useNutritionStore((s) => s.removeFoodEntry);
  const waterByDate = useNutritionStore((s) => s.waterByDate);
  const addWater = useNutritionStore((s) => s.addWater);
  const removeWater = useNutritionStore((s) => s.removeWater);

  const goals = usePrefsStore((s) => s.goals);
  const updateGoals = usePrefsStore((s) => s.updateGoals);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<FoodCategory | "all">("all");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [goalsOpen, setGoalsOpen] = useState(false);

  const entries = entriesByDate[dateKey] ?? [];
  const water = waterByDate[dateKey] ?? [];
  const waterTotal = water.reduce((sum, w) => sum + w.ml, 0);

  const results = useMemo(() => searchFoods(query, category), [query, category]);

  const totals = useMemo(
    () =>
      entries.reduce(
        (acc, e) => ({
          calories: acc.calories + e.calories,
          carbs: acc.carbs + e.carbs,
          protein: acc.protein + e.protein,
          fat: acc.fat + e.fat,
          fiber: acc.fiber + e.fiber,
        }),
        { calories: 0, carbs: 0, protein: 0, fat: 0, fiber: 0 }
      ),
    [entries]
  );

  const isToday = dateKey === toKey(new Date());

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
            Nutrição
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Busque alimentos e acompanhe seus macros diários.</p>
        </div>
        <Button variant="secondary" size="sm" icon={<Settings2 size={14} />} onClick={() => setGoalsOpen(true)}>
          Metas
        </Button>
      </header>

      <div className="mb-5 flex items-center justify-center gap-3">
        <button
          onClick={() => setCursorDate((d) => subDays(d, 1))}
          className="tap-scale neon-ring flex h-8 w-8 items-center justify-center rounded-full glass text-[var(--text-secondary)] hover:bg-white/10"
          aria-label="Dia anterior"
        >
          <ChevronLeft size={16} />
        </button>
        <p className="min-w-[190px] text-center text-sm font-medium capitalize text-[var(--text-primary)]">
          {isToday ? "Hoje" : formatFriendly(dateKey)}
        </p>
        <button
          onClick={() => setCursorDate((d) => (isToday ? d : addDays(d, 1)))}
          disabled={isToday}
          className="tap-scale neon-ring flex h-8 w-8 items-center justify-center rounded-full glass text-[var(--text-secondary)] hover:bg-white/10 disabled:opacity-30"
          aria-label="Próximo dia"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <MacroSummary totals={totals} goals={goals} />
        <WaterCard
          totalMl={waterTotal}
          goalMl={goals.water}
          onAdd={(ml) => addWater(ml, dateKey)}
          onRemove={() => {
            const last = water[water.length - 1];
            if (last) removeWater(dateKey, last.id);
          }}
        />
      </div>

      <div className="glass card-shadow mb-5 rounded-2xl p-4 sm:p-5">
        <div className="relative mb-4">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            className="neon-ring w-full rounded-xl border border-[var(--border-subtle)] bg-white/[0.04] py-2.5 pl-10 pr-3.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--purple-neon)]"
            placeholder="Buscar alimento... ex: banana, arroz, frango"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <CategoryGrid active={category} onSelect={setCategory} />
        </div>

        <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
          {results.length === 0 ? (
            <p className="py-6 text-center text-sm text-[var(--text-muted)]">Nenhum alimento encontrado.</p>
          ) : (
            results.map((food) => (
              <button
                key={food.id}
                onClick={() => setSelectedFood(food)}
                className="tap-scale neon-ring flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left hover:bg-white/[0.05]"
              >
                <div className="flex items-center gap-2.5">
                  <span>{FOOD_CATEGORY_META[food.category].emoji}</span>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{food.name}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      {food.per100.calories} kcal / 100{food.servings[0]?.unit === "ml" ? "ml" : "g"}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-[var(--purple-neon-2)]">+ adicionar</span>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="glass card-shadow rounded-2xl p-4 sm:p-5">
        <h2 className="mb-3 text-sm font-semibold text-[var(--text-secondary)]">
          Alimentos registrados {isToday ? "hoje" : "neste dia"}
        </h2>
        {entries.length === 0 ? (
          <p className="py-6 text-center text-sm text-[var(--text-muted)]">Nenhum alimento adicionado ainda.</p>
        ) : (
          <div className="space-y-1.5">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="group flex items-center justify-between rounded-xl bg-white/[0.03] px-3.5 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span>{FOOD_CATEGORY_META[entry.category].emoji}</span>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{entry.name}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      {entry.quantity} {entry.unit} · {Math.round(entry.calories)} kcal · {entry.carbs}g carbo
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFoodEntry(dateKey, entry.id)}
                  className="tap-scale neon-ring rounded-full p-1.5 text-[var(--text-muted)] opacity-60 hover:bg-[var(--red-bg)] hover:text-[var(--red)] hover:opacity-100 md:opacity-0 md:group-hover:opacity-100"
                  aria-label="Remover alimento"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddFoodModal
        food={selectedFood}
        onClose={() => setSelectedFood(null)}
        onConfirm={(unit, quantity) => {
          if (selectedFood) addFoodEntry(selectedFood, unit, quantity, dateKey);
        }}
      />

      <GoalsModal open={goalsOpen} onClose={() => setGoalsOpen(false)} goals={goals} onSave={updateGoals} />
    </div>
  );
}

export default function NutricaoPage() {
  return (
    <ClientOnly fallback={<Skeleton />}>
      <NutritionContent />
    </ClientOnly>
  );
}
