import {
  IGetStorage,
  ISetStorage,
} from "../../domain/entities/protocols/cache";

export class LocalStorage implements ISetStorage, IGetStorage {
  set(key: string, value: object | undefined): void {
    if (!localStorage) {
      return;
    }
    if (value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error("AUTH LOCAL STORAGE SAVE ERROR", error);
      }
    } else {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error("AUTH LOCAL STORAGE REMOVE ERROR", error);
      }
    }
  }

  get(key: string) {
    if (!localStorage) {
      return undefined;
    }
    const lsValue: string | null = localStorage.getItem(key);
    if (!lsValue) {
      return undefined;
    }

    try {
      const auth = JSON.parse(lsValue);
      if (auth) {
        // here will check auth_token expiration
        return auth;
      }
    } catch (error) {
      console.error("AUTH LOCAL STORAGE PARSE ERROR", error);
      return undefined;
    }
  }
}
