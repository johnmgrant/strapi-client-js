import axios, { InternalAxiosRequestConfig, AxiosInstance } from 'axios';

export const getAxiosInstance = (url: string, apiToken?: string): AxiosInstance => {
  const API = axios.create();

  API.defaults.baseURL = url;

  const axiosConfig = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (apiToken) {
      config.headers.Authorization = `Bearer ${apiToken}`;
    }
    return config;
  };

  API.interceptors.request.use(axiosConfig);

  return API;
};
