import { makeAxiosHttpClient } from "../http/AxiosHttpClient";
import { LanguageQuery } from "@app/useCases/languages/query/LanguageQuery";

export const makeRemotelanguages = (): LanguageQuery => {
  const remotelanguages = new LanguageQuery(makeAxiosHttpClient());

  return remotelanguages;
};
