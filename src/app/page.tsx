"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Droplets, Flame, ListChecks, Plus, Trophy } from "lucide-react";
import ClientOnly from "@/components/ui/ClientOnly";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import StatCard from "@/components/tasks/StatCard";
import TaskCard from "@/components/tasks/TaskCard";
import TaskForm from "@/components/tasks/TaskForm";
import { useTaskStore } from "@/lib/store/useTaskStore";
import { useNutritionStore } from "@/lib/store/useNutritionStore";
import { usePrefsStore } from "@/lib/store/usePrefsStore";
import { useToast } from "@/components/ui/Toast";
import { currentStreak, longestStreak, todayCompletionRate } from "@/lib/taskStats";
import { toKey } from "@/lib/dateUtils";
import type { Task } from "@/lib/types";

const MILESTONES = [3, 7, 14, 21, 30, 50, 100, 200, 365];

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse space-y-6">
      <div className="h-8 w-64 rounded-lg bg-white/5" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-white/5" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 rounded-2xl bg-white/5" />
        ))}
      </div>
    </div>
  );
}

function DashboardContent() {
  const tasks = useTaskStore((s) => s.tasks);
  const dailyLog = useTaskStore((s) => s.dailyLog);
  const addTask = useTaskStore((s) => s.addTask);
  const updateTask = useTaskStore((s) => s.updateTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const setStatus = useTaskStore((s) => s.setStatus);

  const waterByDate = useNutritionStore((s) => s.waterByDate);
  const addWater = useNutritionStore((s) => s.addWater);
  const goals = usePrefsStore((s) => s.goals);

  const { push } = useToast();
  const streakRef = useRef<number | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const activeTasks = useMemo(
    () => tasks.filter((t) => !t.archived).sort((a, b) => {
      const order: Record<Task["status"], number> = { pending: 0, missed: 1, completed: 2 };
      return order[a.status] - order[b.status] || a.title.localeCompare(b.title, "pt-BR");
    }),
    [tasks]
  );

  const pct = todayCompletionRate(dailyLog);
  const streak = currentStreak(dailyLog);
  const best = longestStreak(dailyLog);

  const todayKey = toKey(new Date());
  const waterToday = (waterByDate[todayKey] ?? []).reduce((sum, e) => sum + e.ml, 0);

  useEffect(() => {
    if (streakRef.current === null) {
      streakRef.current = streak;
      return;
    }
    if (streak > streakRef.current && MILESTONES.includes(streak)) {
      push({
        emoji: "🔥",
        title: `Sequência de ${streak} dias!`,
        description: "Consistência é o segredo. Continue assim.",
      });
    }
    streakRef.current = streak;
  }, [streak, push]);

  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });

  function handleSubmit(input: {
    title: string;
    description?: string;
    recurrence: Task["recurrence"];
    customIntervalDays?: number;
  }) {
    if (editing) {
      updateTask(editing.id, input);
    } else {
      addTask(input);
    }
    setEditing(null);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-6 flex flex-col gap-1">
        <p className="text-sm capitalize text-[var(--text-muted)]">{today}</p>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
          Bem-vindo de volta 👋
        </h1>
      </header>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Hoje" value={`${pct}%`} icon={<ListChecks size={15} />} sublabel="Conclusão do dia" />
        <StatCard
          label="Sequência"
          value={streak}
          icon={<Flame size={15} />}
          accent="var(--red)"
          sublabel="dias seguidos"
        />
        <StatCard
          label="Recorde"
          value={best}
          icon={<Trophy size={15} />}
          accent="#fbbf24"
          sublabel="melhor sequência"
        />
        <div className="glass card-shadow flex flex-col gap-2 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">Água</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full text-[#38bdf8]" style={{ background: "#38bdf81f" }}>
              <Droplets size={15} />
            </span>
          </div>
          <p className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--text-primary)]">
            {(waterToday / 1000).toFixed(2)}L
          </p>
          <button
            onClick={() => addWater(250)}
            className="tap-scale neon-ring mt-0.5 rounded-lg bg-[#38bdf81f] px-2 py-1 text-[11px] font-semibold text-[#38bdf8] hover:bg-[#38bdf833]"
          >
            + 250ml
          </button>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)]">Suas tarefas</h2>
        <Button
          size="sm"
          icon={<Plus size={15} />}
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          Nova tarefa
        </Button>
      </div>

      {activeTasks.length === 0 ? (
        <div className="glass card-shadow flex flex-col items-center gap-3 rounded-3xl px-6 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(168,85,247,0.14)] text-[var(--purple-neon-2)]">
            <ListChecks size={26} />
          </div>
          <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--text-primary)]">
            Nenhuma tarefa ainda
          </p>
          <p className="max-w-xs text-sm text-[var(--text-muted)]">
            Crie sua primeira tarefa e comece a construir hábitos consistentes hoje mesmo.
          </p>
          <Button className="mt-2" icon={<Plus size={16} />} onClick={() => setFormOpen(true)}>
            Criar tarefa
          </Button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {activeTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={() => setStatus(task.id, "completed")}
              onMiss={() => setStatus(task.id, "missed")}
              onEdit={() => {
                setEditing(task);
                setFormOpen(true);
              }}
              onDelete={() => deleteTask(task.id)}
            />
          ))}
        </div>
      )}

      {activeTasks.length > 0 && (
        <div className="mt-6 glass rounded-2xl p-4">
          <div className="mb-2 flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Progresso de hoje</span>
            <span>{pct}%</span>
          </div>
          <ProgressBar value={pct} max={100} />
        </div>
      )}

      <TaskForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        initial={editing}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <ClientOnly fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </ClientOnly>
  );
}
