"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { inputClass, labelClass } from "@/components/ui/formStyles";
import type { NutritionGoals } from "@/lib/types";

export default function GoalsModal({
  open,
  onClose,
  goals,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  goals: NutritionGoals;
  onSave: (goals: NutritionGoals) => void;
}) {
  const [form, setForm] = useState(goals);

  useEffect(() => {
    if (open) setForm(goals);
  }, [open, goals]);

  const fields: { key: keyof NutritionGoals; label: string; unit: string }[] = [
    { key: "calories", label: "Calorias", unit: "kcal" },
    { key: "carbs", label: "Carboidratos", unit: "g" },
    { key: "protein", label: "Proteínas", unit: "g" },
    { key: "fat", label: "Gorduras", unit: "g" },
    { key: "fiber", label: "Fibras", unit: "g" },
    { key: "water", label: "Água", unit: "ml" },
  ];

  return (
    <Modal open={open} onClose={onClose} title="Metas diárias" maxWidth={420}>
      <div className="grid grid-cols-2 gap-3">
        {fields.map((f) => (
          <div key={f.key}>
            <label className={labelClass}>
              {f.label} ({f.unit})
            </label>
            <input
              type="number"
              min={0}
              className={inputClass}
              value={form[f.key]}
              onChange={(e) => setForm({ ...form, [f.key]: Math.max(0, Number(e.target.value) || 0) })}
            />
          </div>
        ))}
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          onClick={() => {
            onSave(form);
            onClose();
          }}
        >
          Salvar metas
        </Button>
      </div>
    </Modal>
  );
}
