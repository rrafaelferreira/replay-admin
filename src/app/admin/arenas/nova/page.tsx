"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Building2,
  Check,
  Clock,
  Copy,
  CreditCard,
  KeyRound,
  LayoutGrid,
  Mail,
  MapPin,
  Phone,
  Plus,
  Settings2,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/Shell";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Segmented, Toggle } from "@/components/ui/Controls";
import { Field, NativeSelect, TextInput } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { moeda } from "@/lib/format";
import { MODALIDADES, type Modalidade, type Qualidade } from "@/lib/types";

const UFS = "AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" ");

const PLANOS = [
  { value: "Básico", label: "Básico — até 2 quadras", valor: 199 },
  { value: "Pro", label: "Pro — até 5 quadras", valor: 349 },
  { value: "Ilimitado", label: "Ilimitado — quadras ilimitadas", valor: 549 },
];

type QuadraForm = {
  key: number;
  nome: string;
  modalidade: Modalidade;
  botao: "fisico" | "qrcode";
};

function Secao({
  numero,
  icon: Icon,
  titulo,
  descricao,
  children,
  delay,
}: {
  numero: number;
  icon: React.ComponentType<{ className?: string }>;
  titulo: string;
  descricao: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <Card delay={delay}>
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-accent/15 text-accent">
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-secondary">
            Etapa {numero}
          </p>
          <h2 className="font-semibold text-foreground">{titulo}</h2>
          <p className="mt-0.5 text-xs text-secondary">{descricao}</p>
        </div>
      </div>
      {children}
    </Card>
  );
}

