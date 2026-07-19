"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { inputClass, labelClass } from "@/components/ui/formStyles";
import { computeMacros } from "@/lib/store/useNutritionStore";
import { FOOD_CATEGORY_META } from "@/lib/foodDatabase";
import type { FoodItem } from "@/lib/types";

export default function AddFoodModal({
  food,
  onClose,
  onConfirm,
}: {
  food: FoodItem | null;
  onClose: () => void;
  onConfirm: (unit: string, quantity: number) => void;
}) {
  const [unit, setUnit] = useState(food?.servings[0]?.unit ?? "g");
  const [quantity, setQuantity] = useState(100);

  useEffect(() => {
    if (food) {
      const defaultUnit = food.servings[0]?.unit ?? "g";
      setUnit(defaultUnit);
      setQuantity(defaultUnit === "g" || defaultUnit === "ml" ? 100 : 1);
    }
  }, [food]);

  const macros = useMemo(() => {
    if (!food) return null;
    return computeMacros(food, unit, quantity);
  }, [food, unit, quantity]);

  if (!food) return null;

  return (
    <Modal open={!!food} onClose={onClose} title={food.name} maxWidth={420}>
      <div className="mb-4 flex items-center gap-2 text-xs text-[var(--text-muted)]">
        <span>{FOOD_CATEGORY_META[food.category].emoji}</span>
        <span>{FOOD_CATEGORY_META[food.category].label}</span>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Quantidade</label>
          <input
            type="number"
            min={0}
            step="any"
            className={inputClass}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>
        <div>
          <label className={labelClass}>Medida</label>
          <select
            className={inputClass}
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          >
            {food.servings.map((s) => (
              <option key={s.unit} value={s.unit} className="bg-[var(--bg-card)]">
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {macros && (
        <div className="mb-5 grid grid-cols-3 gap-2 rounded-2xl bg-white/[0.03] p-3 text-center sm:grid-cols-6">
          <MacroPreview label="Kcal" value={macros.calories} />
          <MacroPreview label="Carb" value={`${macros.carbs}g`} />
          <MacroPreview label="Prot" value={`${macros.protein}g`} />
          <MacroPreview label="Gord" value={`${macros.fat}g`} />
          <MacroPreview label="Fibra" value={`${macros.fiber}g`} />
          <MacroPreview label="Açúcar" value={`${macros.sugar}g`} />
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          onClick={() => {
            onConfirm(unit, quantity);
            onClose();
          }}
          disabled={quantity <= 0}
        >
          Adicionar ao diário
        </Button>
      </div>
    </Modal>
  );
}

function MacroPreview({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-sm font-semibold text-[var(--text-primary)]">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">{label}</p>
    </div>
  );
}
