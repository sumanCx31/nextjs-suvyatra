
import { axiosInstance } from "@/config/axios.config";
import { IConfigParams } from "./service.contact";

abstract class BaseService {
  async getRequest(url: string, config: IConfigParams={}) {
    return await axiosInstance.get(url, config);
  }
  async postRequest(url: string, data: any = null, config: IConfigParams = {}) {
    return await axiosInstance.post(url, data, config);
  }
  async putRequest(url: string, data: any = null, config: IConfigParams = {}) {
    return await axiosInstance.put(url, data, config);
  }
  async patchRequest(url: string, data: any = null, config: IConfigParams = {}) {
    return await axiosInstance.patch(url, data, config);
  }
  async deleteRequest(url: string, config: IConfigParams = {}) {
    return await axiosInstance.delete(url, config);
  }
}

export default BaseService;