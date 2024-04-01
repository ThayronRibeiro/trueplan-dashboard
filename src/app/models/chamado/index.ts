import { Usuario } from "../usuario";

export interface Chamado {
  id?: number;
  descricaoProblema: string;
  status: string;
  dataAbertura: string;
  dataFinalizacao?: string;
  prioridade?: string;
  cliente: string;
  contato: string;
  telefone1: string;
  tecnico?: string;
  tecnico2?: string;
  usuario: Usuario;
  categoria: string;
  observacao: string;
}
