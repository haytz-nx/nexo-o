"use client";

import { useMemo, useState } from "react";
import { addDays, format, isSameMonth, startOfMonth, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Check, X } from "lucide-react";
import ClientOnly from "@/components/ui/ClientOnly";
import { useTaskStore } from "@/lib/store/useTaskStore";
import { formatFriendly, toKey } from "@/lib/dateUtils";
import { outcomeForDate } from "@/lib/taskStats";

type RangeKey = "today" | "yesterday" | "7days" | "month" | "older";

const RANGE_OPTIONS: { value: RangeKey; label: string }[] = [
  { value: "today", label: "Hoje" },
  { value: "yesterday", label: "Ontem" },
  { value: "7days", label: "Últimos 7 dias" },
  { value: "month", label: "Este mês" },
  { value: "older", label: "Meses anteriores" },
];

function Skeleton() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse space-y-4">
      <div className="h-8 w-48 rounded-lg bg-white/5" />
      <div className="h-10 w-full rounded-xl bg-white/5" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-28 rounded-2xl bg-white/5" />
      ))}
    </div>
  );
}

function DayCard({ dateKey }: { dateKey: string }) {
  const dailyLog = useTaskStore((s) => s.dailyLog);
  const entries = dailyLog[dateKey] ?? [];
  const outcome = outcomeForDate(dailyLog, dateKey);
  const label = formatFriendly(dateKey);

  return (
    <div className="glass card-shadow animate-fade-in-up rounded-2xl p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold capitalize text-[var(--text-primary)]">{label}</h3>
        <span className="text-xs text-[var(--text-muted)]">
          {outcome.completed} concluída{outcome.completed === 1 ? "" : "s"} · {outcome.missed} não concluída
          {outcome.missed === 1 ? "" : "s"}
        </span>
      </div>
      <div className="space-y-1.5">
        {entries.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">Sem registros neste dia.</p>
        ) : (
          entries.map((e) => (
            <div key={e.id} className="flex items-center gap-2.5 rounded-xl bg-white/[0.03] px-3 py-2">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                  e.status === "completed" ? "bg-[var(--green-bg)] text-[var(--green)]" : "bg-[var(--red-bg)] text-[var(--red)]"
                }`}
              >
                {e.status === "completed" ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
              </span>
              <span className="text-sm text-[var(--text-secondary)]">{e.title}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function HistoryContent() {
  const dailyLog = useTaskStore((s) => s.dailyLog);
  const [range, setRange] = useState<RangeKey>("today");
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const allKeys = useMemo(() => Object.keys(dailyLog).sort((a, b) => (a < b ? 1 : -1)), [dailyLog]);

  const now = new Date();
  const todayKey = toKey(now);
  const yesterdayKey = toKey(subDays(now, 1));

  const pastMonths = useMemo(() => {
    const set = new Set<string>();
    for (const key of allKeys) {
      const monthKey = key.slice(0, 7);
      if (!isSameMonth(new Date(key), now)) set.add(monthKey);
    }
    return Array.from(set).sort((a, b) => (a < b ? 1 : -1));
  }, [allKeys, now]);

  const visibleKeys = useMemo(() => {
    switch (range) {
      case "today":
        return allKeys.includes(todayKey) ? [todayKey] : [];
      case "yesterday":
        return allKeys.includes(yesterdayKey) ? [yesterdayKey] : [];
      case "7days": {
        const set = new Set<string>();
        for (let i = 0; i < 7; i++) set.add(toKey(subDays(now, i)));
        return allKeys.filter((k) => set.has(k));
      }
      case "month":
        return allKeys.filter((k) => isSameMonth(new Date(k), now));
      case "older": {
        const month = selectedMonth ?? pastMonths[0];
        if (!month) return [];
        return allKeys.filter((k) => k.startsWith(month));
      }
      default:
        return [];
    }
  }, [range, allKeys, todayKey, yesterdayKey, now, selectedMonth, pastMonths]);

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-6">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
          Histórico
        </h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Todo o seu progresso, guardado para sempre. Nada é apagado automaticamente.
        </p>
      </header>

      <div className="mb-5 flex flex-wrap gap-2">
        {RANGE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setRange(opt.value)}
            className={`tap-scale neon-ring rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              range === opt.value
                ? "bg-gradient-to-br from-[var(--purple-neon)] to-[var(--purple-deep)] text-white"
                : "glass text-[var(--text-secondary)] hover:bg-white/10"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {range === "older" && (
        <div className="mb-5">
          {pastMonths.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">Ainda não há meses anteriores registrados.</p>
          ) : (
            <select
              value={selectedMonth ?? pastMonths[0]}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="neon-ring rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-3.5 py-2.5 text-sm text-[var(--text-primary)]"
            >
              {pastMonths.map((m) => (
                <option key={m} value={m} className="bg-[var(--bg-card)]">
                  {format(startOfMonth(new Date(`${m}-01T00:00:00`)), "MMMM 'de' yyyy", { locale: ptBR })}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {visibleKeys.length === 0 ? (
        <div className="glass card-shadow rounded-3xl px-6 py-16 text-center">
          <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--text-primary)]">
            Nada por aqui ainda
          </p>
          <p className="mx-auto mt-1 max-w-xs text-sm text-[var(--text-muted)]">
            Assim que você marcar tarefas como concluídas ou não concluídas, elas aparecerão neste período.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleKeys.map((key) => (
            <DayCard key={key} dateKey={key} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function HistoricoPage() {
  return (
    <ClientOnly fallback={<Skeleton />}>
      <HistoryContent />
    </ClientOnly>
  );
}
