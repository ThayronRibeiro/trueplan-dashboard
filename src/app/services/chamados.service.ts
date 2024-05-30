/* eslint-disable @typescript-eslint/ban-types */
import { httpClient } from "@/app/http";
import { AxiosError, AxiosResponse } from "axios";
import { Chamado } from "../models/chamado";
import { Bounce, toast } from "react-toastify";
import { ApiError, isApiError } from "../models/utils/Error";

const resourceUrl: string = "/api/v1/chamados";

export const useChamadoService = () => {
  const notifySucces = (message: string) =>
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: 0,
      theme: "colored",
      transition: Bounce,
    });

  const notifyError = (message: string) =>
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: 0,
      theme: "colored",
      transition: Bounce,
    });

  const listarDatas = async (): Promise<string[]> => {
    const response: AxiosResponse<string[]> = await httpClient.get(
      `${resourceUrl}/datas`
    );
    return response.data;
  };

  // const listarChamadosPorData = async (data: string): Promise<Chamado[]> => {
  //   const response: AxiosResponse<Chamado[]> = await httpClient.get(
  //     `${resourceUrl}/${data}`
  //   );
  //   return response.data;
  // };

  const listarChamadosPorData = async (data: string): Promise<Chamado[]> => {
    const response: AxiosResponse<Chamado[]> = await httpClient.get(
      `${resourceUrl}/${data}`
    );
    return response.data;
  };

  const salvarChamado = async (chamado: Chamado): Promise<Chamado> => {
    try {
      const response: AxiosResponse<Chamado> = await httpClient.post<Chamado>(
        `${resourceUrl}`,
        chamado
      );
      notifySucces("Chamado cadastrado com sucesso!");
      return response.data;
    } catch (err: unknown) {
      if (
        err instanceof AxiosError &&
        err.response &&
        isApiError(err.response.data)
      ) {
        const apiError: ApiError = err.response?.data;
        notifyError(apiError?.message);
      }
      throw err;
    }
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

  const reagendarChamado = async (chamado: Chamado): Promise<Chamado> => {
    try {
      const response: AxiosResponse<Chamado> = await httpClient.put(
        `${resourceUrl}/reagendarChamado`,
        chamado
      );
      notifySucces("Reagendamento concluído com sucesso!");
      return response.data;
    } catch (err: unknown) {
      if (
        err instanceof AxiosError &&
        err.response &&
        isApiError(err.response.data)
      ) {
        const apiError: ApiError = err.response?.data;
        notifyError(apiError?.message);
      }
      throw err;
    }
  };

  const reagendarChamados = async (chamados: Chamado[]): Promise<Chamado[]> => {
    const response: AxiosResponse<Chamado[]> = await httpClient.put(
      `${resourceUrl}/reagendarChamados`,
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
    reagendarChamado,
    reagendarChamados,
  };
};
