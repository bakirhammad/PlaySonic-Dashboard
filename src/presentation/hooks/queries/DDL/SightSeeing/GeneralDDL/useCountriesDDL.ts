import { IDDlOption } from "@domain/entities";
import { useGeneralStore } from "@infrastructure/index";
import { toAbsoluteUrl } from "@presentation/helpers";
import { useMemo } from "react";

const useCountriesDDL = () => {
  const { Countries, IsCountryLoading } = useGeneralStore();
  const CountriesOption: IDDlOption[] = useMemo(
    () =>
      Countries?.data?.map((country) => {
        return {
          value: country.id,
          label: country?.translations[0]?.name,
          image: toAbsoluteUrl({
            pathname: country.flag,
            extension: ".webp",
            size: "_500x250",
          }),
        };
      }),
    [Countries]
  );
  return { CountriesOption, Countries, IsCountryLoading };
};
export { useCountriesDDL };
