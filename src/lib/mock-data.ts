// Dados fictícios só para montar a interface.
// Quando o back-end existir, troque estas constantes pelas consultas reais.
import type { Arena, Replay } from "./types";

const agora = Date.now();
const min = (m: number) => new Date(agora - m * 60_000).toISOString();
const dias = (d: number) => new Date(agora - d * 86_400_000).toISOString();

export const arenas: Arena[] = [
  {
    id: "pe-na-areia",
    nome: "Arena Pé na Areia",
    proprietario: {
      nome: "Marcos Tavares",
      documento: "12.345.678/0001-90",
      email: "marcos@penaareia.com.br",
      telefone: "(19) 99812-4410",
    },
    endereco: {
      cep: "13090-000",
      rua: "Av. Moraes Salles",
      numero: "1820",
      bairro: "Cambuí",
      cidade: "Campinas",
      uf: "SP",
    },
    horario: { abre: "07:00", fecha: "23:00" },
    status: "ativa",
    quadras: [
      {
        id: "q1",
        nome: "Quadra 1",
        modalidade: "Beach tennis",
        camera: { id: "cam-101", nome: "Câmera Q1", ip: "192.168.0.101", resolucao: "1080p", status: "online", ultimaConexao: min(0) },
        botao: { id: "bt-101", codigo: "BTN-101", tipo: "fisico", bateria: 82, status: "online" },
        replaysHoje: 38,
        ultimoReplay: min(4),
      },
      {
        id: "q2",
        nome: "Quadra 2",
        modalidade: "Beach tennis",
        camera: { id: "cam-102", nome: "Câmera Q2", ip: "192.168.0.102", resolucao: "1080p", status: "online", ultimaConexao: min(0) },
        botao: { id: "bt-102", codigo: "BTN-102", tipo: "fisico", bateria: 14, status: "online" },
        replaysHoje: 27,
        ultimoReplay: min(12),
      },
      {
        id: "q3",
        nome: "Quadra 3",
        modalidade: "Futevôlei",
        camera: { id: "cam-103", nome: "Câmera Q3", ip: "192.168.0.103", resolucao: "1080p", status: "instavel", ultimaConexao: min(3) },
        botao: { id: "bt-103", codigo: "BTN-103", tipo: "fisico", bateria: 67, status: "online" },
        replaysHoje: 19,
        ultimoReplay: min(31),
      },
    ],
    config: { duracaoSeg: 30, retencaoDias: 7, qualidade: "1080p", marcaDagua: true },
    plano: { nome: "Pro", valorMensal: 349, diaVencimento: 10, pagamento: "em_dia" },
    armazenamentoGb: 148,
    limiteArmazenamentoGb: 250,
    criadaEm: dias(124),
  },
  {
    id: "point-futevolei",
    nome: "Point do Futevôlei",
    proprietario: {
      nome: "Juliana Prado",
      documento: "321.654.987-00",
      email: "juliana@pointfutevolei.com",
      telefone: "(13) 98144-2093",
    },
    endereco: {
      cep: "11060-001",
      rua: "Av. Bartolomeu de Gusmão",
      numero: "75",
      bairro: "Embaré",
      cidade: "Santos",
      uf: "SP",
    },
    horario: { abre: "06:00", fecha: "22:00" },
    status: "ativa",
    quadras: [
      {
        id: "q1",
        nome: "Quadra Central",
        modalidade: "Futevôlei",
        camera: { id: "cam-201", nome: "Câmera Central", ip: "10.0.0.21", resolucao: "1080p", status: "online", ultimaConexao: min(0) },
        botao: { id: "bt-201", codigo: "BTN-201", tipo: "fisico", bateria: 91, status: "online" },
        replaysHoje: 44,
        ultimoReplay: min(2),
      },
      {
        id: "q2",
        nome: "Quadra Norte",
        modalidade: "Vôlei de praia",
        camera: { id: "cam-202", nome: "Câmera Norte", ip: "10.0.0.22", resolucao: "720p", status: "offline", ultimaConexao: min(96) },
        botao: { id: "bt-202", codigo: "QR-202", tipo: "qrcode", bateria: null, status: "online" },
        replaysHoje: 3,
        ultimoReplay: min(110),
      },
    ],
    config: { duracaoSeg: 45, retencaoDias: 15, qualidade: "1080p", marcaDagua: true },
    plano: { nome: "Pro", valorMensal: 349, diaVencimento: 5, pagamento: "pendente" },
    armazenamentoGb: 201,
    limiteArmazenamentoGb: 250,
    criadaEm: dias(63),
  },
  {
    id: "society-vila-nova",
    nome: "Society Vila Nova",
    proprietario: {
      nome: "Ricardo Menezes",
      documento: "45.987.112/0001-34",
      email: "contato@societyvilanova.com.br",
      telefone: "(16) 99230-7781",
    },
    endereco: {
      cep: "14020-260",
      rua: "Rua Garibaldi",
      numero: "940",
      bairro: "Vila Nova",
      cidade: "Ribeirão Preto",
      uf: "SP",
    },
    horario: { abre: "16:00", fecha: "00:00" },
    status: "ativa",
    quadras: [
      {
        id: "q1",
        nome: "Society A",
        modalidade: "Society",
        camera: { id: "cam-301", nome: "Câmera A", ip: "192.168.1.31", resolucao: "1080p", status: "online", ultimaConexao: min(1) },
        botao: { id: "bt-301", codigo: "BTN-301", tipo: "fisico", bateria: 58, status: "online" },
        replaysHoje: 12,
        ultimoReplay: min(48),
      },
    ],
    config: { duracaoSeg: 30, retencaoDias: 7, qualidade: "720p", marcaDagua: false },
    plano: { nome: "Básico", valorMensal: 199, diaVencimento: 20, pagamento: "atrasado" },
    armazenamentoGb: 41,
    limiteArmazenamentoGb: 100,
    criadaEm: dias(31),
  },
  {
    id: "beach-club-sol",
    nome: "Beach Club Sol",
    proprietario: {
      nome: "Fernanda Lopes",
      documento: "098.765.432-11",
      email: "fernanda@beachclubsol.com",
      telefone: "(48) 99671-0034",
    },
    endereco: {
      cep: "88062-000",
      rua: "Rod. João Gualberto Soares",
      numero: "3100",
      bairro: "Rio Vermelho",
      cidade: "Florianópolis",
      uf: "SC",
    },
    horario: { abre: "08:00", fecha: "22:00" },
    status: "instalacao",
    quadras: [
      {
        id: "q1",
        nome: "Quadra Sol",
        modalidade: "Beach tennis",
        camera: { id: "cam-401", nome: "Câmera Sol", ip: "—", resolucao: "1080p", status: "offline", ultimaConexao: dias(2) },
        botao: { id: "bt-401", codigo: "BTN-401", tipo: "fisico", bateria: 100, status: "offline" },
        replaysHoje: 0,
        ultimoReplay: null,
      },
      {
        id: "q2",
        nome: "Quadra Mar",
        modalidade: "Padel",
        camera: { id: "cam-402", nome: "Câmera Mar", ip: "—", resolucao: "1080p", status: "offline", ultimaConexao: dias(2) },
        botao: { id: "bt-402", codigo: "BTN-402", tipo: "fisico", bateria: 100, status: "offline" },
        replaysHoje: 0,
        ultimoReplay: null,
      },
    ],
    config: { duracaoSeg: 30, retencaoDias: 7, qualidade: "1080p", marcaDagua: true },
    plano: { nome: "Ilimitado", valorMensal: 549, diaVencimento: 15, pagamento: "em_dia" },
    armazenamentoGb: 0,
    limiteArmazenamentoGb: 500,
    criadaEm: dias(3),
  },
];

