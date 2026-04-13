import { AxiosRequestConfig } from "axios";

export interface IConfigParams {
  headers?: AxiosRequestConfig["headers"];
  params?: {
    [key: string]: unknown;
  };
}