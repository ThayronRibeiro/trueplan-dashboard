export interface ClienteCnpjResponse {
  uf?: string;
  cep?: string;
  qsa?: [
    {
      pais?: string;
      nome_socio?: string;
      codigo_pais?: string;
      faixa_etaria?: string;
      cnpj_cpf_do_socio?: string;
      qualificacao_socio?: string;
      codigo_faixa_etaria?: string;
      data_entrada_sociedade?: string;
      identificador_de_socio?: string;
      cpf_representante_legal?: string;
      nome_representante_legal?: string;
      codigo_qualificacao_socio?: string;
      qualificacao_representante_legal?: string;
      codigo_qualificacao_representante_legal?: string;
    }
  ];
  cnpj?: string;
  pais?: string;
  email?: string;
  porte?: string;
  bairro?: string;
  numero?: string;
  ddd_fax?: string;
  municipio?: string;
  logradouro?: string;
  cnae_fiscal?: string;
  codigo_pais?: string;
  complemento?: string;
  codigo_porte?: string;
  razao_social?: string;
  nome_fantasia?: string;
  capital_social?: string;
  ddd_telefone_1?: string;
  ddd_telefone_2?: string;
  opcao_pelo_mei?: string;
  descricao_porte?: string;
  codigo_municipio?: string;
  cnaes_secundarios?: [
    {
      codigo?: string;
      descricao?: string;
    }
  ];
  natureza_juridica?: string;
  situacao_especial?: string;
  opcao_pelo_simples?: string;
  situacao_cadastral?: string;
  data_opcao_pelo_mei?: string;
  data_exclusao_do_mei?: string;
  cnae_fiscal_descricao?: string;
  codigo_municipio_ibge?: string;
  data_inicio_atividade?: string;
  data_situacao_especial?: string;
  data_opcao_pelo_simples?: string;
  data_situacao_cadastral?: string;
  nome_cidade_no_exterior?: string;
  codigo_natureza_juridica?: string;
  data_exclusao_do_simples?: string;
  motivo_situacao_cadastral?: string;
  ente_federativo_responsavel?: string;
  identificador_matriz_filial?: string;
  qualificacao_do_responsavel?: string;
  descricao_situacao_cadastral?: string;
  descricao_tipo_de_logradouro?: string;
  descricao_motivo_situacao_cadastral?: string;
  descricao_identificador_matriz_filial?: string;
}
