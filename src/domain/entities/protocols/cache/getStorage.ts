import { AuthModel } from "@domain/entities";

export interface IGetStorage {
  get: (key: string) => AuthModel | undefined;
}
