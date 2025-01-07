/* eslint-disable @typescript-eslint/no-explicit-any */


import { CityQueryInstance } from "@app/useCases/general/city/query/CityQuery";
import { IDDlOption } from "@domain/entities";
import { ICityBody } from "@domain/entities/general/city/City";
import { CityUrlEnum } from "@domain/enums/URL/General/GeneralEnum/CityEnum";
import { useCallback, useEffect, useState } from "react";


function useCitiesDDL() {
  const [CityList, setCity] = useState<ICityBody>();
  const [CityOption, setCityOption] = useState<IDDlOption[]>([]);
  const [isLoading, setIsLoadingCity] = useState<boolean>(false);

  const fetchCity = useCallback(async () => {
    try {
      setIsLoadingCity(true);
      const CityListRes = await CityQueryInstance.getCityList(
        CityUrlEnum.GetCityList
      );

      const _CityOption = CityListRes?.data?.map((City) => {
        return {
          value: City.id,
          label: City.translations[0]?.name,
        };
      });

      setCityOption(_CityOption?.length ? _CityOption : []);
      setCity(CityListRes);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingCity(false);
    }
  }, []);

  useEffect(() => {
    fetchCity();
  }, [fetchCity]);
  return { CityList, isCityLoading: isLoading, CityOption };
}

export { useCitiesDDL };
