/* eslint-disable @typescript-eslint/ban-types */
import { httpClient } from "@/app/http";
import { AxiosResponse } from "axios";
import { Chamado } from "../models/chamado";

const resourceUrl: string = "/api/v1/chamados";

export const useChamadoService = () => {
  const listarDatas = async (): Promise<string[]> => {
    const response: AxiosResponse<string[]> = await httpClient.get(
      `${resourceUrl}/datas`
    );
    return response.data;
  };

  const listarChamadosPorData = async (data: string): Promise<Chamado[]> => {
    const response: AxiosResponse<Chamado[]> = await httpClient.get(
      `${resourceUrl}/${data}`
    );
    return response.data;
  };

  const salvarChamado = async (chamado: Chamado): Promise<Chamado> => {
    const response: AxiosResponse<Chamado> = await httpClient.post<Chamado>(
      `${resourceUrl}`,
      chamado
    );
    return response.data;
  };

  const listarChamado = async (chamado: Chamado): Promise<Chamado> => {
    const response: AxiosResponse<Chamado> = await httpClient.get(
      `${resourceUrl}/id/${chamado.id}`
    );
    return response.data;
  };

  const atualizarChamado = async (chamado: Chamado): Promise<Chamado> => {
    const response: AxiosResponse<Chamado> = await httpClient.put(
      `${resourceUrl}/id/${chamado.id}`,
      chamado
    );
    return response.data;
  };

  const reagendarChamados = async (chamados: Chamado[]): Promise<Chamado[]> => {
    const response: AxiosResponse<Chamado[]> = await httpClient.put(
      `${resourceUrl}/reagendar`,
      chamados,
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  };

  return {
    listarDatas,
    salvarChamado,
    listarChamadosPorData,
    listarChamado,
    atualizarChamado,
    reagendarChamados,
  };
};