function gerarSenha() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export default function NovaArenaPage() {
  // 1. Proprietário
  const [dono, setDono] = useState({ nome: "", documento: "", email: "", telefone: "" });
  // 2. Arena
  const [arena, setArena] = useState({
    nome: "",
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    uf: "SP",
    abre: "07:00",
    fecha: "23:00",
  });
  // 3. Quadras
  const [quadras, setQuadras] = useState<QuadraForm[]>([
    { key: 1, nome: "Quadra 1", modalidade: "Beach tennis", botao: "fisico" },
  ]);
  // 4. Replay
  const [duracao, setDuracao] = useState(30);
  const [retencao, setRetencao] = useState("7");
  const [qualidade, setQualidade] = useState<Qualidade>("1080p");
  const [marcaDagua, setMarcaDagua] = useState(true);
  // 5. Plano
  const [plano, setPlano] = useState("Pro");
  const [vencimento, setVencimento] = useState("10");

  const [enviado, setEnviado] = useState<{ email: string; senha: string } | null>(null);
  const [copiado, setCopiado] = useState(false);

  const planoAtual = PLANOS.find((p) => p.value === plano)!;
  const valido =
    dono.nome.trim() &&
    dono.email.includes("@") &&
    arena.nome.trim() &&
    arena.cidade.trim() &&
    quadras.length > 0 &&
    quadras.every((q) => q.nome.trim());

  function adicionarQuadra() {
    setQuadras((qs) => [
      ...qs,
      {
        key: Date.now(),
        nome: `Quadra ${qs.length + 1}`,
        modalidade: qs[qs.length - 1]?.modalidade ?? "Beach tennis",
        botao: "fisico",
      },
    ]);
  }

  function atualizarQuadra(key: number, patch: Partial<QuadraForm>) {
    setQuadras((qs) => qs.map((q) => (q.key === key ? { ...q, ...patch } : q)));
  }

  function salvar() {
    // Sem back-end ainda: apenas simula a criação do acesso do dono.
    setEnviado({ email: dono.email, senha: gerarSenha() });
    setCopiado(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function copiarCredenciais() {
    if (!enviado) return;
    try {
      await navigator.clipboard.writeText(
        `Acesso Painel Replay\nArena: ${arena.nome}\nE-mail: ${enviado.email}\nSenha temporária: ${enviado.senha}`
      );
    } catch {}
    setCopiado(true);
  }

  const voltar = (
    <Link
      href="/admin/arenas"
      className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-secondary hover:text-foreground"
    >
      <ArrowLeft className="h-3.5 w-3.5" />
      Arenas
    </Link>
  );

  if (enviado) {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        {voltar}
        <Card glass>
          <div className="mb-4 flex items-center gap-2 text-success">
            <Check className="h-5 w-5" />
            <h2 className="font-semibold">Arena cadastrada</h2>
          </div>
          <p className="mb-4 text-sm text-secondary">
            <span className="font-semibold text-foreground">{arena.nome}</span> foi criada com{" "}
            {quadras.length} {quadras.length === 1 ? "quadra" : "quadras"}. Este é o acesso do
            proprietário ao painel dele:
          </p>
          <div className="neo-inset flex flex-col gap-3 rounded-[18px] p-4">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-secondary">Proprietário</p>
              <p className="text-sm font-semibold text-foreground">{dono.nome}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-secondary">E-mail</p>
              <p className="break-all text-sm font-semibold text-foreground">{enviado.email}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-secondary">Senha temporária</p>
              <p className="break-all font-mono text-lg font-bold tracking-wide text-accent">
                {enviado.senha}
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button fullWidth variant="secondary" onClick={copiarCredenciais}>
              {copiado ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copiado ? "Credenciais copiadas" : "Copiar credenciais"}
            </Button>
            <Button fullWidth href="/admin/arenas">
              Ir para arenas
            </Button>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-secondary">
            A senha é exibida somente agora. Envie-a por um canal seguro. No primeiro login, o
            proprietário será obrigado a cadastrar uma nova senha.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        voltar={voltar}
        titulo="Nova arena"
        descricao="Cadastre o proprietário, o local e as quadras que vão ter câmera de replay."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-start">
        <div className="flex flex-col gap-4">
          <Secao numero={1} icon={User} titulo="Proprietário" descricao="Quem contrata o sistema e recebe o acesso ao painel da arena.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nome completo" className="sm:col-span-2">
                <TextInput value={dono.nome} onChange={(e) => setDono({ ...dono, nome: e.target.value })} placeholder="Ex.: Marcos Tavares" />
              </Field>
              <Field label="CPF ou CNPJ">
                <TextInput value={dono.documento} onChange={(e) => setDono({ ...dono, documento: e.target.value })} placeholder="00.000.000/0000-00" inputMode="numeric" />
              </Field>
              <Field label="WhatsApp">
                <TextInput icon={Phone} value={dono.telefone} onChange={(e) => setDono({ ...dono, telefone: e.target.value })} placeholder="(00) 00000-0000" inputMode="tel" />
              </Field>
              <Field label="E-mail (será o login)" className="sm:col-span-2">
                <TextInput icon={Mail} type="email" value={dono.email} onChange={(e) => setDono({ ...dono, email: e.target.value })} placeholder="dono@arena.com.br" />
              </Field>
            </div>
          </Secao>

          <Secao numero={2} icon={MapPin} titulo="Arena e localização" descricao="O nome que aparece nos vídeos e onde fica o espaço." delay={0.04}>
            <div className="grid gap-4 sm:grid-cols-6">
              <Field label="Nome da arena" className="sm:col-span-6">
                <TextInput icon={Building2} value={arena.nome} onChange={(e) => setArena({ ...arena, nome: e.target.value })} placeholder="Ex.: Arena Pé na Areia" />
              </Field>
              <Field label="CEP" className="sm:col-span-2">
                <TextInput value={arena.cep} onChange={(e) => setArena({ ...arena, cep: e.target.value })} placeholder="00000-000" inputMode="numeric" />
              </Field>
              <Field label="Rua / avenida" className="sm:col-span-4">
                <TextInput value={arena.rua} onChange={(e) => setArena({ ...arena, rua: e.target.value })} placeholder="Av. Brasil" />
              </Field>
              <Field label="Número" className="sm:col-span-2">
                <TextInput value={arena.numero} onChange={(e) => setArena({ ...arena, numero: e.target.value })} placeholder="123" />
              </Field>
              <Field label="Bairro" className="sm:col-span-4">
                <TextInput value={arena.bairro} onChange={(e) => setArena({ ...arena, bairro: e.target.value })} placeholder="Centro" />
              </Field>
              <Field label="Cidade" className="sm:col-span-4">
                <TextInput value={arena.cidade} onChange={(e) => setArena({ ...arena, cidade: e.target.value })} placeholder="Campinas" />
              </Field>
              <Field label="UF" className="sm:col-span-2">
                <NativeSelect value={arena.uf} onChange={(uf) => setArena({ ...arena, uf })} options={UFS.map((u) => ({ value: u, label: u }))} />
              </Field>
              <Field label="Abre às" hint="Câmeras gravam só no horário de funcionamento" className="sm:col-span-3">
                <TextInput icon={Clock} type="time" value={arena.abre} onChange={(e) => setArena({ ...arena, abre: e.target.value })} />
              </Field>
              <Field label="Fecha às" className="sm:col-span-3">
                <TextInput icon={Clock} type="time" value={arena.fecha} onChange={(e) => setArena({ ...arena, fecha: e.target.value })} />
              </Field>
            </div>
          </Secao>

          <Secao numero={3} icon={LayoutGrid} titulo="Quadras" descricao="Cada quadra recebe uma câmera e um botão de replay." delay={0.08}>
            <div className="flex flex-col gap-3">
              {quadras.map((q, i) => (
                <div key={q.key} className="surface-muted rounded-[18px] border border-[var(--border-subtle)] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-secondary">Quadra {i + 1}</span>
                    {quadras.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setQuadras((qs) => qs.filter((x) => x.key !== q.key))}
                        className="flex items-center gap-1 text-xs font-semibold text-danger/90 hover:text-danger"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remover
                      </button>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Nome da quadra">
                      <TextInput value={q.nome} onChange={(e) => atualizarQuadra(q.key, { nome: e.target.value })} placeholder="Quadra 1" />
                    </Field>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-medium text-secondary">Modalidade</span>
                      <Select
                        value={q.modalidade}
                        onChange={(v) => atualizarQuadra(q.key, { modalidade: v as Modalidade })}
                        options={MODALIDADES.map((m) => ({ value: m, label: m }))}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <span className="text-xs font-medium text-secondary">Como o jogador aciona o replay</span>
                      <Segmented
                        value={q.botao}
                        onChange={(v) => atualizarQuadra(q.key, { botao: v })}
                        options={[
                          { value: "fisico", label: "Botão físico" },
                          { value: "qrcode", label: "QR code" },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="secondary" size="sm" onClick={adicionarQuadra} className="self-start">
                <Plus className="h-4 w-4" />
                Adicionar quadra
              </Button>
            </div>
          </Secao>

          <Secao numero={4} icon={Settings2} titulo="Configuração do replay" descricao="Pode ser ajustado depois, por arena." delay={0.12}>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-secondary">Segundos salvos antes do clique</span>
                <Segmented
                  value={duracao}
                  onChange={setDuracao}
                  options={[15, 30, 45, 60].map((s) => ({ value: s, label: `${s}s` }))}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Vídeo fica disponível por">
                  <NativeSelect
                    value={retencao}
                    onChange={setRetencao}
                    options={["3", "7", "15", "30"].map((d) => ({ value: d, label: `${d} dias` }))}
                  />
                </Field>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-secondary">Qualidade</span>
                  <Segmented
                    value={qualidade}
                    onChange={setQualidade}
                    options={[
                      { value: "720p", label: "720p" },
                      { value: "1080p", label: "1080p" },
                    ]}
                  />
                </div>
              </div>
              <Toggle
                checked={marcaDagua}
                onChange={setMarcaDagua}
                label="Logo da arena no vídeo"
                description="Marca d'água no canto do replay — bom para divulgação nas redes."
              />
            </div>
          </Secao>

          <Secao numero={5} icon={CreditCard} titulo="Plano e cobrança" descricao="Valor mensal cobrado do proprietário." delay={0.16}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-secondary">Plano</span>
                <Select value={plano} onChange={setPlano} options={PLANOS} icon={CreditCard} />
              </div>
              <Field label="Dia de vencimento">
                <NativeSelect
                  value={vencimento}
                  onChange={setVencimento}
                  options={["5", "10", "15", "20", "25"].map((d) => ({ value: d, label: `Todo dia ${d}` }))}
                />
              </Field>
            </div>
          </Secao>
        </div>

        {/* Resumo lateral */}
        <div className="lg:sticky lg:top-10">
          <Card glass delay={0.1}>
            <h2 className="mb-4 font-semibold text-foreground">Resumo</h2>
            <dl className="flex flex-col gap-3 text-sm">
              {[
                ["Arena", arena.nome || "—"],
                ["Proprietário", dono.nome || "—"],
                ["Local", arena.cidade ? `${arena.cidade}/${arena.uf}` : "—"],
                ["Quadras", String(quadras.length)],
                ["Replay", `${duracao}s · ${qualidade} · ${retencao} dias`],
                ["Plano", `${plano} · ${moeda(planoAtual.valor)}/mês`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-secondary">{k}</dt>
                  <dd className="truncate text-right font-medium text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
            <Button fullWidth className="mt-5" disabled={!valido} onClick={salvar}>
              <KeyRound className="h-5 w-5" />
              Cadastrar e gerar acesso
            </Button>
            {!valido && (
              <p className="mt-3 text-center text-[11px] text-secondary">
                Preencha nome e e-mail do proprietário, nome da arena e cidade.
              </p>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
