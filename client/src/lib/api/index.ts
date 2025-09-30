import aspida from "@aspida/axios";
import api from "../../api/$api.ts";

import axios from 'axios';

import appConfig from '@/config/app';

const axiosIns = axios.create({
  baseURL: appConfig.apiUrl,
})


export const apiClient = api(aspida(axiosIns));