import { Endereco } from "../endereco";
import { Usuario } from "../usuario";

export interface Cliente {
  id?: string;
  nomeFantasia?: string;
  razaoSocial?: string;
  telefone1?: string;
  telefone2?: string;
  cnpj?: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;
  dataCadastro?: string;
  usuario?: Usuario;
  endereco?: Endereco;
  status?: string;
}
