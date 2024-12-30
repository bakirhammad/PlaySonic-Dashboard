import { ICurrencyBody, ICurrencyData, IDDlOption } from "@domain/entities";
import { makeLocalStorage } from "@main/factories/chache/localStorage";
import { create } from "zustand";

const SYSTEM_CURRENCY_KEY = import.meta.env.VITE_APP_SYSTEM_CURRENCY_KEY;

interface ICurrencyStore {
  currenciesDDL: IDDlOption[];
  currenciesList: ICurrencyData[] | undefined;
  currencyDDLMap: { [key: string]: IDDlOption };
  systemCurrency: IDDlOption | null;
  setCurrencies: (currencies: ICurrencyBody) => void;
  setSystemCurrency: (systemCurrency: IDDlOption) => void;
}

const initCurrenciesState = {
  currenciesDDL: [],
  currenciesList: undefined,
  currencyDDLMap: {},
  systemCurrency: null,
};

export const currenciesStore = create<ICurrencyStore>((set) => ({
  ...initCurrenciesState,
  setCurrencies: (currencies) => {
    const currenciesDDL = currencies?.data?.map((currency) => {
      return {
        value: currency.id,
        label: `${currency.symbol}`,
        // label: `${currency.symbol} ${
        //   CurrencySymbol[currency.symbol as keyof typeof CurrencySymbol]
        // }`,
      };
    });

    const currencyDDLMap = currenciesDDL.reduce((acc, current) => {
      acc[current.value] = current;
      return acc;
    }, {} as { [key: string]: IDDlOption });

    const oldSystemCurrency = JSON.parse(
      localStorage.getItem(SYSTEM_CURRENCY_KEY) as string
    );
    if (!oldSystemCurrency) {
      makeLocalStorage().set(SYSTEM_CURRENCY_KEY, currenciesDDL[0]);
    }
    set({
      currenciesDDL,
      currencyDDLMap,
      currenciesList: currencies.data,
      systemCurrency: oldSystemCurrency ? oldSystemCurrency : currenciesDDL[0],
    });
  },
  setSystemCurrency: (systemCurrency) => {
    makeLocalStorage().set(SYSTEM_CURRENCY_KEY, systemCurrency);
    set({ systemCurrency: systemCurrency });
  },
}));
