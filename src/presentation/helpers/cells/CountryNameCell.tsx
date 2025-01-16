import { useCountriesDDL } from "@presentation/hooks/queries/DDL/GeneralDDL/useCountriesDDL";
import { FC } from "react";

export interface ICountryName {
  countryId: number;
}

const CountryNameCell: FC<ICountryName> = ({ countryId }) => {
  const { CountryOption } = useCountriesDDL();
  const countryName = CountryOption.map((elem) => {
    if (elem.value === countryId) {
      return elem.label || "NA";
    }
  });

  return countryName;
};

export default CountryNameCell;
