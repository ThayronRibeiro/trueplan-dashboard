import Axios, { AxiosInstance } from "axios";

export const httpClientCnpjResponse: AxiosInstance = Axios.create({
  baseURL: "https://brasilapi.com.br/",
});
