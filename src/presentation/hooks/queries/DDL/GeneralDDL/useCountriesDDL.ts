/* eslint-disable @typescript-eslint/no-explicit-any */
import { CountryQueryInstance } from "@app/useCases/general/country/query/CountryQuery";
import { ICountryBody, IDDlOption } from "@domain/entities";
import { CountryUrlEnum } from "@domain/enums";

import { useCallback, useEffect, useState } from "react";


function useCountriesDDL() {
  const [CountryList, setCountry] = useState<ICountryBody>();
  const [CountryOption, setCountryOption] = useState<IDDlOption[]>([]);
  const [isLoading, setIsLoadingCountry] = useState<boolean>(false);

  const fetchCountry = useCallback(async () => {
    try {
      setIsLoadingCountry(true);
      const CountryListRes = await CountryQueryInstance.getCountryList(
        CountryUrlEnum.GetCountryList
      );

      const _CountryOption = CountryListRes?.data?.map((Country) => {
        return {
          value: Country.id,
          label: Country.translations[0]?.name || "NA",
        };
      });

      setCountryOption(_CountryOption?.length ? _CountryOption : []);
      setCountry(CountryListRes);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingCountry(false);
    }
  }, []);

  useEffect(() => {
    fetchCountry();
  }, [fetchCountry]);
  return { CountryList, isCountryLoading: isLoading, CountryOption };
}

export { useCountriesDDL };
