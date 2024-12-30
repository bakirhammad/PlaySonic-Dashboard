/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpStatusCode } from "@domain/enums";

export type HttpRequest = {
  url: string;
  body?: unknown;
  id?: number;
};

export interface IHttpClient {
  getRequest: (data: HttpRequest) => Promise<HttpResponse>;
  postRequest: (data: HttpRequest) => Promise<HttpResponse>;
  putRequest: (data: HttpRequest) => Promise<HttpResponse>;
  deleteRequest: (data: HttpRequest) => Promise<HttpResponse>;
}

export type HttpResponse = {
  statusCode: HttpStatusCode;
  data: Data & DataOnError;
};
export type Data<T = any> = {
  code: number;
  value: T;
  isSuccess: boolean;
  isFailure: boolean;
  errors: {
    key: string[];
  };
};
export type DataOnError = {
  code: string;
  message: string;
};
