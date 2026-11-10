"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Battery,
  BatteryLow,
  Cctv,
  Clock,
  CreditCard,
  ExternalLink,
  Film,
  HardDrive,
  LayoutGrid,
  Mail,
  MapPin,
  Phone,
  Play,
  QrCode,
  RefreshCw,
  Settings2,
  User,
} from "lucide-react";
import { PageHeader } from "@/components/admin/Shell";
import {
  PagamentoBadge,
  StatusArenaBadge,
  StatusDispositivoBadge,
} from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle } from "@/components/ui/Card";
import { ProgressBar, Segmented, Toggle } from "@/components/ui/Controls";
import { Field, NativeSelect } from "@/components/ui/Field";
import { cn } from "@/lib/cn";
import { dataHora, moeda, tempoRelativo } from "@/lib/format";
import { buscarArena } from "@/lib/mock-data";
import type { Arena, Qualidade, Quadra } from "@/lib/types";

const ABAS = [
  { id: "quadras", label: "Quadras", icon: LayoutGrid },
  { id: "proprietario", label: "Proprietário", icon: User },
  { id: "replay", label: "Replay", icon: Settings2 },
  { id: "plano", label: "Plano", icon: CreditCard },
] as const;

type Aba = (typeof ABAS)[number]["id"];

function Linha({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 text-sm">
      <span className="text-secondary">{rotulo}</span>
      <span className="min-w-0 truncate text-right font-medium text-foreground">{children}</span>
    </div>
  );
}

