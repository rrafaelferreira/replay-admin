"use client";

import Link from "next/link";
import {
  BatteryLow,
  Building2,
  Cctv,
  ChevronRight,
  CreditCard,
  Film,
  HardDrive,
  TriangleAlert,
  WifiOff,
  Wallet,
} from "lucide-react";
import { PageHeader, StatCard } from "@/components/admin/Shell";
import { ReplayCard } from "@/components/admin/ReplayCard";
import { StatusArenaBadge } from "@/components/ui/Badge";
import { Card, CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/Controls";
import { cn } from "@/lib/cn";
import { enderecoCurto, moeda, tempoRelativo } from "@/lib/format";
import { arenas, replays, totais } from "@/lib/mock-data";

type Alerta = {
  id: string;
  tom: "danger" | "warning";
  icon: React.ComponentType<{ className?: string }>;
  titulo: string;
  detalhe: string;
  href: string;
};

function montarAlertas(): Alerta[] {
  const lista: Alerta[] = [];
  for (const a of arenas) {
    if (a.status === "instalacao") continue;
    for (const q of a.quadras) {
      if (q.camera.status === "offline")
        lista.push({
          id: `${a.id}-${q.id}-cam`,
          tom: "danger",
          icon: WifiOff,
          titulo: `Câmera offline — ${q.nome}`,
          detalhe: `${a.nome} · sem sinal ${tempoRelativo(q.camera.ultimaConexao)}`,
          href: `/admin/arenas/${a.id}`,
        });
      else if (q.camera.status === "instavel")
        lista.push({
          id: `${a.id}-${q.id}-inst`,
          tom: "warning",
          icon: Cctv,
          titulo: `Conexão instável — ${q.nome}`,
          detalhe: `${a.nome} · pode perder replays`,
          href: `/admin/arenas/${a.id}`,
        });
      if (q.botao.bateria !== null && q.botao.bateria < 20)
        lista.push({
          id: `${a.id}-${q.id}-bat`,
          tom: "warning",
          icon: BatteryLow,
          titulo: `Bateria baixa — ${q.botao.codigo}`,
          detalhe: `${a.nome} · ${q.nome} · ${q.botao.bateria}%`,
          href: `/admin/arenas/${a.id}`,
        });
    }
    if (a.plano.pagamento !== "em_dia")
      lista.push({
        id: `${a.id}-pag`,
        tom: a.plano.pagamento === "atrasado" ? "danger" : "warning",
        icon: CreditCard,
        titulo: `Pagamento ${a.plano.pagamento === "atrasado" ? "atrasado" : "pendente"}`,
        detalhe: `${a.nome} · ${moeda(a.plano.valorMensal)} · vence dia ${a.plano.diaVencimento}`,
        href: `/admin/arenas/${a.id}`,
      });
    if (a.armazenamentoGb / a.limiteArmazenamentoGb >= 0.8)
      lista.push({
        id: `${a.id}-hd`,
        tom: "warning",
        icon: HardDrive,
        titulo: "Armazenamento quase cheio",
        detalhe: `${a.nome} · ${a.armazenamentoGb} de ${a.limiteArmazenamentoGb} GB`,
        href: `/admin/arenas/${a.id}`,
      });
  }
  return lista.sort((x, y) => (x.tom === y.tom ? 0 : x.tom === "danger" ? -1 : 1));
}

export default function VisaoGeralPage() {
  const t = totais();
  const alertas = montarAlertas();
  const hoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <>
      <PageHeader titulo="Visão geral" descricao={`Resumo da operação · ${hoje}`} />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          icon={Building2}
          rotulo="Arenas ativas"
          valor={t.arenasAtivas}
          detalhe={`${t.arenas} cadastradas · ${t.quadras} quadras`}
        />
        <StatCard
          icon={Cctv}
          rotulo="Câmeras online"
          valor={
            <>
              {t.camerasOnline}
              <span className="text-lg text-secondary">/{t.cameras}</span>
            </>
          }
          detalhe={`${t.cameras - t.camerasOnline} precisam de atenção`}
          tom={t.camerasOnline < t.cameras ? "warning" : "success"}
        />
        <StatCard icon={Film} rotulo="Replays hoje" valor={t.replaysHoje} detalhe="Somando todas as quadras" tom="success" />
        <StatCard icon={Wallet} rotulo="Receita mensal" valor={moeda(t.receitaMensal).replace(",00", "")} detalhe="Planos ativos e em instalação" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2" delay={0.05}>
          <CardTitle
            icon={TriangleAlert}
            action={<span className="text-xs font-semibold text-secondary">{alertas.length} itens</span>}
          >
            Precisa de atenção
          </CardTitle>
          {alertas.length === 0 ? (
            <p className="text-sm text-secondary">Tudo funcionando. Nenhum alerta agora.</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {alertas.map((al) => (
                <li key={al.id}>
                  <Link
                    href={al.href}
                    className="hover-card -mx-2 flex items-center gap-3 rounded-[14px] px-2 py-2.5 transition"
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px]",
                        al.tom === "danger" ? "bg-danger/12 text-danger" : "bg-warning/12 text-warning"
                      )}
                    >
                      <al.icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-foreground">{al.titulo}</span>
                      <span className="block truncate text-xs text-secondary">{al.detalhe}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-secondary" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card delay={0.1}>
          <CardTitle icon={HardDrive}>Armazenamento</CardTitle>
          <p className="text-[28px] font-bold leading-none text-foreground tabular-nums">
            {t.armazenamentoGb}
            <span className="text-base font-semibold text-secondary"> / {t.limiteGb} GB</span>
          </p>
          <ProgressBar value={t.armazenamentoGb} max={t.limiteGb} className="mt-3" />
          <ul className="mt-5 flex flex-col gap-3.5">
            {arenas.map((a) => (
              <li key={a.id}>
                <div className="mb-1.5 flex justify-between gap-2 text-xs">
                  <span className="truncate font-medium text-foreground">{a.nome}</span>
                  <span className="shrink-0 text-secondary tabular-nums">
                    {a.armazenamentoGb}/{a.limiteArmazenamentoGb} GB
                  </span>
                </div>
                <ProgressBar value={a.armazenamentoGb} max={a.limiteArmazenamentoGb} />
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Replays recentes</h2>
          <Link href="/admin/replays" className="text-xs font-semibold text-accent hover:underline">
            Ver todos
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {replays.slice(0, 4).map((r) => (
            <ReplayCard key={r.id} replay={r} />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Arenas</h2>
          <Link href="/admin/arenas" className="text-xs font-semibold text-accent hover:underline">
            Gerenciar
          </Link>
        </div>
        <div className="neo-card divide-y divide-[var(--border-subtle)] overflow-hidden rounded-[24px]">
          {arenas.map((a) => {
            const online = a.quadras.filter((q) => q.camera.status === "online").length;
            return (
              <Link
                key={a.id}
                href={`/admin/arenas/${a.id}`}
                className="hover-card flex items-center gap-3 px-5 py-3.5 transition"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-foreground">{a.nome}</span>
                  <span className="block truncate text-xs text-secondary">{enderecoCurto(a.endereco)}</span>
                </span>
                <span className="hidden text-xs text-secondary sm:block tabular-nums">
                  {online}/{a.quadras.length} câmeras online
                </span>
                <StatusArenaBadge status={a.status} />
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
