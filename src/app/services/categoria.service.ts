import { AxiosResponse } from "axios";
import { Categoria } from "../models/categoria";
import { httpClient } from "../http";

const resourceUrl: string = "/api/v1/categorias";

export const useCategoriaService = () => {
  const listarTodasAsCategorias = async (): Promise<Categoria[]> => {
    const response: AxiosResponse<Categoria[]> = await httpClient.get(
      `${resourceUrl}`
    );
    return response.data;
  };

  const salvarCategoria = async (data: Categoria): Promise<Categoria> => {
    const response: AxiosResponse<Categoria> = await httpClient.post(
      `${resourceUrl}`,
      data
    );
    return response.data;
  };

  return {
    listarTodasAsCategorias,
    salvarCategoria,
  };
};
