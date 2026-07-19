// Shared domain types for Nexo

export type Recurrence = "once" | "daily" | "weekly" | "monthly" | "yearly" | "custom";

export type TaskStatus = "pending" | "completed" | "missed";

export interface Task {
  id: string;
  title: string;
  description?: string;
  recurrence: Recurrence;
  customIntervalDays?: number; // used when recurrence === "custom"
  createdAt: string; // ISO date string
  status: TaskStatus;
  periodStart: string; // ISO date (yyyy-MM-dd) marking start of the current period
  updatedAt: string; // ISO datetime of last status change
  archived?: boolean;
}

export interface LogEntry {
  id: string;
  taskId: string;
  title: string;
  recurrence: Recurrence;
  status: "completed" | "missed";
  date: string; // ISO date (yyyy-MM-dd) this entry belongs to
  recordedAt: string; // ISO datetime
}

export type DailyLog = Record<string, LogEntry[]>; // dateKey -> entries

export type FoodCategory =
  | "meats"
  | "fruits"
  | "vegetables"
  | "dairy"
  | "drinks"
  | "grains"
  | "nuts"
  | "processed";

export interface ServingOption {
  unit: string;
  label: string;
  grams: number; // grams (or ml) equivalent to 1 unit of this serving
}

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  aliases?: string[];
  per100: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number; // mg
  };
  servings: ServingOption[];
}

export interface FoodLogEntry {
  id: string;
  foodId: string;
  name: string;
  category: FoodCategory;
  unit: string;
  quantity: number;
  grams: number;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  date: string; // yyyy-MM-dd
  createdAt: string;
}

export interface WaterEntry {
  id: string;
  ml: number;
  date: string;
  createdAt: string;
}

export interface NutritionGoals {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
  water: number; // ml
}
