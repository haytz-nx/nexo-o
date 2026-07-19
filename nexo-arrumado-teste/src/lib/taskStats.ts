import { addDays, differenceInCalendarDays, startOfMonth, startOfWeek } from "date-fns";
import { fromKey, toKey } from "./dateUtils";
import type { DailyLog, LogEntry } from "./types";

export interface DayOutcome {
  date: string;
  completed: number;
  missed: number;
  total: number;
  pct: number;
  success: boolean;
}

export function allEntries(log: DailyLog): LogEntry[] {
  return Object.values(log).flat();
}

export function outcomeForDate(log: DailyLog, dateKey: string): DayOutcome {
  const entries = log[dateKey] ?? [];
  const completed = entries.filter((e) => e.status === "completed").length;
  const missed = entries.filter((e) => e.status === "missed").length;
  const total = entries.length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { date: dateKey, completed, missed, total, pct, success: total > 0 && missed === 0 };
}

export function completionRateBetween(log: DailyLog, from: Date, to: Date): number {
  let completed = 0;
  let missed = 0;
  let cursor = new Date(from);
  while (cursor.getTime() <= to.getTime()) {
    const o = outcomeForDate(log, toKey(cursor));
    completed += o.completed;
    missed += o.missed;
    cursor = addDays(cursor, 1);
  }
  const total = completed + missed;
  return total === 0 ? 0 : Math.round((completed / total) * 100);
}

export function todayCompletionRate(log: DailyLog): number {
  const now = new Date();
  return outcomeForDate(log, toKey(now)).pct;
}

export function weeklyCompletionRate(log: DailyLog): number {
  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 1 });
  return completionRateBetween(log, start, now);
}

export function monthlyCompletionRate(log: DailyLog): number {
  const now = new Date();
  const start = startOfMonth(now);
  return completionRateBetween(log, start, now);
}

export function currentStreak(log: DailyLog): number {
  const now = new Date();
  let cursor = new Date(now);
  let streak = 0;
  // If today has no entries yet, start counting from yesterday.
  const today = outcomeForDate(log, toKey(cursor));
  if (today.total === 0) {
    cursor = addDays(cursor, -1);
  }
  while (true) {
    const o = outcomeForDate(log, toKey(cursor));
    if (o.total === 0) break;
    if (!o.success) break;
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function longestStreak(log: DailyLog): number {
  const keys = Object.keys(log).sort();
  if (keys.length === 0) return 0;
  let longest = 0;
  let running = 0;
  let prevDate: Date | null = null;
  for (const key of keys) {
    const o = outcomeForDate(log, key);
    if (o.total === 0) continue;
    const date = fromKey(key);
    if (prevDate && differenceInCalendarDays(date, prevDate) === 1 && o.success) {
      running += 1;
    } else if (o.success) {
      running = 1;
    } else {
      running = 0;
    }
    longest = Math.max(longest, running);
    prevDate = date;
  }
  return longest;
}

export interface HabitCount {
  title: string;
  count: number;
}

export function habitCounts(log: DailyLog, status: "completed" | "missed"): HabitCount[] {
  const map = new Map<string, number>();
  for (const entry of allEntries(log)) {
    if (entry.status !== status) continue;
    map.set(entry.title, (map.get(entry.title) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count);
}

export function totalCounts(log: DailyLog): { completed: number; missed: number } {
  let completed = 0;
  let missed = 0;
  for (const entry of allEntries(log)) {
    if (entry.status === "completed") completed += 1;
    else missed += 1;
  }
  return { completed, missed };
}
