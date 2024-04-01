import { httpClient } from "@/app/http";
import { AxiosResponse } from "axios";
import { Cliente } from "../models/cliente";

const resourceUrl: string = "/api/v1/clientes";

export const useClienteService = () => {
  const listarTodosOsClientes = async (): Promise<Cliente[]> => {
    const response: AxiosResponse<Cliente[]> = await httpClient.get(
      `${resourceUrl}`
    );
    return response.data;
  };

  return {
    listarTodosOsClientes,
  };
};
