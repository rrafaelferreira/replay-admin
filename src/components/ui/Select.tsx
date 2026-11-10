"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SelectOption {
  value: string;
  label: string;
}

/**
 * Dropdown customizado — generalização do "AcademiaSelect" do painel original.
 */
export function Select({
  options,
  value,
  onChange,
  icon: Icon,
  placeholder = "Selecione",
}: {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ComponentType<{ className?: string }>;
  placeholder?: string;
}) {
  const [aberto, setAberto] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selecionada = options.find((o) => o.value === value);

  useEffect(() => {
    if (!aberto) return;
    function fecharFora(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setAberto(false);
    }
    function fecharEsc(event: KeyboardEvent) {
      if (event.key === "Escape") setAberto(false);
    }
    document.addEventListener("mousedown", fecharFora);
    document.addEventListener("keydown", fecharEsc);
    return () => {
      document.removeEventListener("mousedown", fecharFora);
      document.removeEventListener("keydown", fecharEsc);
    };
  }, [aberto]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={aberto}
        aria-controls={listId}
        onClick={() => setAberto((prev) => !prev)}
        className="neo-inset flex w-full items-center gap-2 rounded-[16px] px-4 py-3 text-left transition hover:brightness-110"
      >
        {Icon && <Icon className="h-4 w-4 shrink-0 text-secondary" />}
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
          {selecionada ? selecionada.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-secondary transition-transform",
            aberto && "rotate-180"
          )}
        />
      </button>

      {aberto && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-2 max-h-56 w-full overflow-y-auto rounded-[16px] border border-[var(--border-strong)] bg-[var(--card)] p-1.5 shadow-[var(--neo-shadow)]"
        >
          {options.map((o) => {
            const ativa = o.value === value;
            return (
              <li key={o.value} role="option" aria-selected={ativa}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    setAberto(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-[12px] px-3 py-2.5 text-left text-sm transition",
                    ativa
                      ? "bg-accent/15 font-semibold text-accent"
                      : "font-medium text-foreground hover:bg-[var(--hover-card)]"
                  )}
                >
                  <span className="min-w-0 flex-1 truncate">{o.label}</span>
                  {ativa && <Check className="h-4 w-4 shrink-0 text-accent" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
