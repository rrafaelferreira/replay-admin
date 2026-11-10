// Modelo de dados do painel (só front-end por enquanto).
// Hierarquia: Proprietário → Arena (local) → Quadras → Câmera + Botão

export type Modalidade =
  | "Beach tennis"
  | "Futevôlei"
  | "Vôlei de praia"
  | "Futsal"
  | "Society"
  | "Padel"
  | "Tênis";

export const MODALIDADES: Modalidade[] = [
  "Beach tennis",
  "Futevôlei",
  "Vôlei de praia",
  "Futsal",
  "Society",
  "Padel",
  "Tênis",
];

export type StatusDispositivo = "online" | "instavel" | "offline";
export type StatusArena = "ativa" | "instalacao" | "suspensa";
export type StatusPagamento = "em_dia" | "pendente" | "atrasado";
export type Qualidade = "720p" | "1080p";

export interface Proprietario {
  nome: string;
  documento: string; // CPF ou CNPJ
  email: string;
  telefone: string; // WhatsApp
}

export interface Endereco {
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
}

export interface Camera {
  id: string;
  nome: string;
  ip: string;
  resolucao: Qualidade;
  status: StatusDispositivo;
  ultimaConexao: string; // ISO
}

export interface BotaoReplay {
  id: string;
  codigo: string;
  tipo: "fisico" | "qrcode";
  bateria: number | null; // % — null para QR code
  status: StatusDispositivo;
}

export interface Quadra {
  id: string;
  nome: string;
  modalidade: Modalidade;
  camera: Camera;
  botao: BotaoReplay;
  replaysHoje: number;
  ultimoReplay: string | null; // ISO
}

export interface ConfigReplay {
  duracaoSeg: number; // segundos salvos antes do clique
  retencaoDias: number; // por quanto tempo o vídeo fica disponível
  qualidade: Qualidade;
  marcaDagua: boolean; // logo da arena no vídeo
}

export interface Plano {
  nome: "Básico" | "Pro" | "Ilimitado";
  valorMensal: number;
  diaVencimento: number;
  pagamento: StatusPagamento;
}

export interface Arena {
  id: string;
  nome: string;
  proprietario: Proprietario;
  endereco: Endereco;
  horario: { abre: string; fecha: string };
  status: StatusArena;
  quadras: Quadra[];
  config: ConfigReplay;
  plano: Plano;
  armazenamentoGb: number;
  limiteArmazenamentoGb: number;
  criadaEm: string; // ISO
}

export interface Replay {
  id: string;
  arenaId: string;
  quadraId: string;
  criadoEm: string; // ISO
  duracaoSeg: number;
  visualizacoes: number;
  status: "pronto" | "processando" | "expirado";
}
