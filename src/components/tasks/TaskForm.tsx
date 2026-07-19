"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { inputClass, labelClass } from "@/components/ui/formStyles";
import type { Recurrence, Task } from "@/lib/types";

const RECURRENCE_OPTIONS: { value: Recurrence; label: string; hint: string }[] = [
  { value: "once", label: "Uma vez", hint: "Não se repete" },
  { value: "daily", label: "Diária", hint: "Reinicia toda meia-noite" },
  { value: "weekly", label: "Semanal", hint: "Reinicia toda segunda-feira" },
  { value: "monthly", label: "Mensal", hint: "Reinicia no dia 1º" },
  { value: "yearly", label: "Anual", hint: "Reinicia em 1º de janeiro" },
  { value: "custom", label: "Personalizada", hint: "Escolha o intervalo em dias" },
];

export default function TaskForm({
  open,
  onClose,
  onSubmit,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: {
    title: string;
    description?: string;
    recurrence: Recurrence;
    customIntervalDays?: number;
  }) => void;
  initial?: Task | null;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [recurrence, setRecurrence] = useState<Recurrence>("daily");
  const [customDays, setCustomDays] = useState(2);

  useEffect(() => {
    if (open) {
      setTitle(initial?.title ?? "");
      setDescription(initial?.description ?? "");
      setRecurrence(initial?.recurrence ?? "daily");
      setCustomDays(initial?.customIntervalDays ?? 2);
    }
  }, [open, initial]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title,
      description: description || undefined,
      recurrence,
      customIntervalDays: recurrence === "custom" ? customDays : undefined,
    });
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Editar tarefa" : "Nova tarefa"} maxWidth={460}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className={labelClass}>Título</label>
          <input
            autoFocus
            className={inputClass}
            placeholder="Ex: Beber água, Academia, Ler 10 páginas..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
          />
        </div>

        <div>
          <label className={labelClass}>Descrição (opcional)</label>
          <textarea
            className={`${inputClass} min-h-[70px] resize-none`}
            placeholder="Detalhes adicionais..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={200}
          />
        </div>

        <div>
          <label className={labelClass}>Recorrência</label>
          <div className="grid grid-cols-2 gap-2">
            {RECURRENCE_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt.value}
                onClick={() => setRecurrence(opt.value)}
                className={`tap-scale neon-ring rounded-xl border px-3 py-2.5 text-left transition-colors ${
                  recurrence === opt.value
                    ? "border-[var(--purple-neon)] bg-[rgba(168,85,247,0.14)]"
                    : "border-[var(--border-subtle)] bg-white/[0.03] hover:bg-white/[0.06]"
                }`}
              >
                <p className="text-sm font-semibold text-[var(--text-primary)]">{opt.label}</p>
                <p className="text-[11px] text-[var(--text-muted)]">{opt.hint}</p>
              </button>
            ))}
          </div>
        </div>

        {recurrence === "custom" && (
          <div>
            <label className={labelClass}>Repetir a cada quantos dias?</label>
            <input
              type="number"
              min={1}
              max={365}
              className={inputClass}
              value={customDays}
              onChange={(e) => setCustomDays(Math.max(1, Number(e.target.value) || 1))}
            />
          </div>
        )}

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={!title.trim()}>
            {initial ? "Salvar alterações" : "Criar tarefa"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
