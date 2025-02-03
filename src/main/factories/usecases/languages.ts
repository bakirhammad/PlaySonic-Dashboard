import { LanguageQuery } from "@app/useCases/languages/query/LanguageQuery";
import { AxiosHttpClient } from "@infrastructure/index";
import { makeLocalStorage } from "../chache/localStorage";

// Make it custom only for language to until create endpoint.
export const makeAxiosHttpClientCustom = (): AxiosHttpClient => {
  return new AxiosHttpClient(makeLocalStorage(), {
    baseURL: "https://bigdapi.kensoftware.com/api", /* "https://playsonic.kensoftware.com/api" */
    headers: {
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
};


export const makeRemotelanguages = (): LanguageQuery => {
  const remotelanguages = new LanguageQuery(makeAxiosHttpClientCustom());

  return remotelanguages;
};
