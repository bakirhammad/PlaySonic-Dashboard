/* eslint-disable @typescript-eslint/no-explicit-any */
// import { HttpRequest, HttpResponse, IHttpClient } from '../../domain/entities/protocols/http'
import {
  HttpRequest,
  HttpResponse,
  IHttpClient,
} from "@domain/entities/protocols/http";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { LocalStorage } from "../cache/LocalStorageAdapter";
import { useAuthStore } from "@infrastructure/storage/AuthStore";
import { currenciesStore } from "@infrastructure/storage/currenciesStore";

const AUTH_LOCAL_STORAGE_KEY = import.meta.env.VITE_AUTH_LOCAL_STORAGE_KEY;

export class AxiosHttpClient implements IHttpClient {
  private api: AxiosInstance;

  private config: AxiosRequestConfig | undefined;
  private readonly localStorage;
  constructor(
    LocalStorage: LocalStorage,
    config?: AxiosRequestConfig | undefined
  ) {
    this.config = config;
    this.api = axios.create(this.config);
    this.localStorage = LocalStorage;
    this.setupInterceptors();
  }
  private setupInterceptors() {
    this.api.interceptors.request.use(
      (config) => {
        const auth = this.localStorage.get(AUTH_LOCAL_STORAGE_KEY);

        if (auth && auth.token && auth?.expiration) {
          const expirationDate = new Date(auth.expiration);
          const now = new Date();
          if (now >= expirationDate) {
            useAuthStore.setState(() => {
              return { auth: undefined, currentUser: undefined };
            });
            this.localStorage.set(AUTH_LOCAL_STORAGE_KEY, undefined);
          } else {
            config.headers.Authorization = `Bearer ${auth.token}`;
          }
        }
        const currencyId = currenciesStore.getState().systemCurrency?.value;

        if (currencyId) {
          config.headers.CurrencyId = currencyId;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
  async getRequest(data: HttpRequest): Promise<HttpResponse> {
    let axiosResponse: AxiosResponse;
    try {
      axiosResponse = await this.api.get(data.url, { data: data.body });
    } catch (error: any) {
      axiosResponse = error.response;
    }
    return {
      statusCode: axiosResponse?.status,
      data: axiosResponse?.data,
    };
  }

  async postRequest(data: HttpRequest): Promise<HttpResponse> {
    let axiosResponse: AxiosResponse;
    try {
      axiosResponse = await this.api.post(data.url, data.body);
    } catch (error: any) {
      axiosResponse = error.response;
    }
    return {
      statusCode: axiosResponse?.status,
      data: axiosResponse?.data,
    };
  }
  async putRequest(data: HttpRequest): Promise<HttpResponse> {
    let axiosResponse: AxiosResponse;
    try {
      axiosResponse = await this.api.put(data.url, data.body);
    } catch (error: any) {
      axiosResponse = error.response;
    }
    return {
      statusCode: axiosResponse?.status,
      data: axiosResponse?.data,
    };
  }
  async deleteRequest(data: HttpRequest): Promise<HttpResponse> {
    let axiosResponse: AxiosResponse;
    try {
      axiosResponse = await this.api.delete(data.url, { data: data.body });
    } catch (error: any) {
      axiosResponse = error.response;
    }
    return {
      statusCode: axiosResponse?.status,
      data: axiosResponse?.data,
    };
  }
}
