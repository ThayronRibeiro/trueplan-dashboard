import { Categoria } from "@/app/models/categoria";
import { ClienteDTO } from "../clienteDTO";
import { UsuarioDTO } from "../usuarioDTO";

export interface ChamadoResponseDTO {
  id: string;
  descricaoProblema: string;
  observacao: string;
  contato: string;
  telefone1: string;
  telefone2: string;
  status: StatusChamado;
  dataChamado: string;
  dataAbertura: string;
  dataFinalizacao: string;
  dataCancelamento: string;
  prioridade: string;
  cliente: ClienteDTO;
  usuario: UsuarioDTO;
  categoria: Categoria;
  tecnico: string;
  tecnico2: string;
}
