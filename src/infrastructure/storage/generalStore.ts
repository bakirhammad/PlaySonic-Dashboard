import { IGeneralStore } from "@domain/entities/general/generalStore";
import { create } from "zustand";

export const useGeneralStore = create<IGeneralStore>((set) => ({
  Countries: {
    pageNumber: 0,
    pageSize: 0,
    totalRecords: 0,
    totalPages: 0,
    data: [],
  },
  setCountries: (Countries) => set({ Countries: Countries }),
  reFetchCountry: () => {},
  setReFetchCountry: (reFetchCountry) =>
    set({ reFetchCountry: reFetchCountry }),
  IsCountryLoading: true,
  setIsCountryLoading: (IsCountryLoading) =>
    set({ IsCountryLoading: IsCountryLoading }),
  IsCountryFetching: true,
  setIsCountryFetching: (IsCountryFetching) =>
    set({ IsCountryFetching: IsCountryFetching }),
  CountryError: "",
  setCountryError: (CountryError) => set({ CountryError: CountryError }),
}));
