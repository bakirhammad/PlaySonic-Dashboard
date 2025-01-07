import { useCitiesDDL } from "@presentation/hooks/queries/DDL/GeneralDDL/useCitiesDDL";
import { FC } from "react";

export interface ICityName {
  cityId: number;
}

const CityNameCell: FC<ICityName> = ({ cityId }) => {
  const { CityOption } = useCitiesDDL();
  const CityName = CityOption.map((elem) => {
    if (elem.value === cityId) {
      return elem.label || "NA";
    }
  });
  return CityName;
};

export default CityNameCell;
