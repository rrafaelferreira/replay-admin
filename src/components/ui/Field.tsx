"use client";

import { cn } from "@/lib/cn";

export function Field({
  label,
  hint,
  className,
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <span className="text-xs font-medium text-secondary">{label}</span>
      {children}
      {hint && <span className="text-[11px] text-secondary/80">{hint}</span>}
    </label>
  );
}

interface TextInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "className"> {
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

/** Campo com o visual "neo-inset" do painel original. */
export function TextInput({ icon: Icon, className, ...props }: TextInputProps) {
  return (
    <div
      className={cn(
        "neo-inset flex items-center gap-2 rounded-[16px] px-4 py-3",
        className
      )}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0 text-secondary" />}
      <input
        autoComplete="off"
        {...props}
        className="w-full min-w-0 bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-secondary/60"
      />
    </div>
  );
}

export function NativeSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="neo-inset w-full rounded-[16px] px-4 py-3 text-sm font-medium text-foreground outline-none"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
