import { AxiosHttpClient } from "@infrastructure/index";
import { makeLocalStorage } from "../chache/localStorage";

const API_URL = import.meta.env.VITE_APP_API_URL;

export const makeAxiosHttpClient = (): AxiosHttpClient => {
  return new AxiosHttpClient(makeLocalStorage(), {
    baseURL: API_URL,
    headers: {
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