const combos: [string, string][] = [
  ["point-futevolei", "q1"],
  ["pe-na-areia", "q1"],
  ["pe-na-areia", "q2"],
  ["pe-na-areia", "q3"],
  ["society-vila-nova", "q1"],
  ["point-futevolei", "q2"],
];

export const replays: Replay[] = Array.from({ length: 18 }, (_, i) => {
  const [arenaId, quadraId] = combos[i % combos.length];
  const arena = arenas.find((a) => a.id === arenaId)!;
  const minutosAtras = i === 0 ? 1 : i * 23 + (i % 3) * 7;
  return {
    id: `rp-${1000 + i}`,
    arenaId,
    quadraId,
    criadoEm: i > 15 ? dias(9) : min(minutosAtras),
    duracaoSeg: arena.config.duracaoSeg,
    visualizacoes: i === 0 ? 0 : ((i * 37) % 120) + 3,
    status: i === 0 ? "processando" : i > 15 ? "expirado" : "pronto",
  };
});

export function buscarArena(id: string) {
  return arenas.find((a) => a.id === id);
}

export function totais() {
  const quadras = arenas.flatMap((a) => a.quadras);
  const cameras = quadras.map((q) => q.camera);
  return {
    arenasAtivas: arenas.filter((a) => a.status === "ativa").length,
    arenas: arenas.length,
    quadras: quadras.length,
    camerasOnline: cameras.filter((c) => c.status === "online").length,
    cameras: cameras.length,
    replaysHoje: quadras.reduce((s, q) => s + q.replaysHoje, 0),
    armazenamentoGb: arenas.reduce((s, a) => s + a.armazenamentoGb, 0),
    limiteGb: arenas.reduce((s, a) => s + a.limiteArmazenamentoGb, 0),
    receitaMensal: arenas
      .filter((a) => a.status !== "suspensa")
      .reduce((s, a) => s + a.plano.valorMensal, 0),
  };
}
