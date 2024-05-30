export interface ChamadoDTO {
  id: string;
  nomeCliente: string;
  contato: string;
  telefone1: string;
  telefone2: string | undefined;
  descricaoProblema: string;
  observacao: string;
  status: StatusChamado;
  dataChamado: string;
  dataAbertura: string;
  dataFinalizacao: string;
  dataCancelamento: string;
  prioridade: string;
  nomeTecnico: string;
  nomeTecnico2: string;
  nomeUsuario: string;
}
