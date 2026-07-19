"use client";

import { useEffect, useRef, useState } from "react";
import { Check, MoreHorizontal, Pencil, Trash2, X } from "lucide-react";
import { recurrenceLabel } from "@/lib/dateUtils";
import type { Task } from "@/lib/types";

const STATUS_META: Record<Task["status"], { label: string; dot: string; text: string }> = {
  pending: { label: "Pendente", dot: "bg-[var(--gray)]", text: "text-[var(--gray)]" },
  completed: { label: "Concluída", dot: "bg-[var(--green)]", text: "text-[var(--green)]" },
  missed: { label: "Não concluída", dot: "bg-[var(--red)]", text: "text-[var(--red)]" },
};

export default function TaskCard({
  task,
  onComplete,
  onMiss,
  onEdit,
  onDelete,
}: {
  task: Task;
  onComplete: () => void;
  onMiss: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const status = STATUS_META[task.status];

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      className={`group animate-fade-in-up card-shadow relative flex items-center gap-3 rounded-2xl border px-4 py-3.5 transition-colors ${
        task.status === "completed"
          ? "border-[rgba(52,211,153,0.25)] bg-[rgba(52,211,153,0.05)]"
          : task.status === "missed"
            ? "border-[rgba(251,113,133,0.25)] bg-[rgba(251,113,133,0.05)]"
            : "border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)]"
      }`}
    >
      <span className={`h-2 w-2 shrink-0 rounded-full ${status.dot}`} aria-hidden />

      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm font-medium ${
            task.status === "completed" ? "text-[var(--text-secondary)] line-through decoration-[var(--green)]/60" : "text-[var(--text-primary)]"
          }`}
        >
          {task.title}
        </p>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
          <span>{recurrenceLabel(task.recurrence, task.customIntervalDays)}</span>
          <span aria-hidden>•</span>
          <span className={status.text}>{status.label}</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <button
          onClick={onComplete}
          aria-label="Marcar como concluída"
          title="Marcar como concluída"
          className={`tap-scale neon-ring flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
            task.status === "completed"
              ? "border-[var(--green)] bg-[var(--green)] text-[#04140d]"
              : "border-[rgba(52,211,153,0.35)] text-[var(--green)] hover:bg-[var(--green-bg)]"
          }`}
        >
          <Check size={15} strokeWidth={2.6} />
        </button>
        <button
          onClick={onMiss}
          aria-label="Marcar como não concluída"
          title="Marcar como não concluída"
          className={`tap-scale neon-ring flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
            task.status === "missed"
              ? "border-[var(--red)] bg-[var(--red)] text-[#210a0f]"
              : "border-[rgba(251,113,133,0.35)] text-[var(--red)] hover:bg-[var(--red-bg)]"
          }`}
        >
          <X size={15} strokeWidth={2.6} />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Mais opções"
            className="tap-scale neon-ring flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-muted)] opacity-60 hover:bg-white/10 hover:text-[var(--text-primary)] hover:opacity-100 md:opacity-0 md:group-hover:opacity-100"
          >
            <MoreHorizontal size={16} />
          </button>
          {menuOpen && (
            <div className="glass-strong card-shadow animate-pop-in absolute right-0 top-9 z-20 w-40 overflow-hidden rounded-xl p-1">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onEdit();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-[var(--text-secondary)] hover:bg-white/10 hover:text-[var(--text-primary)]"
              >
                <Pencil size={14} /> Editar
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-[var(--red)] hover:bg-[var(--red-bg)]"
              >
                <Trash2 size={14} /> Excluir
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
