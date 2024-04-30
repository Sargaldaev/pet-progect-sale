import axios, { AxiosHeaders } from 'axios';
import { Store } from '@reduxjs/toolkit';
import { RootState } from './app/store.ts';
import { apiUrl } from './constans.ts';

export const axiosApi = axios.create({
  baseURL: apiUrl,
});

export const addInterceptors = (store: Store<RootState>) => {
  axiosApi.interceptors.request.use((config) => {
    const token = store.getState().user.user?.token;
    const headers = config.headers as AxiosHeaders;
    headers.set('Authorization', token);
    return config;
  });
};

export default axiosApi;
