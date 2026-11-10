"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Cctv, Film, MapPin, Plus, Search, User } from "lucide-react";
import { PageHeader } from "@/components/admin/Shell";
import { PagamentoBadge, StatusArenaBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/Field";
import { cn } from "@/lib/cn";
import { enderecoCurto, moeda } from "@/lib/format";
import { arenas } from "@/lib/mock-data";
import type { StatusArena } from "@/lib/types";

const FILTROS: { value: StatusArena | "todas"; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "ativa", label: "Ativas" },
  { value: "instalacao", label: "Em instalação" },
  { value: "suspensa", label: "Suspensas" },
];

export default function ArenasPage() {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<StatusArena | "todas">("todas");

  const lista = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return arenas.filter((a) => {
      if (filtro !== "todas" && a.status !== filtro) return false;
      if (!termo) return true;
      return [a.nome, a.proprietario.nome, a.endereco.cidade, a.endereco.bairro]
        .join(" ")
        .toLowerCase()
        .includes(termo);
    });
  }, [busca, filtro]);

  return (
    <>
      <PageHeader
        titulo="Arenas"
        descricao="Cada arena tem um proprietário, um endereço e uma ou mais quadras com câmera e botão."
        acao={
          <Button href="/admin/arenas/nova" size="sm" className="hidden sm:inline-flex">
            <Plus className="h-4 w-4" />
            Nova arena
          </Button>
        }
      />

      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center">
        <TextInput
          icon={Search}
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por arena, proprietário ou cidade"
          className="md:max-w-sm md:flex-1"
        />
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
          {FILTROS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFiltro(f.value)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition",
                filtro === f.value
                  ? "bg-accent text-white"
                  : "neo-card text-secondary hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {lista.length === 0 ? (
        <div className="neo-card rounded-[24px] p-10 text-center text-sm text-secondary">
          Nenhuma arena encontrada.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {lista.map((a) => {
            const online = a.quadras.filter((q) => q.camera.status === "online").length;
            const replaysHoje = a.quadras.reduce((s, q) => s + q.replaysHoje, 0);
            const modalidades = Array.from(new Set(a.quadras.map((q) => q.modalidade)));
            return (
              <Link
                key={a.id}
                href={`/admin/arenas/${a.id}`}
                className="neo-card group flex flex-col gap-4 rounded-[24px] p-5 transition hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-base font-bold text-foreground group-hover:text-accent">
                      {a.nome}
                    </h2>
                    <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-secondary">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      {enderecoCurto(a.endereco)}
                    </p>
                  </div>
                  <StatusArenaBadge status={a.status} />
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 shrink-0 text-secondary" />
                  <span className="truncate font-medium text-foreground">{a.proprietario.nome}</span>
                  <span className="truncate text-xs text-secondary">· {a.proprietario.telefone}</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {modalidades.map((m) => (
                    <span key={m} className="surface-muted rounded-full px-2.5 py-1 text-[11px] font-medium text-secondary">
                      {m}
                    </span>
                  ))}
                </div>

                <div className="neo-inset grid grid-cols-3 divide-x divide-[var(--border-subtle)] rounded-[16px] py-3 text-center">
                  <div>
                    <p className="text-lg font-bold text-foreground tabular-nums">{a.quadras.length}</p>
                    <p className="text-[11px] text-secondary">quadras</p>
                  </div>
                  <div>
                    <p
                      className={cn(
                        "flex items-center justify-center gap-1 text-lg font-bold tabular-nums",
                        online === a.quadras.length ? "text-success" : "text-warning"
                      )}
                    >
                      <Cctv className="h-4 w-4" />
                      {online}/{a.quadras.length}
                    </p>
                    <p className="text-[11px] text-secondary">câmeras on</p>
                  </div>
                  <div>
                    <p className="flex items-center justify-center gap-1 text-lg font-bold text-foreground tabular-nums">
                      <Film className="h-4 w-4 text-secondary" />
                      {replaysHoje}
                    </p>
                    <p className="text-[11px] text-secondary">replays hoje</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-secondary">
                    Plano <span className="font-semibold text-foreground">{a.plano.nome}</span> ·{" "}
                    {moeda(a.plano.valorMensal)}/mês
                  </span>
                  <PagamentoBadge status={a.plano.pagamento} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
