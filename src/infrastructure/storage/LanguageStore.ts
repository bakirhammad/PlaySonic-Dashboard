import { ILanguageStore } from "@domain/entities/language/LanguageStore";
import { create } from "zustand";

export const useLanguageStore = create<ILanguageStore>((set) => ({
  Languages: [],
  setLanguages: (Languages) => set({ Languages: Languages }),
  reFetchLanguage: () => {},
  setReFetchLanguage: (reFetchLanguage) =>
    set({ reFetchLanguage: reFetchLanguage }),
  IsLanguagesLoading: true,
  setIsLanguagesLoading: (IsLanguagesLoading) =>
    set({ IsLanguagesLoading: IsLanguagesLoading }),
  isLanguageFetching: true,
  setIsLanguageFetching: (isLanguageFetching) =>
    set({ isLanguageFetching: isLanguageFetching }),
  LanguageError: "",
  setLanguageError: (LanguageError) => set({ LanguageError: LanguageError }),
}));
