"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";
import { PageHeader } from "@/components/admin/Shell";
import { ReplayCard } from "@/components/admin/ReplayCard";
import { Segmented } from "@/components/ui/Controls";
import { Select } from "@/components/ui/Select";
import { arenas, replays } from "@/lib/mock-data";

export default function ReplaysPage() {
  const [arenaId, setArenaId] = useState("todas");
  const [status, setStatus] = useState<"todos" | "pronto" | "expirado">("todos");

  const lista = replays.filter(
    (r) =>
      (arenaId === "todas" || r.arenaId === arenaId) &&
      (status === "todos" ||
        (status === "pronto" ? r.status !== "expirado" : r.status === "expirado"))
  );

  return (
    <>
      <PageHeader
        titulo="Replays"
        descricao="Todos os lances salvos pelos jogadores, de todas as arenas."
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:max-w-2xl">
        <Select
          icon={Building2}
          value={arenaId}
          onChange={setArenaId}
          options={[
            { value: "todas", label: "Todas as arenas" },
            ...arenas.map((a) => ({ value: a.id, label: a.nome })),
          ]}
        />
        <Segmented
          value={status}
          onChange={setStatus}
          options={[
            { value: "todos", label: "Todos" },
            { value: "pronto", label: "Disponíveis" },
            { value: "expirado", label: "Expirados" },
          ]}
        />
      </div>

      <p className="mb-3 text-xs text-secondary">{lista.length} replays</p>

      {lista.length === 0 ? (
        <div className="neo-card rounded-[24px] p-10 text-center text-sm text-secondary">
          Nenhum replay com esses filtros.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {lista.map((r) => (
            <ReplayCard key={r.id} replay={r} />
          ))}
        </div>
      )}
    </>
  );
}
