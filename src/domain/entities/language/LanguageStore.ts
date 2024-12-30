import { ILanguage } from "@domain/entities/language/Language";

export interface ILanguageStore {
  Languages: ILanguage[];
  setLanguages: (Languages: ILanguage[]) => void;
  IsLanguagesLoading: boolean;
  setIsLanguagesLoading: (IsLanguagesLoading: boolean) => void;
  reFetchLanguage: Function;
  setReFetchLanguage: (reFetchLanguage: Function) => void;
  LanguageError: string;
  setLanguageError: (LanguageError: string) => void;
  isLanguageFetching: boolean;
  setIsLanguageFetching: (isLanguageFetching: boolean) => void;
}
