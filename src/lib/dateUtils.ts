import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInCalendarDays,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Recurrence } from "./types";

export const DATE_KEY = "yyyy-MM-dd";

export function todayKey(): string {
  return format(new Date(), DATE_KEY);
}

export function toKey(date: Date): string {
  return format(date, DATE_KEY);
}

export function fromKey(key: string): Date {
  return parseISO(key);
}

export function formatFriendly(dateKey: string): string {
  const date = fromKey(dateKey);
  return format(date, "EEEE, d 'de' MMMM", { locale: ptBR });
}

export function formatShort(dateKey: string): string {
  const date = fromKey(dateKey);
  return format(date, "dd/MM/yyyy");
}

export function formatMonthLabel(dateKey: string): string {
  const date = fromKey(dateKey);
  return format(date, "MMMM 'de' yyyy", { locale: ptBR });
}

/** Returns the start date of the period that `date` belongs to for a given recurrence. */
export function getPeriodStart(
  recurrence: Recurrence,
  date: Date,
  createdAt: Date,
  intervalDays = 1
): Date {
  switch (recurrence) {
    case "daily":
      return startOfDay(date);
    case "weekly":
      return startOfWeek(date, { weekStartsOn: 1 });
    case "monthly":
      return startOfMonth(date);
    case "yearly":
      return startOfYear(date);
    case "custom": {
      const base = startOfDay(createdAt);
      const days = Math.max(0, differenceInCalendarDays(startOfDay(date), base));
      const step = Math.max(1, intervalDays);
      const bucket = Math.floor(days / step);
      return addDays(base, bucket * step);
    }
    case "once":
    default:
      return startOfDay(createdAt);
  }
}

/** Returns the end (last day) of the period starting at `start`. */
export function getPeriodEnd(recurrence: Recurrence, start: Date, intervalDays = 1): Date {
  switch (recurrence) {
    case "daily":
      return start;
    case "weekly":
      return endOfWeek(start, { weekStartsOn: 1 });
    case "monthly":
      return endOfMonth(start);
    case "yearly":
      return endOfYear(start);
    case "custom":
      return addDays(start, Math.max(1, intervalDays) - 1);
    case "once":
    default:
      return start;
  }
}

/** Returns the start of the next period following `start`. */
export function getNextPeriodStart(recurrence: Recurrence, start: Date, intervalDays = 1): Date {
  switch (recurrence) {
    case "daily":
      return addDays(start, 1);
    case "weekly":
      return addWeeks(start, 1);
    case "monthly":
      return addMonths(start, 1);
    case "yearly":
      return addYears(start, 1);
    case "custom":
      return addDays(start, Math.max(1, intervalDays));
    case "once":
    default:
      return start;
  }
}

export function recurrenceLabel(recurrence: Recurrence, intervalDays?: number): string {
  switch (recurrence) {
    case "once":
      return "Uma vez";
    case "daily":
      return "Diária";
    case "weekly":
      return "Semanal";
    case "monthly":
      return "Mensal";
    case "yearly":
      return "Anual";
    case "custom":
      return `A cada ${intervalDays ?? 1} dias`;
    default:
      return "";
  }
}

export function isBeforeDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}
