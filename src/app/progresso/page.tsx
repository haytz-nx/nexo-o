"use client";

import { useMemo } from "react";
import { subDays } from "date-fns";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CheckCircle2, Flame, Trophy, XCircle } from "lucide-react";
import ClientOnly from "@/components/ui/ClientOnly";
import { useTaskStore } from "@/lib/store/useTaskStore";
import StatCard from "@/components/tasks/StatCard";
import ProgressBar from "@/components/ui/ProgressBar";
import {
  currentStreak,
  habitCounts,
  longestStreak,
  monthlyCompletionRate,
  outcomeForDate,
  todayCompletionRate,
  totalCounts,
  weeklyCompletionRate,
} from "@/lib/taskStats";
import { toKey } from "@/lib/dateUtils";

function Skeleton() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse space-y-6">
      <div className="h-8 w-56 rounded-lg bg-white/5" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-white/5" />
        ))}
      </div>
      <div className="h-64 rounded-2xl bg-white/5" />
    </div>
  );
}

function ProgressContent() {
  const dailyLog = useTaskStore((s) => s.dailyLog);

  const dayPct = todayCompletionRate(dailyLog);
  const weekPct = weeklyCompletionRate(dailyLog);
  const monthPct = monthlyCompletionRate(dailyLog);
  const streak = currentStreak(dailyLog);
  const best = longestStreak(dailyLog);
  const { completed, missed } = totalCounts(dailyLog);
  const mostCompleted = habitCounts(dailyLog, "completed").slice(0, 5);
  const mostMissed = habitCounts(dailyLog, "missed").slice(0, 5);

  const chartData = useMemo(() => {
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const key = toKey(date);
      const outcome = outcomeForDate(dailyLog, key);
      days.push({
        label: date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
        pct: outcome.total > 0 ? outcome.pct : 0,
      });
    }
    return days;
  }, [dailyLog]);

  const totalTracked = completed + missed;

  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-6">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
          Progresso
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">Acompanhe sua evolução e construa consistência.</p>
      </header>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Hoje" value={`${dayPct}%`} sublabel="Conclusão diária" />
        <StatCard label="Semana" value={`${weekPct}%`} sublabel="Conclusão semanal" />
        <StatCard label="Mês" value={`${monthPct}%`} sublabel="Conclusão mensal" />
        <StatCard
          label="Sequência atual"
          value={streak}
          icon={<Flame size={15} />}
          accent="var(--red)"
          sublabel="dias consecutivos"
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Melhor sequência" value={best} icon={<Trophy size={15} />} accent="#fbbf24" sublabel="recorde pessoal" />
        <StatCard
          label="Tarefas concluídas"
          value={completed}
          icon={<CheckCircle2 size={15} />}
          accent="var(--green)"
          sublabel="no total"
        />
        <StatCard
          label="Tarefas não concluídas"
          value={missed}
          icon={<XCircle size={15} />}
          accent="var(--red)"
          sublabel="no total"
        />
      </div>

      <div className="glass card-shadow mb-6 rounded-2xl p-4 sm:p-5">
        <h2 className="mb-4 text-sm font-semibold text-[var(--text-secondary)]">Conclusão nos últimos 14 dias</h2>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap={6}>
              <XAxis dataKey="label" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
                contentStyle={{
                  background: "#150e21",
                  border: "1px solid rgba(168,121,255,0.25)",
                  borderRadius: 12,
                  fontSize: 12,
                  color: "#f5f1fb",
                }}
                formatter={(value) => [`${value}%`, "Conclusão"]}
              />
              <Bar dataKey="pct" radius={[6, 6, 6, 6]} fill="url(#barGradient)" />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#6d28d9" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="glass card-shadow rounded-2xl p-4 sm:p-5">
          <h2 className="mb-3 text-sm font-semibold text-[var(--text-secondary)]">Hábitos mais concluídos</h2>
          {mostCompleted.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">Ainda sem dados suficientes.</p>
          ) : (
            <div className="space-y-3">
              {mostCompleted.map((h) => (
                <div key={h.title}>
                  <div className="mb-1 flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <span className="truncate">{h.title}</span>
                    <span className="text-[var(--text-muted)]">{h.count}x</span>
                  </div>
                  <ProgressBar value={h.count} max={totalTracked || 1} color="var(--green)" height={6} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass card-shadow rounded-2xl p-4 sm:p-5">
          <h2 className="mb-3 text-sm font-semibold text-[var(--text-secondary)]">Hábitos mais perdidos</h2>
          {mostMissed.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">Ainda sem dados suficientes.</p>
          ) : (
            <div className="space-y-3">
              {mostMissed.map((h) => (
                <div key={h.title}>
                  <div className="mb-1 flex items-center justify-between text-xs text-[var(--text-secondary)]">
                    <span className="truncate">{h.title}</span>
                    <span className="text-[var(--text-muted)]">{h.count}x</span>
                  </div>
                  <ProgressBar value={h.count} max={totalTracked || 1} color="var(--red)" height={6} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProgressoPage() {
  return (
    <ClientOnly fallback={<Skeleton />}>
      <ProgressContent />
    </ClientOnly>
  );
}
