import { useAreasDDL } from "@presentation/hooks/queries/DDL/GeneralDDL/useAreasDDL";
import { FC } from "react";

export interface IAreaName {
  areaId: number;
}

const AreaNameCell: FC<IAreaName> = ({ areaId }) => {
  const { AreaOption } = useAreasDDL();
  const AreaName = AreaOption.map((elem) => {
    if (elem.value === areaId) {
      return elem.label || "NA";
    }
  });
  return AreaName;
};

export default AreaNameCell;
