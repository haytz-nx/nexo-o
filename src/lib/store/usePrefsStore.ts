"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { NutritionGoals } from "../types";

interface PrefsState {
  goals: NutritionGoals;
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  updateGoals: (patch: Partial<NutritionGoals>) => void;
}

export const DEFAULT_GOALS: NutritionGoals = {
  calories: 2200,
  carbs: 250,
  protein: 130,
  fat: 70,
  fiber: 30,
  water: 2500,
};

export const usePrefsStore = create<PrefsState>()(
  persist(
    (set, get) => ({
      goals: DEFAULT_GOALS,
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      updateGoals: (patch) => set({ goals: { ...get().goals, ...patch } }),
    }),
    {
      name: "nexo-prefs",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      skipHydration: typeof window === "undefined",
    }
  )
);