function QuadraCard({ quadra, delay }: { quadra: Quadra; delay: number }) {
  const { camera, botao } = quadra;
  const bateriaBaixa = botao.bateria !== null && botao.bateria < 20;
  return (
    <Card delay={delay} className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-bold text-foreground">{quadra.nome}</h3>
          <p className="text-xs text-secondary">{quadra.modalidade}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold leading-none text-foreground tabular-nums">{quadra.replaysHoje}</p>
          <p className="text-[11px] text-secondary">replays hoje</p>
        </div>
      </div>

      {/* Câmera */}
      <div className="neo-inset rounded-[16px] p-3.5">
        <div className="flex items-center gap-2">
          <Cctv className="h-4 w-4 text-secondary" />
          <span className="flex-1 text-sm font-semibold text-foreground">{camera.nome}</span>
          <StatusDispositivoBadge status={camera.status} />
        </div>
        <div className="mt-2.5 grid grid-cols-3 gap-2 text-[11px]">
          <div>
            <p className="text-secondary">IP</p>
            <p className="truncate font-mono font-medium text-foreground">{camera.ip}</p>
          </div>
          <div>
            <p className="text-secondary">Resolução</p>
            <p className="font-medium text-foreground">{camera.resolucao}</p>
          </div>
          <div>
            <p className="text-secondary">Último sinal</p>
            <p className="font-medium text-foreground">{tempoRelativo(camera.ultimaConexao)}</p>
          </div>
        </div>
      </div>

      {/* Botão */}
      <div className="neo-inset rounded-[16px] p-3.5">
        <div className="flex items-center gap-2">
          {botao.tipo === "qrcode" ? (
            <QrCode className="h-4 w-4 text-secondary" />
          ) : (
            <span className="flex h-4 w-4 items-center justify-center">
              <span className="h-3 w-3 rounded-full border-2 border-secondary" />
            </span>
          )}
          <span className="flex-1 text-sm font-semibold text-foreground">
            {botao.tipo === "qrcode" ? "QR code" : "Botão físico"}{" "}
            <span className="font-mono text-xs font-medium text-secondary">{botao.codigo}</span>
          </span>
          <StatusDispositivoBadge status={botao.status} />
        </div>
        {botao.bateria !== null && (
          <div className="mt-3 flex items-center gap-2">
            {bateriaBaixa ? (
              <BatteryLow className="h-4 w-4 text-danger" />
            ) : (
              <Battery className="h-4 w-4 text-secondary" />
            )}
            <div className="progress-track h-1.5 flex-1 overflow-hidden rounded-full">
              <div
                className={cn("h-full rounded-full", bateriaBaixa ? "bg-danger" : "bg-success")}
                style={{ width: `${botao.bateria}%` }}
              />
            </div>
            <span className={cn("text-xs font-semibold tabular-nums", bateriaBaixa ? "text-danger" : "text-foreground")}>
              {botao.bateria}%
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-secondary">
          Último replay: {quadra.ultimoReplay ? tempoRelativo(quadra.ultimoReplay) : "nenhum ainda"}
        </span>
        <div className="flex gap-1">
          <button
            type="button"
            title="Ver ao vivo"
            className="neo-card flex h-9 w-9 items-center justify-center rounded-[12px] text-secondary transition hover:text-foreground"
          >
            <Play className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Reiniciar câmera"
            className="neo-card flex h-9 w-9 items-center justify-center rounded-[12px] text-secondary transition hover:text-foreground"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Card>
  );
}

function AbaReplay({ arena }: { arena: Arena }) {
  const [duracao, setDuracao] = useState(arena.config.duracaoSeg);
  const [retencao, setRetencao] = useState(String(arena.config.retencaoDias));
  const [qualidade, setQualidade] = useState<Qualidade>(arena.config.qualidade);
  const [marca, setMarca] = useState(arena.config.marcaDagua);
  const [salvo, setSalvo] = useState(false);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <Card>
        <CardTitle icon={Settings2}>Configuração do replay</CardTitle>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-secondary">Segundos salvos antes do clique</span>
            <Segmented value={duracao} onChange={(v) => { setDuracao(v); setSalvo(false); }} options={[15, 30, 45, 60].map((s) => ({ value: s, label: `${s}s` }))} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Vídeo fica disponível por">
              <NativeSelect value={retencao} onChange={(v) => { setRetencao(v); setSalvo(false); }} options={["3", "7", "15", "30"].map((d) => ({ value: d, label: `${d} dias` }))} />
            </Field>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-secondary">Qualidade</span>
              <Segmented value={qualidade} onChange={(v) => { setQualidade(v); setSalvo(false); }} options={[{ value: "720p", label: "720p" }, { value: "1080p", label: "1080p" }]} />
            </div>
          </div>
          <Toggle checked={marca} onChange={(v) => { setMarca(v); setSalvo(false); }} label="Logo da arena no vídeo" description="Marca d'água no canto do replay." />
          <Button onClick={() => setSalvo(true)} className="self-start" size="sm">
            {salvo ? "Alterações salvas" : "Salvar alterações"}
          </Button>
        </div>
      </Card>
      <Card glass>
        <CardTitle icon={HardDrive}>Armazenamento</CardTitle>
        <p className="text-2xl font-bold text-foreground tabular-nums">
          {arena.armazenamentoGb}
          <span className="text-sm font-semibold text-secondary"> / {arena.limiteArmazenamentoGb} GB</span>
        </p>
        <ProgressBar value={arena.armazenamentoGb} max={arena.limiteArmazenamentoGb} className="mt-3" />
        <p className="mt-4 text-xs leading-relaxed text-secondary">
          Vídeos mais antigos que {retencao} dias são apagados automaticamente. Reduzir a
          retenção ou a qualidade libera espaço.
        </p>
      </Card>
    </div>
  );
}

export default function ArenaDetalhePage() {
  const params = useParams<{ id: string }>();
  const arena = buscarArena(String(params?.id ?? ""));
  const [aba, setAba] = useState<Aba>("quadras");

  const voltar = (
    <Link href="/admin/arenas" className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-secondary hover:text-foreground">
      <ArrowLeft className="h-3.5 w-3.5" />
      Arenas
    </Link>
  );

  if (!arena) {
    return (
      <>
        {voltar}
        <div className="neo-card rounded-[24px] p-10 text-center text-sm text-secondary">Arena não encontrada.</div>
      </>
    );
  }

  const e = arena.endereco;
  const enderecoCompleto = `${e.rua}, ${e.numero} — ${e.bairro}, ${e.cidade}/${e.uf} · CEP ${e.cep}`;
  const mapa = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${e.rua}, ${e.numero}, ${e.cidade} ${e.uf}`)}`;
  const replaysHoje = arena.quadras.reduce((s, q) => s + q.replaysHoje, 0);

  return (
    <>
      <PageHeader
        voltar={voltar}
        titulo={arena.nome}
        descricao={enderecoCompleto}
        acao={
          <>
            <StatusArenaBadge status={arena.status} />
          </>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: LayoutGrid, k: "Quadras", v: arena.quadras.length },
          { icon: Film, k: "Replays hoje", v: replaysHoje },
          { icon: Clock, k: "Funcionamento", v: `${arena.horario.abre}–${arena.horario.fecha}` },
          { icon: CreditCard, k: "Plano", v: arena.plano.nome },
        ].map(({ icon: Icon, k, v }) => (
          <div key={k} className="neo-card flex items-center gap-3 rounded-[18px] p-3.5">
            <Icon className="h-4 w-4 shrink-0 text-accent" />
            <div className="min-w-0">
              <p className="text-[11px] text-secondary">{k}</p>
              <p className="truncate text-sm font-bold text-foreground tabular-nums">{v}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="no-scrollbar -mx-4 mb-5 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="neo-inset inline-flex gap-1 rounded-[16px] p-1">
          {ABAS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setAba(id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-[12px] px-4 py-2 text-sm font-semibold transition",
                aba === id ? "bg-accent text-white" : "text-secondary hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {aba === "quadras" && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {arena.quadras.map((q, i) => (
            <QuadraCard key={q.id} quadra={q} delay={i * 0.04} />
          ))}
        </div>
      )}

      {aba === "proprietario" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardTitle icon={User}>Proprietário</CardTitle>
            <div className="divide-y divide-[var(--border-subtle)]">
              <Linha rotulo="Nome">{arena.proprietario.nome}</Linha>
              <Linha rotulo="CPF / CNPJ">{arena.proprietario.documento}</Linha>
              <Linha rotulo="E-mail">{arena.proprietario.email}</Linha>
              <Linha rotulo="WhatsApp">{arena.proprietario.telefone}</Linha>
              <Linha rotulo="Cliente desde">{dataHora(arena.criadaEm).split(",")[0]}</Linha>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" href={`mailto:${arena.proprietario.email}`}>
                <Mail className="h-4 w-4" /> E-mail
              </Button>
              <Button size="sm" variant="secondary" href={`https://wa.me/55${arena.proprietario.telefone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                <Phone className="h-4 w-4" /> WhatsApp
              </Button>
              <Button size="sm" variant="ghost">Redefinir senha</Button>
            </div>
          </Card>
          <Card>
            <CardTitle icon={MapPin}>Localização</CardTitle>
            <div className="divide-y divide-[var(--border-subtle)]">
              <Linha rotulo="Endereço">{e.rua}, {e.numero}</Linha>
              <Linha rotulo="Bairro">{e.bairro}</Linha>
              <Linha rotulo="Cidade">{e.cidade}/{e.uf}</Linha>
              <Linha rotulo="CEP">{e.cep}</Linha>
              <Linha rotulo="Horário">{arena.horario.abre} às {arena.horario.fecha}</Linha>
            </div>
            <Button size="sm" variant="secondary" className="mt-4" href={mapa} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" /> Abrir no mapa
            </Button>
          </Card>
        </div>
      )}

      {aba === "replay" && <AbaReplay arena={arena} />}

      {aba === "plano" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardTitle icon={CreditCard} action={<PagamentoBadge status={arena.plano.pagamento} />}>
              Plano e cobrança
            </CardTitle>
            <p className="text-3xl font-bold text-foreground tabular-nums">
              {moeda(arena.plano.valorMensal)}
              <span className="text-sm font-semibold text-secondary">/mês</span>
            </p>
            <div className="mt-3 divide-y divide-[var(--border-subtle)]">
              <Linha rotulo="Plano">{arena.plano.nome}</Linha>
              <Linha rotulo="Vencimento">Todo dia {arena.plano.diaVencimento}</Linha>
              <Linha rotulo="Armazenamento incluso">{arena.limiteArmazenamentoGb} GB</Linha>
            </div>
          </Card>
          <Card>
            <CardTitle icon={Settings2}>Ações da conta</CardTitle>
            <p className="mb-4 text-sm text-secondary">
              Suspender desliga os botões de replay da arena até a situação ser regularizada. Os
              vídeos já gravados continuam guardados.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary">Trocar plano</Button>
              <Button size="sm" variant="danger">Suspender arena</Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
