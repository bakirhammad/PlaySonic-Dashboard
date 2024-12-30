import { Authentication } from "@app/useCases/authentication/query";
import { makeAxiosHttpClient } from "../http/AxiosHttpClient";

export const makeRemoteAuthentication = (): Authentication => {
  const remoteAuthentication = new Authentication(makeAxiosHttpClient());

  return remoteAuthentication;
};
