import { useLanguageStore } from "@infrastructure/storage/LanguageStore";
import { useMemo } from "react";

const useLanguagesDDL = () => {
  const { Languages, IsLanguagesLoading } = useLanguageStore();
  const LanguagesOption = useMemo(
    () =>
      Languages?.map((language) => {
        return {
          value: language.id,
          label: language.name,
        };
      }),
    [Languages]
  );
  return { LanguagesOption, Languages, IsLanguagesLoading };
};
export { useLanguagesDDL };
