export interface Endereco {
  id?: string;
  logradouro: string;
  numero: string;
  bairro?: string;
  cidade: string;
  codigoCidade: string;
  ufEstado: string;
  cep?: string;
  complemento?: string;
  pontoReferencia?: string;
}
