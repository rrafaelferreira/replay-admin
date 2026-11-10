"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Cctv, QrCode, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/admin/Shell";
import { StatusDispositivoBadge } from "@/components/ui/Badge";
import { Segmented, Toggle } from "@/components/ui/Controls";
import { cn } from "@/lib/cn";
import { tempoRelativo } from "@/lib/format";
import { arenas } from "@/lib/mock-data";
import type { StatusDispositivo } from "@/lib/types";

type Linha = {
  id: string;
  tipo: "camera" | "botao";
  nome: string;
  detalhe: string;
  arenaId: string;
  arena: string;
  quadra: string;
  status: StatusDispositivo;
  info: string;
  alerta: boolean;
};

function montarLinhas(): Linha[] {
  return arenas.flatMap((a) =>
    a.quadras.flatMap((q) => {
      const cam: Linha = {
        id: q.camera.id,
        tipo: "camera",
        nome: q.camera.nome,
        detalhe: `${q.camera.ip} · ${q.camera.resolucao}`,
        arenaId: a.id,
        arena: a.nome,
        quadra: q.nome,
        status: q.camera.status,
        info: `sinal ${tempoRelativo(q.camera.ultimaConexao)}`,
        alerta: q.camera.status !== "online",
      };
      const bat = q.botao.bateria;
      const bt: Linha = {
        id: q.botao.id,
        tipo: "botao",
        nome: q.botao.codigo,
        detalhe: q.botao.tipo === "qrcode" ? "QR code" : "Botão físico",
        arenaId: a.id,
        arena: a.nome,
        quadra: q.nome,
        status: q.botao.status,
        info: bat === null ? "sem bateria" : `bateria ${bat}%`,
        alerta: q.botao.status !== "online" || (bat !== null && bat < 20),
      };
      return [cam, bt];
    })
  );
}

export default function DispositivosPage() {
  const [tipo, setTipo] = useState<"todos" | "camera" | "botao">("todos");
  const [soProblemas, setSoProblemas] = useState(false);
  const todas = useMemo(montarLinhas, []);
  const linhas = todas.filter(
    (l) => (tipo === "todos" || l.tipo === tipo) && (!soProblemas || l.alerta)
  );
  const problemas = todas.filter((l) => l.alerta).length;

  return (
    <>
      <PageHeader
        titulo="Dispositivos"
        descricao={`Câmeras e botões de todas as arenas · ${problemas} com problema`}
      />

      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="sm:w-80">
          <Segmented
            value={tipo}
            onChange={setTipo}
            options={[
              { value: "todos", label: "Todos" },
              { value: "camera", label: "Câmeras" },
              { value: "botao", label: "Botões" },
            ]}
          />
        </div>
        <div className="sm:w-56">
          <Toggle checked={soProblemas} onChange={setSoProblemas} label="Só com problema" />
        </div>
      </div>

      <div className="neo-card overflow-hidden rounded-[24px]">
        {/* Cabeçalho — só desktop */}
        <div className="hidden grid-cols-[1.4fr_1.4fr_1fr_110px_44px] gap-4 border-b border-[var(--border-subtle)] px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-secondary md:grid">
          <span>Dispositivo</span>
          <span>Arena · quadra</span>
          <span>Info</span>
          <span>Status</span>
          <span />
        </div>
        {linhas.length === 0 && (
          <p className="p-10 text-center text-sm text-secondary">Nenhum dispositivo com problema.</p>
        )}
        <ul className="divide-y divide-[var(--border-subtle)]">
          {linhas.map((l) => (
            <li
              key={l.id}
              className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-5 py-3.5 md:grid-cols-[1.4fr_1.4fr_1fr_110px_44px]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px]",
                    l.alerta ? "bg-danger/12 text-danger" : "surface-muted text-secondary"
                  )}
                >
                  {l.tipo === "camera" ? (
                    <Cctv className="h-4 w-4" />
                  ) : l.detalhe === "QR code" ? (
                    <QrCode className="h-4 w-4" />
                  ) : (
                    <span className="h-3 w-3 rounded-full border-2 border-current" />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-foreground">{l.nome}</span>
                  <span className="block truncate font-mono text-[11px] text-secondary">{l.detalhe}</span>
                </span>
              </div>
              <div className="md:hidden">
                <StatusDispositivoBadge status={l.status} />
              </div>
              <Link
                href={`/admin/arenas/${l.arenaId}`}
                className="col-span-2 min-w-0 truncate pl-12 text-xs text-secondary hover:text-accent md:col-span-1 md:pl-0 md:text-sm"
              >
                <span className="font-medium text-foreground">{l.arena}</span> · {l.quadra}
                <span className="md:hidden"> · {l.info}</span>
              </Link>
              <span className="hidden text-sm text-secondary md:block">{l.info}</span>
              <span className="hidden md:block">
                <StatusDispositivoBadge status={l.status} />
              </span>
              <button
                type="button"
                title="Reiniciar"
                className="hidden h-9 w-9 items-center justify-center rounded-[12px] text-secondary transition hover:bg-[var(--hover-card)] hover:text-foreground md:flex"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
