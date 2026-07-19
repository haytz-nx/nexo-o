"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "success";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gradient-to-br from-[var(--purple-neon)] to-[var(--purple-deep)] text-white shadow-[0_8px_24px_-6px_rgba(168,85,247,0.6)] hover:brightness-110",
  secondary: "glass text-[var(--text-primary)] hover:bg-white/10",
  ghost: "text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]",
  danger: "bg-[var(--red-bg)] text-[var(--red)] hover:bg-[rgba(251,113,133,0.2)]",
  success: "bg-[var(--green-bg)] text-[var(--green)] hover:bg-[rgba(52,211,153,0.2)]",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-4 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-6 py-3.5 text-base rounded-2xl gap-2.5",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  className = "",
  ...props
}: {
  children?: ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`tap-scale neon-ring inline-flex items-center justify-center font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
