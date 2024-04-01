import { Cliente } from "../cliente";
import { Usuario } from "../usuario";

export interface Chamado {
  id?: number;
  descricaoProblema: string;
  status: StatusChamado;
  dataAbertura: string;
  dataFinalizacao?: string;
  prioridade?: string;
  cliente: Cliente;
  contato: string;
  telefone1: string;
  telefone2: string;
  tecnico?: string;
  tecnico2?: string;
  usuario: Usuario;
  categoria: string;
  observacao: string;
}
