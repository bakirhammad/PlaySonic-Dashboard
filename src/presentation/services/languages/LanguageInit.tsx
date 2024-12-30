import { useLanguageStore } from "@infrastructure/storage/LanguageStore";
import { makeRemotelanguages } from "@main/factories/usecases/languages";
import { CustomToast } from "@presentation/components/alerts/CustomToast";
import { QUERIES } from "@presentation/helpers";
import { useEffect } from "react";
import { useQuery } from "react-query";

export const LanguageInit = () => {
  const {
    setLanguages,
    setIsLanguageFetching,
    setIsLanguagesLoading,
    setLanguageError,
    setReFetchLanguage,
  } = useLanguageStore();
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: [QUERIES.languageList],
    queryFn: async () => {
      try {
        const languageListResponse =
          await makeRemotelanguages().getLanguageList("General/Language/List");

        return languageListResponse;
      } catch (error) {
        console.error("Error getting language form:", error);
        CustomToast(`Failed to get language data`, "error");
      }
    },
    cacheTime: 0,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
  useEffect(() => {
    if (data) {
      setLanguages(data);
    }
    setIsLanguagesLoading(isLoading);
    setIsLanguageFetching(isFetching);
    setReFetchLanguage(refetch);
    if (error instanceof Error) setLanguageError(error?.message);
  }, [
    data,
    isFetching,
    isLoading,
    error,
    setLanguages,
    setIsLanguageFetching,
    setIsLanguagesLoading,
    setLanguageError,
    setReFetchLanguage,
    refetch,
  ]);
  return <></>;
};
