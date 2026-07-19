"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { makeId } from "../id";
import {
  getNextPeriodStart,
  getPeriodEnd,
  getPeriodStart,
  toKey,
} from "../dateUtils";
import type { DailyLog, Recurrence, Task, TaskStatus } from "../types";

interface TaskState {
  tasks: Task[];
  dailyLog: DailyLog;
  hydrated: boolean;
  addTask: (input: {
    title: string;
    description?: string;
    recurrence: Recurrence;
    customIntervalDays?: number;
  }) => void;
  updateTask: (
    id: string,
    patch: Partial<Pick<Task, "title" | "description" | "recurrence" | "customIntervalDays">>
  ) => void;
  deleteTask: (id: string) => void;
  setStatus: (id: string, status: "completed" | "missed") => void;
  resetToPending: (id: string) => void;
  rollover: () => void;
  setHydrated: (v: boolean) => void;
}

function upsertLog(log: DailyLog, dateKey: string, entry: DailyLog[string][number]): DailyLog {
  const existing = log[dateKey] ?? [];
  const withoutTask = existing.filter((e) => e.taskId !== entry.taskId);
  return { ...log, [dateKey]: [...withoutTask, entry] };
}

function computeInitialPeriodStart(task: Pick<Task, "recurrence" | "createdAt" | "customIntervalDays">): string {
  const created = new Date(task.createdAt);
  const start = getPeriodStart(task.recurrence, created, created, task.customIntervalDays ?? 1);
  return toKey(start);
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      dailyLog: {},
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),

      addTask: ({ title, description, recurrence, customIntervalDays }) => {
        const createdAt = new Date().toISOString();
        const task: Task = {
          id: makeId(),
          title: title.trim(),
          description: description?.trim() || undefined,
          recurrence,
          customIntervalDays: recurrence === "custom" ? Math.max(1, customIntervalDays ?? 2) : undefined,
          createdAt,
          status: "pending",
          periodStart: computeInitialPeriodStart({
            recurrence,
            createdAt,
            customIntervalDays,
          }),
          updatedAt: createdAt,
        };
        set({ tasks: [task, ...get().tasks] });
      },

      updateTask: (id, patch) => {
        set({
          tasks: get().tasks.map((t) => {
            if (t.id !== id) return t;
            const next: Task = { ...t, ...patch };
            if (patch.recurrence && patch.recurrence !== t.recurrence) {
              next.periodStart = computeInitialPeriodStart({
                recurrence: patch.recurrence,
                createdAt: t.createdAt,
                customIntervalDays: patch.customIntervalDays ?? t.customIntervalDays,
              });
              next.status = "pending";
            }
            return next;
          }),
        });
      },

      deleteTask: (id) => {
        set({ tasks: get().tasks.filter((t) => t.id !== id) });
      },

      setStatus: (id, status) => {
        const now = new Date();
        const todayDateKey = toKey(now);
        set((state) => {
          const task = state.tasks.find((t) => t.id === id);
          if (!task) return state;
          const currentPeriodStart = toKey(
            getPeriodStart(task.recurrence, now, new Date(task.createdAt), task.customIntervalDays ?? 1)
          );
          const updatedTask: Task = {
            ...task,
            status,
            updatedAt: now.toISOString(),
            periodStart: currentPeriodStart,
          };
          const log = upsertLog(state.dailyLog, todayDateKey, {
            id: makeId(),
            taskId: task.id,
            title: task.title,
            recurrence: task.recurrence,
            status,
            date: todayDateKey,
            recordedAt: now.toISOString(),
          });
          return {
            tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
            dailyLog: log,
          };
        });
      },

      resetToPending: (id) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, status: "pending" as TaskStatus, updatedAt: new Date().toISOString() } : t
          ),
        }));
      },

      rollover: () => {
        const now = new Date();
        set((state) => {
          let logDraft = state.dailyLog;
          const nextTasks = state.tasks.map((task) => {
            if (task.recurrence === "once") return task;
            let start = new Date(task.periodStart);
            const created = new Date(task.createdAt);
            const interval = task.customIntervalDays ?? 1;
            let status = task.status;
            let iterations = 0;
            while (iterations < 3650) {
              const currentStart = getPeriodStart(task.recurrence, now, created, interval);
              if (toKey(currentStart) === toKey(start)) break;
              const end = getPeriodEnd(task.recurrence, start, interval);
              if (status === "pending") {
                const endKey = toKey(end);
                logDraft = upsertLog(logDraft, endKey, {
                  id: makeId(),
                  taskId: task.id,
                  title: task.title,
                  recurrence: task.recurrence,
                  status: "missed",
                  date: endKey,
                  recordedAt: now.toISOString(),
                });
              }
              start = getNextPeriodStart(task.recurrence, start, interval);
              status = "pending";
              iterations += 1;
            }
            if (toKey(start) === task.periodStart && status === task.status) {
              return task;
            }
            return { ...task, periodStart: toKey(start), status };
          });
          return { tasks: nextTasks, dailyLog: logDraft };
        });
      },
    }),
    {
      name: "nexo-tasks",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      skipHydration: typeof window === "undefined",
    }
  )
);
