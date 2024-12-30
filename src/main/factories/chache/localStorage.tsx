import { LocalStorage } from "@infrastructure/index";

export const makeLocalStorage = (): LocalStorage => new LocalStorage();
