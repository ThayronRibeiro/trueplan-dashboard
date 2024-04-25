import { httpClient } from "../http";
import { AxiosResponse } from "axios";

const resourceUrl: string = "/api/v1/statuschamado";

export const useStatusChamadoService = () => {
  const listarTodosStatus = async (): Promise<StatusChamado[]> => {
    const response: AxiosResponse<StatusChamado[]> = await httpClient.get(
      `${resourceUrl}`
    );
    return response.data;
  };

  const atualizarStatus = async (
    data: StatusChamado
  ): Promise<StatusChamado> => {
    const response: AxiosResponse<StatusChamado> = await httpClient.put(
      `${resourceUrl}/${data.id}`,
      data
    );
    return response.data;
  };

  return {
    listarTodosStatus,
    atualizarStatus,
  };
};
