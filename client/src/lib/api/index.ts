import aspida from "@aspida/axios";
import api from "../../api/$api.ts";

import axios from 'axios';

import appConfig from '@/config/app';

const axiosIns = axios.create({
  baseURL: appConfig.apiUrl,
})

// Add request interceptor to automatically inject access token
axiosIns.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');

    // For FormData, delete Content-Type so axios can set it automatically with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const apiClient = api(aspida(axiosIns));
export const axiosInstance = axiosIns;