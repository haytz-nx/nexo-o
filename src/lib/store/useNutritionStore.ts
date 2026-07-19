"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { makeId } from "../id";
import { toKey } from "../dateUtils";
import type { FoodItem, FoodLogEntry, WaterEntry } from "../types";

interface NutritionState {
  entriesByDate: Record<string, FoodLogEntry[]>;
  waterByDate: Record<string, WaterEntry[]>;
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  addFoodEntry: (food: FoodItem, unit: string, quantity: number, date?: string) => void;
  removeFoodEntry: (date: string, entryId: string) => void;
  addWater: (ml: number, date?: string) => void;
  removeWater: (date: string, entryId: string) => void;
}

export function computeMacros(food: FoodItem, unit: string, quantity: number) {
  const serving = food.servings.find((s) => s.unit === unit) ?? food.servings[0];
  const grams = serving.grams * quantity;
  const factor = grams / 100;
  return {
    grams,
    calories: Math.round(food.per100.calories * factor * 10) / 10,
    carbs: Math.round(food.per100.carbs * factor * 10) / 10,
    protein: Math.round(food.per100.protein * factor * 10) / 10,
    fat: Math.round(food.per100.fat * factor * 10) / 10,
    fiber: Math.round(food.per100.fiber * factor * 10) / 10,
    sugar: Math.round(food.per100.sugar * factor * 10) / 10,
    sodium: Math.round(food.per100.sodium * factor * 10) / 10,
  };
}

export const useNutritionStore = create<NutritionState>()(
  persist(
    (set, get) => ({
      entriesByDate: {},
      waterByDate: {},
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),

      addFoodEntry: (food, unit, quantity, date) => {
        const dateKey = date ?? toKey(new Date());
        const macros = computeMacros(food, unit, quantity);
        const entry: FoodLogEntry = {
          id: makeId(),
          foodId: food.id,
          name: food.name,
          category: food.category,
          unit,
          quantity,
          grams: macros.grams,
          calories: macros.calories,
          carbs: macros.carbs,
          protein: macros.protein,
          fat: macros.fat,
          fiber: macros.fiber,
          sugar: macros.sugar,
          sodium: macros.sodium,
          date: dateKey,
          createdAt: new Date().toISOString(),
        };
        const list = get().entriesByDate[dateKey] ?? [];
        set({ entriesByDate: { ...get().entriesByDate, [dateKey]: [entry, ...list] } });
      },

      removeFoodEntry: (date, entryId) => {
        const list = get().entriesByDate[date] ?? [];
        set({
          entriesByDate: {
            ...get().entriesByDate,
            [date]: list.filter((e) => e.id !== entryId),
          },
        });
      },

      addWater: (ml, date) => {
        const dateKey = date ?? toKey(new Date());
        const entry: WaterEntry = { id: makeId(), ml, date: dateKey, createdAt: new Date().toISOString() };
        const list = get().waterByDate[dateKey] ?? [];
        set({ waterByDate: { ...get().waterByDate, [dateKey]: [...list, entry] } });
      },

      removeWater: (date, entryId) => {
        const list = get().waterByDate[date] ?? [];
        set({
          waterByDate: {
            ...get().waterByDate,
            [date]: list.filter((e) => e.id !== entryId),
          },
        });
      },
    }),
    {
      name: "nexo-nutrition",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      skipHydration: typeof window === "undefined",
    }
  )
);
