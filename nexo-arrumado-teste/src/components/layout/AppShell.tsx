"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { CalendarClock, LayoutGrid, LineChart, Salad, Sparkles } from "lucide-react";
import { useTaskStore } from "@/lib/store/useTaskStore";
import { ToastProvider } from "@/components/ui/Toast";

const NAV_ITEMS = [
  { href: "/", label: "Hoje", icon: LayoutGrid },
  { href: "/historico", label: "Histórico", icon: CalendarClock },
  { href: "/progresso", label: "Progresso", icon: LineChart },
  { href: "/nutricao", label: "Nutrição", icon: Salad },
];

function RolloverWatcher() {
  const rollover = useTaskStore((s) => s.rollover);
  useEffect(() => {
    rollover();
    const interval = setInterval(() => rollover(), 30_000);
    const onFocus = () => rollover();
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [rollover]);
  return null;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ToastProvider>
      <RolloverWatcher />
      <div className="mx-auto flex min-h-dvh w-full max-w-[1400px]">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-dvh w-[248px] shrink-0 flex-col gap-1 border-r border-[var(--border-subtle)] px-4 py-6 md:flex">
          <div className="mb-8 flex items-center gap-2 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--purple-neon)] to-[var(--purple-deep)] shadow-[0_0_18px_rgba(168,85,247,0.55)]">
              <Sparkles size={18} className="text-white" strokeWidth={2.4} />
            </div>
            <span className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">Nexo</span>
          </div>

          <nav className="flex flex-1 flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`tap-scale group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-gradient-to-r from-[rgba(168,85,247,0.22)] to-[rgba(168,85,247,0.04)] text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)] hover:bg-white/5 hover:text-[var(--text-primary)]"
                  }`}
                >
                  <Icon
                    size={18}
                    strokeWidth={2.1}
                    className={active ? "text-[var(--purple-neon-2)]" : "text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]"}
                  />
                  {item.label}
                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--purple-neon-2)]" />}
                </Link>
              );
            })}
          </nav>

          <div className="glass rounded-2xl px-3 py-3 text-xs text-[var(--text-muted)]">
            <p className="font-medium text-[var(--text-secondary)]">Seus dados ficam no navegador</p>
            <p className="mt-1 leading-relaxed">Nada é enviado a servidores. Tudo salvo localmente.</p>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-h-dvh w-full flex-1 px-4 pb-28 pt-6 sm:px-6 md:pb-10 md:pt-8 lg:px-10">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="glass-strong fixed inset-x-3 bottom-3 z-50 flex items-center justify-around rounded-2xl px-2 py-2 md:hidden">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="tap-scale flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-1.5"
              >
                <Icon
                  size={20}
                  strokeWidth={2.2}
                  className={active ? "text-[var(--purple-neon-2)]" : "text-[var(--text-muted)]"}
                />
                <span className={`text-[10px] font-medium ${active ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"}`}>
                  {item.label}
                </span>
                {active && <span className="h-1 w-1 rounded-full bg-[var(--purple-neon-2)]" />}
              </Link>
            );
          })}
        </nav>
      </div>
    </ToastProvider>
  );
}
