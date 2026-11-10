"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Building2,
  Cctv,
  Film,
  LayoutDashboard,
  Moon,
  Plus,
  ShieldCheck,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/admin", label: "Visão geral", curto: "Início", icon: LayoutDashboard },
  { href: "/admin/arenas", label: "Arenas", curto: "Arenas", icon: Building2 },
  { href: "/admin/dispositivos", label: "Dispositivos", curto: "Dispositivos", icon: Cctv },
  { href: "/admin/replays", label: "Replays", curto: "Replays", icon: Film },
];

function ativo(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

function Marca() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-accent/15">
        <span className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-accent">
          <span className="absolute h-6 w-6 rounded-full border-2 border-accent/40" />
        </span>
      </div>
      <div className="leading-tight">
        <p className="text-sm font-bold text-foreground">Painel Replay</p>
        <p className="text-[11px] text-secondary">Operador da plataforma</p>
      </div>
    </div>
  );
}

function ThemeToggle({ className }: { className?: string }) {
  const [tema, setTema] = useState<"dark" | "light">("dark");

  useEffect(() => {
    let salvo: string | null = null;
    try {
      salvo = localStorage.getItem("tema");
    } catch {}
    const t = salvo === "light" ? "light" : "dark";
    setTema(t);
    document.documentElement.dataset.theme = t;
  }, []);

  function alternar() {
    const t = tema === "dark" ? "light" : "dark";
    setTema(t);
    document.documentElement.dataset.theme = t;
    try {
      localStorage.setItem("tema", t);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label="Alternar tema"
      className={cn(
        "neo-card flex h-10 w-10 items-center justify-center rounded-[14px] text-secondary transition hover:text-foreground",
        className
      )}
    >
      {tema === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/admin";

  return (
    <div className="page-glow min-h-[100svh]">
      {/* Sidebar — desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col gap-6 border-r border-[var(--border-subtle)] bg-[var(--card)]/60 p-5 backdrop-blur-xl lg:flex">
        <Marca />

        <Link
          href="/admin/arenas/nova"
          className="flex items-center justify-center gap-2 rounded-[16px] bg-accent px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(123,97,255,0.35)] transition hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          Nova arena
        </Link>

        <nav className="flex flex-col gap-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const on = ativo(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-sm font-medium transition",
                  on
                    ? "bg-accent/15 font-semibold text-accent"
                    : "text-secondary hover:bg-[var(--hover-card)] hover:text-foreground"
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex items-center gap-3">
          <div className="neo-inset flex min-w-0 flex-1 items-center gap-2 rounded-[14px] px-3 py-2">
            <ShieldCheck className="h-4 w-4 shrink-0 text-accent" />
            <span className="truncate text-xs font-medium text-secondary">
              Super admin
            </span>
          </div>
          <ThemeToggle />
        </div>
      </aside>

      {/* Topo — celular/tablet */}
      <header className="glass-nav sticky top-0 z-40 flex items-center justify-between border-x-0 border-t-0 px-4 py-3 lg:hidden">
        <Marca />
        <div className="flex items-center gap-2">
          <Link
            href="/admin/arenas/nova"
            aria-label="Nova arena"
            className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-accent text-white"
          >
            <Plus className="h-4 w-4" />
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="px-4 pb-28 pt-6 sm:px-6 lg:ml-64 lg:px-10 lg:pb-12 lg:pt-10">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </main>

      {/* Barra inferior — celular/tablet */}
      <nav className="glass-nav fixed inset-x-3 bottom-3 z-40 flex justify-around rounded-[22px] p-1.5 lg:hidden">
        {NAV.map(({ href, curto, icon: Icon }) => {
          const on = ativo(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-[16px] py-2 text-[10px] font-semibold transition",
                on ? "bg-accent/15 text-accent" : "text-secondary"
              )}
            >
              <Icon className="h-5 w-5" />
              {curto}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function PageHeader({
  titulo,
  descricao,
  acao,
  voltar,
}: {
  titulo: string;
  descricao?: string;
  acao?: React.ReactNode;
  voltar?: React.ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {voltar}
        <h1 className="text-2xl font-bold text-foreground sm:text-[28px]">{titulo}</h1>
        {descricao && <p className="mt-1 text-sm text-secondary">{descricao}</p>}
      </div>
      {acao && <div className="flex shrink-0 gap-2">{acao}</div>}
    </header>
  );
}

export function StatCard({
  icon: Icon,
  rotulo,
  valor,
  detalhe,
  tom = "accent",
}: {
  icon: React.ComponentType<{ className?: string }>;
  rotulo: string;
  valor: React.ReactNode;
  detalhe?: React.ReactNode;
  tom?: "accent" | "success" | "warning" | "danger";
}) {
  const cores = {
    accent: "bg-accent/15 text-accent",
    success: "bg-success/12 text-success",
    warning: "bg-warning/12 text-warning",
    danger: "bg-danger/12 text-danger",
  };
  return (
    <div className="neo-card flex flex-col gap-3 rounded-[24px] p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-secondary">{rotulo}</span>
        <span className={cn("flex h-9 w-9 items-center justify-center rounded-[12px]", cores[tom])}>
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>
      <p className="text-[28px] font-bold leading-none tracking-tight text-foreground tabular-nums">
        {valor}
      </p>
      {detalhe && <p className="text-xs text-secondary">{detalhe}</p>}
    </div>
  );
}
