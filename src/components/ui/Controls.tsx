"use client";

import { cn } from "@/lib/cn";

/** Botões lado a lado para escolher uma opção (ex.: 15s / 30s / 45s / 60s). */
export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="neo-inset flex gap-1 rounded-[16px] p-1">
      {options.map((o) => {
        const ativo = o.value === value;
        return (
          <button
            key={String(o.value)}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              "flex-1 rounded-[12px] px-3 py-2 text-sm font-semibold transition",
              ativo
                ? "bg-accent text-white shadow-[0_4px_16px_rgba(123,97,255,0.35)]"
                : "text-secondary hover:text-foreground"
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-4 text-left"
    >
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-foreground">{label}</span>
        {description && (
          <span className="mt-0.5 block text-xs text-secondary">{description}</span>
        )}
      </span>
      <span
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors",
          checked ? "bg-accent" : "neo-inset"
        )}
      >
        <span
          className={cn(
            "absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all",
            checked ? "left-6" : "left-1"
          )}
        />
      </span>
    </button>
  );
}

export function ProgressBar({
  value,
  max,
  className,
}: {
  value: number;
  max: number;
  className?: string;
}) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const cor = pct >= 85 ? "bg-danger" : pct >= 70 ? "bg-warning" : "bg-accent";
  return (
    <div className={cn("progress-track h-2 overflow-hidden rounded-full", className)}>
      <div className={cn("h-full rounded-full transition-all", cor)} style={{ width: `${pct}%` }} />
    </div>
  );
}
