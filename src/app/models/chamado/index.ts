import { Categoria } from "../categoria";
import { Cliente } from "../cliente";
import { Usuario } from "../usuario";
import { PRIORIDADE } from "../utils/enums/PRIORIDADE";

export interface Chamado {
  id?: number | undefined;
  descricaoProblema: string;
  status: StatusChamado;
  dataAbertura: string;
  dataFinalizacao?: string;
  dataChamado: string;
  prioridade: PRIORIDADE;
  cliente: Cliente;
  contato: string;
  telefone1: string;
  telefone2: string | undefined;
  tecnico?: string;
  tecnico2?: string;
  usuario: Usuario;
  categoria: Categoria;
  observacao: string | undefined;
}
