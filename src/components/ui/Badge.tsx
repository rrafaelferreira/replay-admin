import { cn } from "@/lib/cn";
import type {
  StatusArena,
  StatusDispositivo,
  StatusPagamento,
} from "@/lib/types";

type Tom = "success" | "warning" | "danger" | "accent" | "neutral";

const tons: Record<Tom, string> = {
  success: "bg-success/12 text-success",
  warning: "bg-warning/12 text-warning",
  danger: "bg-danger/12 text-danger",
  accent: "bg-accent/15 text-accent",
  neutral: "surface-muted text-secondary",
};

export function Badge({
  tom = "neutral",
  dot,
  pulse,
  children,
  className,
}: {
  tom?: Tom;
  dot?: boolean;
  pulse?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold",
        tons[tom],
        className
      )}
    >
      {dot && (
        <span
          className={cn("h-1.5 w-1.5 rounded-full bg-current", pulse && "live-dot")}
        />
      )}
      {children}
    </span>
  );
}

export function StatusDispositivoBadge({ status }: { status: StatusDispositivo }) {
  if (status === "online")
    return (
      <Badge tom="success" dot pulse>
        Online
      </Badge>
    );
  if (status === "instavel")
    return (
      <Badge tom="warning" dot>
        Instável
      </Badge>
    );
  return (
    <Badge tom="danger" dot>
      Offline
    </Badge>
  );
}

export function StatusArenaBadge({ status }: { status: StatusArena }) {
  if (status === "ativa") return <Badge tom="success">Ativa</Badge>;
  if (status === "instalacao") return <Badge tom="accent">Em instalação</Badge>;
  return <Badge tom="danger">Suspensa</Badge>;
}

export function PagamentoBadge({ status }: { status: StatusPagamento }) {
  if (status === "em_dia") return <Badge tom="success">Em dia</Badge>;
  if (status === "pendente") return <Badge tom="warning">Pendente</Badge>;
  return <Badge tom="danger">Atrasado</Badge>;
}
