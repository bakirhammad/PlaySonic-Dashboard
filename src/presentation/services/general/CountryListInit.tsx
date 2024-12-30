import { CountryQueryInstance } from "@app/useCases/general/country/query/CountryQuery";
import { CountryUrlEnum } from "@domain/enums";
import { useGeneralStore } from "@infrastructure/index";
import { QUERIES } from "@presentation/helpers";
import { useEffect } from "react";
import { useQuery } from "react-query";
export const CountryListInit = () => {
  const {
    setCountries,
    setIsCountryLoading,
    setIsCountryFetching,
    setCountryError,
    setReFetchCountry,
  } = useGeneralStore();

  const {
    data: countryData,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [QUERIES.countrylist],
    queryFn: () => {
      return CountryQueryInstance.getCountryList(CountryUrlEnum.GetCountryList);
    },
  });

  useEffect(() => {
    if (countryData) {
      setCountries(countryData);
    }
    setIsCountryLoading(isLoading);
    setIsCountryFetching(isFetching);
    setReFetchCountry(refetch);
    if (error instanceof Error) setCountryError(error?.message);
  }, [
    countryData,
    isLoading,
    isFetching,
    error,
    setIsCountryLoading,
    setIsCountryFetching,
    setCountries,
    setCountryError,
    setReFetchCountry,
    refetch,
  ]);
  return <></>;
};

export default CountryListInit;
