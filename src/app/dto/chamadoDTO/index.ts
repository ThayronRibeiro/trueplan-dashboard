export interface ChamadoDTO {
  id?: string | undefined;
  clienteId: string;
  usuarioId: string;
  tecnicoId?: string | undefined;
  tecnico2Id?: string | undefined;
  contato: string;
  telefone1: string;
  telefone2: string | undefined;
  categoriaId: string;
  descricaoProblema: string;
  observacao: string | undefined;
  statusChamadoId: string;
  dataChamado: string;
  dataAbertura: string;
  dataFinalizacao?: string | undefined;
  dataCancelamento?: string | undefined;
  prioridade: string;
}
