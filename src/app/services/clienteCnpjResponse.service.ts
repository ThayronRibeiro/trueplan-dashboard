import { httpClientCnpjResponse } from "@/app/api/BrasilApi";
import { AxiosResponse } from "axios";
import { ClienteCnpjResponse } from "../models/clienteCnpjResponse";

const resourceUrl: string = "api/cnpj/v1";

export const useClienteCnpjResponse = () => {
  const getCnpj = async (cnpj: string): Promise<ClienteCnpjResponse> => {
    const response: AxiosResponse<ClienteCnpjResponse> =
      await httpClientCnpjResponse.get(`${resourceUrl}/${cnpj}`);
    return response.data;
  };

  return {
    getCnpj,
  };
};
