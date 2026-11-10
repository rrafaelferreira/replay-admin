"use client";

import { Eye, Loader2, Play } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import { tempoRelativo } from "@/lib/format";
import { buscarArena } from "@/lib/mock-data";
import type { Replay } from "@/lib/types";

export function ReplayCard({ replay }: { replay: Replay }) {
  const arena = buscarArena(replay.arenaId);
  const quadra = arena?.quadras.find((q) => q.id === replay.quadraId);
  const expirado = replay.status === "expirado";

  return (
    <div className="neo-card group overflow-hidden rounded-[20px]">
      <div
        className={cn(
          "replay-thumb relative flex aspect-video items-center justify-center",
          expirado && "opacity-50 grayscale"
        )}
      >
        {/* linhas da quadra, só decorativo */}
        <div className="absolute inset-[18%_14%] rounded-[6px] border border-white/20">
          <div className="absolute inset-y-0 left-1/2 border-l border-white/20" />
        </div>
        {replay.status === "processando" ? (
          <Loader2 className="relative h-7 w-7 animate-spin text-white/80" />
        ) : (
          <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-black/35 backdrop-blur-sm transition group-hover:scale-110">
            <Play className="ml-0.5 h-5 w-5 fill-white text-white" />
          </span>
        )}
        <span className="absolute bottom-2 right-2 rounded-md bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold text-white tabular-nums">
          0:{String(replay.duracaoSeg).padStart(2, "0")}
        </span>
        {replay.status === "processando" && (
          <Badge tom="accent" className="absolute left-2 top-2">
            Processando
          </Badge>
        )}
        {expirado && (
          <Badge tom="neutral" className="absolute left-2 top-2 bg-black/50 text-white">
            Expirado
          </Badge>
        )}
      </div>
      <div className="flex flex-col gap-1 p-3.5">
        <p className="truncate text-sm font-semibold text-foreground">
          {quadra?.nome ?? "Quadra"} · {quadra?.modalidade}
        </p>
        <p className="truncate text-xs text-secondary">{arena?.nome}</p>
        <div className="mt-1 flex items-center justify-between text-[11px] text-secondary">
          <span>{tempoRelativo(replay.criadoEm)}</span>
          <span className="flex items-center gap-1 tabular-nums">
            <Eye className="h-3.5 w-3.5" />
            {replay.visualizacoes}
          </span>
        </div>
      </div>
    </div>
  );
}
