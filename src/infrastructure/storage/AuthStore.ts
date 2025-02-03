import { IAuthStore } from "@domain/entities/authentication/AuthStore";
import { create } from "zustand";
import { makeLocalStorage } from "@main/factories/chache/localStorage";

const AUTH_LOCAL_STORAGE_KEY = import.meta.env.VITE_AUTH_LOCAL_STORAGE_KEY;

const auth = makeLocalStorage().get(AUTH_LOCAL_STORAGE_KEY);
const initAuthState = {
  auth: auth,
  currentUser: undefined,
  defaultUserCurrency: undefined,
  userCurrencies: [],
};
export const useAuthStore = create<IAuthStore>()((set) => {
  return {
    ...initAuthState,
    saveAuth: (auth) => {
      if (auth) {
        makeLocalStorage().set(AUTH_LOCAL_STORAGE_KEY, auth);
      } else {
        makeLocalStorage().set(AUTH_LOCAL_STORAGE_KEY, undefined);
      }
      set({ auth });
    },
    setCurrentUser: (user) => {
      set({ currentUser: user });
    },
    setUserCurrencies: (userCurrencies) => {
      const userCurrency = userCurrencies.find((c) => c.isDefault);
      const userCurrencyDDL = {
        value: userCurrency!.currencyId,
        label: `${userCurrency!.symbol}`,
        // label: `${userCurrency!.symbol} ${
        //   CurrencySymbol[userCurrency?.symbol as keyof typeof CurrencySymbol]
        // }`,
      };
      const userCurrenciesDDL = userCurrencies.map((c) => ({
        value: c.currencyId,
        label: `${c.symbol}`,
        // label: `${c.symbol} ${
        //   CurrencySymbol[c.symbol as keyof typeof CurrencySymbol]
        // }`,
      }));
      set({
        userCurrencies: userCurrenciesDDL,
        defaultUserCurrency: userCurrencyDDL,
      });
    },
    logout: () => {
      set(initAuthState);
      makeLocalStorage().set(AUTH_LOCAL_STORAGE_KEY, undefined);
    },
  };
});
